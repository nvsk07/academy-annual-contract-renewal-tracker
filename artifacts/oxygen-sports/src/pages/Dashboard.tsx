import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getVisibleContracts, getVisibleHealthSummary, getVisibleContractsSortedByUrgency } from "@/services/contractService";
import HealthBadge from "@/components/HealthBadge";
import { 
  AlertCircle, Activity as ActivityIcon, Plus, CheckCircle, Clock, 
  ArrowRight, FileText
} from "lucide-react";
import { formatDate } from "@/utils/dateUtils";

export default function Dashboard() {
  const { user } = useAuth();
  const visibleContracts = getVisibleContracts(user);
  
  const totalContracts = visibleContracts.length;
  const activeContracts = visibleContracts.filter(c => c.status === "Active").length;
  const expiringSoon = visibleContracts.filter(c => c.status === "Expiring Soon" || c.daysRemaining < 30).length;
  const renewedContracts = visibleContracts.filter(c => c.status === "Renewed").length;

  const healthCounts = getVisibleHealthSummary(user);
  const showHealthSection = totalContracts > 0 && 
    (healthCounts.critical > 0 || healthCounts["high-risk"] > 0 || healthCounts.attention > 0 || healthCounts.healthy > 0);

  const immediateAttention = getVisibleContractsSortedByUrgency(user)
    .filter(c => c.daysRemaining < 90)
    .slice(0, 5);

  if (totalContracts === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <FileText className="h-16 w-16 text-slate-300" />
        <h2 className="text-2xl font-bold text-slate-900">
          {user?.role === 'admin' ? "No contracts found. Create your first contract." : "No contracts assigned to you yet."}
        </h2>
        <p className="text-slate-500">
          {user?.role === 'admin' ? "" : "Contact your administrator."}
        </p>
        {user?.role === 'admin' && (
          <Link href="/contracts/new">
            <Button className="bg-blue-600 hover:bg-blue-700 mt-4">
              <Plus className="h-4 w-4 mr-2" /> Create Contract
            </Button>
          </Link>
        )}
      </div>
    );
  }

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Contracts</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-900">{totalContracts}</h3>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Contracts</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-900">{activeContracts}</h3>
              </div>
              <div className="p-2 bg-green-50 rounded-lg text-green-500">
                <ActivityIcon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiring Soon</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-900">{expiringSoon}</h3>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-indigo-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Renewed</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-900">{renewedContracts}</h3>
              </div>
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showHealthSection && (
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
      )}

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" /> Contracts Requiring Attention
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
    </div>
  );
}
