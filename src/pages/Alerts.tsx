import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { getContractsSortedByUrgency, ContractWithHealth } from "@/services/contractService";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, CheckCircle2, User, Loader2 } from "lucide-react";
import HealthBadge from "@/components/HealthBadge";
import { getHealthBorderClass } from "@/utils/contractUtils";
import { formatDate } from "@/utils/dateUtils";

/** Map days remaining to alert tier */
function getAlertTier(days: number): { label: string; color: string } {
  if (days < 7)  return { label: "Critical",  color: "text-red-700 bg-red-50 border-red-200" };
  if (days < 30) return { label: "High Risk",  color: "text-orange-700 bg-orange-50 border-orange-200" };
  if (days < 90) return { label: "Attention",  color: "text-yellow-700 bg-yellow-50 border-yellow-200" };
  return           { label: "Healthy",    color: "text-green-700 bg-green-50 border-green-200" };
}

type AlertContract = ContractWithHealth & { tier: { label: string; color: string } };

export default function Alerts() {
  const { user } = useAuth();
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});
  const [alertsData, setAlertsData] = useState<AlertContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function loadAlerts() {
      setIsLoading(true);
      try {
        const sorted = await getContractsSortedByUrgency(user);
        const alerts = sorted
          .filter((c) => c.daysRemaining >= 0 && c.daysRemaining < 90)
          .map((c) => ({ ...c, tier: getAlertTier(c.daysRemaining) }));
        setAlertsData(alerts);
      } catch (err) {
        console.error("Failed to load alerts:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAlerts();
  }, [user]);

  const criticalCount  = alertsData.filter((a) => a.daysRemaining < 7).length;
  const highRiskCount  = alertsData.filter((a) => a.daysRemaining >= 7 && a.daysRemaining < 30).length;
  const attentionCount = alertsData.filter((a) => a.daysRemaining >= 30 && a.daysRemaining < 90).length;

  const toggleAck = (id: string) =>
    setAcknowledged((prev) => ({ ...prev, [id]: !prev[id] }));

  const renderCard = (alert: AlertContract) => {
    const isAck = acknowledged[alert.id];
    const borderColor = getHealthBorderClass(alert.healthStatus);

    return (
      <Card
        key={alert.id}
        className={`overflow-hidden border-l-4 ${borderColor} ${isAck ? "opacity-60" : ""} shadow-sm transition-all`}
      >
        <CardContent className="p-5 space-y-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <HealthBadge daysRemaining={alert.daysRemaining} />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Acknowledged</span>
              <Switch checked={!!isAck} onCheckedChange={() => toggleAck(alert.id)} />
            </div>
          </div>

          {/* Academy name */}
          <h3 className={`text-lg font-black tracking-tight ${isAck ? "text-slate-500" : "text-slate-900"}`}>
            {alert.academyName}
          </h3>

          {/* Days remaining + expiry */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Days Remaining</div>
              <div className={`text-2xl font-black ${alert.daysRemaining < 7 ? "text-red-600" : "text-slate-900"}`}>
                {alert.daysRemaining < 0 ? "Expired" : alert.daysRemaining}
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Expiry Date</div>
              <div className="flex items-center gap-1 text-sm font-semibold text-slate-700 mt-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {formatDate(alert.contractEndDate)}
              </div>
            </div>
          </div>

          {/* RM — show to admin or as "Your contract" to RM */}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <User className="h-4 w-4 text-slate-400 shrink-0" />
            <span>
              {user?.role === "admin"
                ? <><span className="font-medium">RM:</span> {alert.relationshipManagerName}</>
                : <span className="text-slate-500">Your assigned contract</span>
              }
            </span>
          </div>

          {/* Action */}
          <Link href={`/contracts/${alert.id}`}>
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
              View Contract
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-500 text-sm font-medium">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Alerts Center</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {user?.role === "admin"
              ? "Contracts across all managers requiring attention"
              : "Your contracts requiring attention"}
          </p>
        </div>
        {alertsData.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {criticalCount > 0  && <Badge className="bg-red-100 text-red-800 border-none px-3 py-1 font-semibold">Critical: {criticalCount}</Badge>}
            {highRiskCount > 0  && <Badge className="bg-orange-100 text-orange-800 border-none px-3 py-1 font-semibold">High Risk: {highRiskCount}</Badge>}
            {attentionCount > 0 && <Badge className="bg-yellow-100 text-yellow-800 border-none px-3 py-1 font-semibold">Attention: {attentionCount}</Badge>}
          </div>
        )}
      </div>

      {/* Empty state */}
      {alertsData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
          <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">No Alerts Available</h2>
          <p className="text-slate-500 text-sm">All contracts are healthy — no action required.</p>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 bg-transparent h-auto p-0 flex flex-wrap gap-2">
            <TabsTrigger value="all" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-md px-4 py-2 border border-slate-200 bg-white shadow-sm font-medium text-sm">
              All Alerts <Badge variant="secondary" className="ml-2">{alertsData.length}</Badge>
            </TabsTrigger>
            {criticalCount > 0 && (
              <TabsTrigger value="critical" className="data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:border-red-600 rounded-md px-4 py-2 border border-slate-200 bg-white shadow-sm font-medium text-sm">
                Critical (&lt;7 days) <Badge variant="secondary" className="ml-2">{criticalCount}</Badge>
              </TabsTrigger>
            )}
            {highRiskCount > 0 && (
              <TabsTrigger value="high" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:border-orange-600 rounded-md px-4 py-2 border border-slate-200 bg-white shadow-sm font-medium text-sm">
                High Risk (7-30 days) <Badge variant="secondary" className="ml-2">{highRiskCount}</Badge>
              </TabsTrigger>
            )}
            {attentionCount > 0 && (
              <TabsTrigger value="attention" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white data-[state=active]:border-yellow-600 rounded-md px-4 py-2 border border-slate-200 bg-white shadow-sm font-medium text-sm">
                Attention (30-90 days) <Badge variant="secondary" className="ml-2">{attentionCount}</Badge>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="all" className="m-0 border-none p-0 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {alertsData.map(renderCard)}
            </div>
          </TabsContent>
          <TabsContent value="critical" className="m-0 border-none p-0 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {alertsData.filter((a) => a.daysRemaining < 7).map(renderCard)}
            </div>
          </TabsContent>
          <TabsContent value="high" className="m-0 border-none p-0 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {alertsData.filter((a) => a.daysRemaining >= 7 && a.daysRemaining < 30).map(renderCard)}
            </div>
          </TabsContent>
          <TabsContent value="attention" className="m-0 border-none p-0 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {alertsData.filter((a) => a.daysRemaining >= 30 && a.daysRemaining < 90).map(renderCard)}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
