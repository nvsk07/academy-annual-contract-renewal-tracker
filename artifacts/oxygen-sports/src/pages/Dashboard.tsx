import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getContractsSortedByUrgency, getHealthSummary, getContractsExpiringWithin, getAllContracts } from "@/services/contractService";
import { mockActivity } from "@/data/activity";
import HealthBadge from "@/components/HealthBadge";
import { 
  AlertCircle, Activity as ActivityIcon, Plus, TrendingUp, CheckCircle, Clock, 
  ArrowRight, Bell, RefreshCw
} from "lucide-react";
import { formatDate } from "@/utils/dateUtils";

export default function Dashboard() {
  const allContracts = getAllContracts();
  
  const expiringWithin7 = getContractsExpiringWithin(7).length;
  const expiringWithin30 = getContractsExpiringWithin(30).length;
  const pendingRenewals = allContracts.filter(c => c.status === "Expiring Soon").length;
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentlyUpdated = allContracts.filter(c => new Date(c.updatedAt) >= sevenDaysAgo).length;

  const healthCounts = getHealthSummary();

  const immediateAttention = getContractsSortedByUrgency()
    .filter(c => c.healthStatus === "critical" || c.healthStatus === "high-risk")
    .slice(0, 5);

  const stageCounts = {
    created: allContracts.filter(c => c.status === "Active" && c.daysRemaining > 90).length,
    active: allContracts.filter(c => c.status === "Active" && c.daysRemaining <= 90 && c.daysRemaining > 30).length,
    reminder: allContracts.filter(c => c.status === "Expiring Soon").length,
    negotiation: 0, // Placeholder
    renewed: allContracts.filter(c => c.status === "Renewed").length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm">Action-oriented overview of your contracts</p>
        </div>
        <Link href="/contracts/new">
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" /> Add Contract
          </Button>
        </Link>
      </div>

      {/* Section 1: Today's Priorities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-red-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiring ≤ 7 Days</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-900">{expiringWithin7}</h3>
              </div>
              <div className="p-2 bg-red-50 rounded-lg text-red-500">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
            <Link href="/alerts" className="mt-4 flex items-center text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors">
              View All <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiring ≤ 30 Days</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-900">{expiringWithin30}</h3>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <Link href="/alerts" className="mt-4 flex items-center text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors">
              View All <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-amber-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Renewals</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-900">{pendingRenewals}</h3>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <ActivityIcon className="h-5 w-5" />
              </div>
            </div>
            <Link href="/contracts/renewal-tracker" className="mt-4 flex items-center text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors">
              View All <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recently Updated</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-900">{recentlyUpdated}</h3>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <Link href="/contracts" className="mt-4 flex items-center text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors">
              View All <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Section 2: Contract Health Overview */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ActivityIcon className="h-4 w-4 text-blue-600" /> Contract Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 px-4 py-2 rounded-lg flex-1 min-w-[150px]">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="flex-1">
                <div className="text-xs font-medium text-red-800 uppercase">Critical</div>
                <div className="text-xl font-bold text-red-900 leading-tight">{healthCounts.critical}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 px-4 py-2 rounded-lg flex-1 min-w-[150px]">
              <div className="h-3 w-3 rounded-full bg-orange-500"></div>
              <div className="flex-1">
                <div className="text-xs font-medium text-orange-800 uppercase">High Risk</div>
                <div className="text-xl font-bold text-orange-900 leading-tight">{healthCounts["high-risk"]}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 px-4 py-2 rounded-lg flex-1 min-w-[150px]">
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="flex-1">
                <div className="text-xs font-medium text-yellow-800 uppercase">Attention</div>
                <div className="text-xl font-bold text-yellow-900 leading-tight">{healthCounts.attention}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-4 py-2 rounded-lg flex-1 min-w-[150px]">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <div className="flex-1">
                <div className="text-xs font-medium text-green-800 uppercase">Healthy</div>
                <div className="text-xl font-bold text-green-900 leading-tight">{healthCounts.healthy}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Section 3: Contracts Requiring Immediate Attention */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" /> Immediate Attention
              </CardTitle>
              <Link href="/alerts" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                View All
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Academy</th>
                      <th className="px-4 py-3 font-semibold">Health</th>
                      <th className="px-4 py-3 font-semibold">Expiry Date</th>
                      <th className="px-4 py-3 font-semibold">Days Left</th>
                      <th className="px-4 py-3 font-semibold">RM Name</th>
                      <th className="px-4 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {immediateAttention.length > 0 ? (
                      immediateAttention.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-900">
                            <Link href={`/contracts/${c.id}`} className="hover:text-blue-600 transition-colors">
                              {c.academyName}
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            <HealthBadge daysRemaining={c.daysRemaining} />
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {formatDate(c.contractExpiryDate)}
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-900">
                            {c.daysRemaining}
                          </td>
                          <td className="px-4 py-3 text-slate-600">{c.relationshipManager}</td>
                          <td className="px-4 py-3 text-right">
                            <Link href={`/contracts/${c.id}`}>
                              <Button variant="outline" size="sm" className="h-8">View</Button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                          No contracts require immediate attention.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Renewal Workflow Status */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-blue-600" /> Renewal Workflow Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between relative">
                {/* Connecting line background */}
                <div className="hidden md:block absolute top-6 left-10 right-10 h-0.5 bg-slate-100 -z-10"></div>
                
                {[
                  { label: "Created", count: stageCounts.created, active: true },
                  { label: "Active", count: stageCounts.active, active: true },
                  { label: "Reminder Sent", count: stageCounts.reminder, active: stageCounts.reminder > 0 },
                  { label: "Negotiation", count: stageCounts.negotiation, active: stageCounts.negotiation > 0 },
                  { label: "Renewed", count: stageCounts.renewed, active: true }
                ].map((stage, idx) => (
                  <div key={idx} className="flex flex-row md:flex-col items-center gap-4 md:gap-2 mb-4 md:mb-0 relative z-10">
                    <div className={`h-12 w-12 rounded-full border-4 flex items-center justify-center font-bold text-sm bg-white ${stage.active ? 'border-blue-500 text-blue-600 shadow-sm' : 'border-slate-200 text-slate-400'}`}>
                      {stage.count}
                    </div>
                    <div className="text-sm font-medium text-slate-700 whitespace-nowrap">{stage.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 5: Recent Activity Feed */}
        <div className="space-y-6">
          <Card className="shadow-sm h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-600" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-auto">
              <div className="space-y-5 relative before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                {mockActivity.slice(0, 8).map((activity) => (
                  <div key={activity.id} className="relative flex items-start gap-4">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full border-4 border-white bg-slate-50 text-slate-500 shadow-sm shrink-0 z-10">
                      {activity.type === 'contract_created' && <Plus className="h-4 w-4 text-blue-500" />}
                      {activity.type === 'contract_renewed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {activity.type === 'price_updated' && <TrendingUp className="h-4 w-4 text-indigo-500" />}
                      {activity.type === 'status_changed' && <ActivityIcon className="h-4 w-4 text-orange-500" />}
                      {activity.type === 'reminder_generated' && <Bell className="h-4 w-4 text-slate-500" />}
                    </div>
                    <div className="pt-1">
                      <p className="text-sm font-medium text-slate-900 leading-tight mb-1">{activity.description}</p>
                      <div className="flex items-center text-xs text-slate-500 gap-2">
                        <span className="font-semibold text-slate-600">{activity.actor}</span>
                        <span>•</span>
                        <span>
                          {new Date(activity.timestamp).toLocaleString('en-IN', { 
                            hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
