import { useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { getVisibleContractsSortedByUrgency, ContractWithHealth } from "@/services/contractService";
import { useAuth } from "@/hooks/useAuth";
import { Clock, Calendar, Mail, CheckCircle2 } from "lucide-react";
import HealthBadge from "@/components/HealthBadge";
import { getPriorityLabel, getHealthBorderClass } from "@/utils/contractUtils";
import { formatDate } from "@/utils/dateUtils";

export default function Alerts() {
  const { user } = useAuth();
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});

  const alertsData = getVisibleContractsSortedByUrgency(user)
    .filter(c => c.daysRemaining < 90)
    .map(c => ({
      ...c,
      priorityLabel: getPriorityLabel(c.daysRemaining)
    }));

  if (alertsData.length === 0) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Alerts Center</h1>
            <p className="text-slate-500 text-sm">Prioritized contract renewals requiring attention</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h2 className="text-2xl font-bold text-slate-900">No renewal alerts at this time.</h2>
          <p className="text-slate-500">All contracts are healthy.</p>
        </div>
      </div>
    );
  }

  const criticalCount = alertsData.filter(a => a.priorityLabel === "Critical").length;
  const highCount = alertsData.filter(a => a.priorityLabel === "High").length;
  const mediumCount = alertsData.filter(a => a.priorityLabel === "Medium").length;
  const lowCount = alertsData.filter(a => a.priorityLabel === "Low").length;

  const toggleAcknowledge = (id: string) => {
    setAcknowledged(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderAlertCard = (alert: ContractWithHealth & { priorityLabel: string }) => {
    const isAck = acknowledged[alert.id];
    const borderColor = getHealthBorderClass(alert.healthStatus);

    return (
      <Card key={alert.id} className={`overflow-hidden border-l-4 ${borderColor} ${isAck ? 'opacity-60 grayscale-[0.5]' : ''} shadow-sm transition-all`}>
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <HealthBadge daysRemaining={alert.daysRemaining} />
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Ack</span>
                <Switch checked={!!isAck} onCheckedChange={() => toggleAcknowledge(alert.id)} />
              </div>
            </div>
          </div>
          
          <h3 className={`text-xl font-black tracking-tight mb-1 ${isAck ? 'text-slate-600' : 'text-slate-900'}`}>{alert.academyName}</h3>
          
          <div className="grid grid-cols-2 gap-4 mt-6 mb-6">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Days Remaining</div>
              <div className={`text-3xl font-black ${alert.priorityLabel === 'Critical' ? 'text-red-600' : 'text-slate-900'}`}>
                {alert.daysRemaining}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Renewal Date</div>
              <div className="font-bold text-slate-700 flex items-center justify-end">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {formatDate(alert.contractExpiryDate)}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center mb-6 border border-slate-100">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">Value</div>
              <div className="font-bold text-slate-900">₹{(alert.currentContractValue/100000).toFixed(1)}L</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">Manager</div>
              <div className="font-medium text-slate-700 text-sm">{alert.relationshipManager}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-white hover:bg-slate-50 text-slate-700">
              <Mail className="h-4 w-4 mr-2" /> Contact RM
            </Button>
            <Link href={`/contracts/${alert.id}`} className="flex-1">
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">View Contract</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Alerts Center</h1>
          <p className="text-slate-500 text-sm">Prioritized contract renewals requiring attention</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge className="bg-red-100 text-red-800 border-none px-3 py-1 text-sm font-semibold">Critical: {criticalCount}</Badge>
          <Badge className="bg-orange-100 text-orange-800 border-none px-3 py-1 text-sm font-semibold">High: {highCount}</Badge>
          <Badge className="bg-amber-100 text-amber-800 border-none px-3 py-1 text-sm font-semibold">Medium: {mediumCount}</Badge>
          <Badge className="bg-green-100 text-green-800 border-none px-3 py-1 text-sm font-semibold">Low: {lowCount}</Badge>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 bg-transparent h-auto p-0 space-x-2 flex-wrap gap-y-2">
          <TabsTrigger value="all" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-md px-4 py-2 border border-slate-200 bg-white shadow-sm font-medium">
            All Alerts <Badge variant="secondary" className="ml-2 bg-slate-200/50 text-current border-none">{alertsData.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="critical" className="data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:border-red-600 rounded-md px-4 py-2 border border-slate-200 bg-white shadow-sm font-medium">
            Critical (&lt;7 Days) <Badge variant="secondary" className="ml-2 bg-slate-200/50 text-current border-none">{criticalCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="high" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:border-orange-600 rounded-md px-4 py-2 border border-slate-200 bg-white shadow-sm font-medium">
            High (7-30 Days) <Badge variant="secondary" className="ml-2 bg-slate-200/50 text-current border-none">{highCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="medium" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:border-amber-600 rounded-md px-4 py-2 border border-slate-200 bg-white shadow-sm font-medium">
            Medium (30-60 Days) <Badge variant="secondary" className="ml-2 bg-slate-200/50 text-current border-none">{mediumCount}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="m-0 border-none p-0 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alertsData.map(renderAlertCard)}
          </div>
        </TabsContent>
        <TabsContent value="critical" className="m-0 border-none p-0 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alertsData.filter(a => a.priorityLabel === "Critical").map(renderAlertCard)}
          </div>
        </TabsContent>
        <TabsContent value="high" className="m-0 border-none p-0 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alertsData.filter(a => a.priorityLabel === "High").map(renderAlertCard)}
          </div>
        </TabsContent>
        <TabsContent value="medium" className="m-0 border-none p-0 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alertsData.filter(a => a.priorityLabel === "Medium").map(renderAlertCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
