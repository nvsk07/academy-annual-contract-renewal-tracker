import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAllContracts } from "@/services/contractService";
import { getRMPerformance } from "@/services/reportService";
import HealthBadge from "@/components/HealthBadge";
import { Link } from "wouter";
import { formatDate } from "@/utils/dateUtils";

export default function RelationshipManagers() {
  const contracts = getAllContracts();
  
  const rmStats = getRMPerformance(contracts).map(rm => {
    const rmContracts = contracts.filter(c => c.relationshipManager === rm.name);
    const critical = rmContracts.filter(c => c.healthStatus === "critical").length;
    const department = rmContracts[0]?.department || "Sales";

    return {
      ...rm,
      department,
      initials: rm.name.split(' ').map(n => n[0]).join(''),
      critical
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Relationship Managers</h1>
        <p className="text-slate-500 text-sm">Monitor RM performance and portfolio distribution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {rmStats.map(rm => (
          <Card key={rm.name} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <Avatar className="h-12 w-12 border-2 border-blue-100">
                  <AvatarFallback className="bg-blue-50 text-blue-700 font-bold">{rm.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-slate-900">{rm.name}</h3>
                  <p className="text-xs font-medium text-slate-500">{rm.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Total Contracts</div>
                  <div className="text-2xl font-black text-slate-900">{rm.total}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Expiring Soon</div>
                  <div className="text-2xl font-black text-orange-600">{rm.expiring}</div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-600">Renewal Rate</span>
                  <span className="font-bold text-slate-900">{rm.renewalRate.toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${rm.renewalRate}%` }}
                  ></div>
                </div>
              </div>

              <Link href={`/contracts?rm=${encodeURIComponent(rm.name)}`}>
                <Button className="w-full bg-white text-slate-700 border border-slate-200 hover:bg-slate-50">View Portfolio</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-lg">
          <h3 className="font-bold text-slate-900">All RM Contracts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">RM Name</th>
                <th className="px-4 py-3 font-semibold">Academy</th>
                <th className="px-4 py-3 font-semibold">Contract Value</th>
                <th className="px-4 py-3 font-semibold">Expiry Date</th>
                <th className="px-4 py-3 font-semibold">Health</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contracts.map(contract => {
                return (
                  <tr key={contract.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">{contract.relationshipManager}</td>
                    <td className="px-4 py-3">
                      <Link href={`/contracts/${contract.id}`} className="text-blue-600 hover:underline font-medium">
                        {contract.academyName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">₹{(contract.currentContractValue/100000).toFixed(1)}L</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(contract.contractExpiryDate)}</td>
                    <td className="px-4 py-3"><HealthBadge daysRemaining={contract.daysRemaining} /></td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{contract.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
