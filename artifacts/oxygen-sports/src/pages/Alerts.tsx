import { useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockContracts } from "@/data/contracts";
import { AlertTriangle, Clock, Calendar, Mail } from "lucide-react";

export default function Alerts() {
  const expiringContracts = mockContracts.filter(c => c.status === "Expiring Soon");
  
  // Sort by expiry date
  const sortedAlerts = [...expiringContracts].sort((a, b) => 
    new Date(a.contractExpiryDate).getTime() - new Date(b.contractExpiryDate).getTime()
  );

  const getPriority = (days: number) => {
    if (days < 15) return { label: "Critical", color: "bg-red-500", badge: "bg-red-100 text-red-800" };
    if (days < 30) return { label: "High", color: "bg-orange-500", badge: "bg-orange-100 text-orange-800" };
    if (days < 60) return { label: "Medium", color: "bg-yellow-500", badge: "bg-yellow-100 text-yellow-800" };
    return { label: "Low", color: "bg-green-500", badge: "bg-green-100 text-green-800" };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Alerts Center</h1>
        <p className="text-slate-500 text-sm">Never miss a contract renewal</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 bg-transparent h-auto p-0 space-x-2 flex-wrap gap-y-2">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-4 py-2 border border-slate-200">
            All Alerts <Badge variant="secondary" className="ml-2 bg-white/20 text-current">{sortedAlerts.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="7days" className="data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:border-red-500 rounded-full px-4 py-2 border border-slate-200">
            Expiring in 7 Days <Badge variant="secondary" className="ml-2 bg-white/20 text-current">0</Badge>
          </TabsTrigger>
          <TabsTrigger value="30days" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:border-orange-500 rounded-full px-4 py-2 border border-slate-200">
            Expiring in 30 Days <Badge variant="secondary" className="ml-2 bg-white/20 text-current">{sortedAlerts.filter(c => {
              const days = Math.floor((new Date(c.contractExpiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) + 180;
              return days <= 30;
            }).length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="60days" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:border-yellow-500 rounded-full px-4 py-2 border border-slate-200">
            Expiring in 60 Days <Badge variant="secondary" className="ml-2 bg-white/20 text-current">{sortedAlerts.filter(c => {
              const days = Math.floor((new Date(c.contractExpiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) + 180;
              return days > 30 && days <= 60;
            }).length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="90days" className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:border-green-500 rounded-full px-4 py-2 border border-slate-200">
            Expiring in 90+ Days <Badge variant="secondary" className="ml-2 bg-white/20 text-current">{sortedAlerts.filter(c => {
              const days = Math.floor((new Date(c.contractExpiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) + 180;
              return days > 60;
            }).length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="m-0 border-none p-0 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAlerts.map(contract => {
              const daysRemaining = Math.floor((new Date(contract.contractExpiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) + 180;
              const priority = getPriority(daysRemaining);

              return (
                <Card key={contract.id} className="overflow-hidden border-l-4" style={{borderLeftColor: priority.label === 'Critical' ? '#ef4444' : priority.label === 'High' ? '#f97316' : priority.label === 'Medium' ? '#eab308' : '#22c55e'}}>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <Badge className={`${priority.badge} border-none font-semibold uppercase tracking-wider text-[10px]`}>
                        {priority.label}
                      </Badge>
                      <span className="text-xs font-medium text-slate-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {daysRemaining} Days Left
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{contract.academyName}</h3>
                    <p className="text-sm text-slate-500 mb-4 flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                      Renews: {new Date(contract.contractExpiryDate).toLocaleDateString('en-IN')}
                    </p>

                    <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center mb-5 border border-slate-100">
                      <div>
                        <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 mb-0.5">Contract Value</div>
                        <div className="font-bold text-slate-900">₹{(contract.currentContractValue/100000).toFixed(1)}L</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 mb-0.5">Manager</div>
                        <div className="font-medium text-slate-700 text-sm">{contract.relationshipManager}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 bg-white hover:bg-slate-50">
                        <Mail className="h-4 w-4 mr-2" /> Contact
                      </Button>
                      <Link href={`/contracts/${contract.id}`} className="flex-1">
                        <Button className="w-full">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        {/* Other tab contents would filter appropriately */}
      </Tabs>
    </div>
  );
}