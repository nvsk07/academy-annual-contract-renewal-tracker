import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVisibleContracts } from "@/services/contractService";
import { getEquipmentCategoryBreakdown } from "@/services/reportService";
import { useAuth } from "@/hooks/useAuth";
import HealthBadge from "@/components/HealthBadge";
import { Info } from "lucide-react";

export default function Analytics() {
  const { user } = useAuth();
  const contracts = getVisibleContracts(user);
  
  if (contracts.length === 0) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto h-[60vh] flex flex-col items-center justify-center">
        <Info className="h-16 w-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">No data available for visualization.</h2>
        <p className="text-slate-500 text-sm">Create contracts to see analytics.</p>
      </div>
    );
  }

  // Compute Status Distribution
  const statusCounts = contracts.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = [
    { name: 'Active', value: statusCounts['Active'] || 0, color: 'hsl(221, 83%, 53%)' },
    { name: 'Expiring Soon', value: statusCounts['Expiring Soon'] || 0, color: 'hsl(25, 95%, 53%)' },
    { name: 'Renewed', value: statusCounts['Renewed'] || 0, color: 'hsl(142, 71%, 45%)' },
    { name: 'Archived', value: statusCounts['Archived'] || 0, color: 'hsl(215, 16%, 47%)' },
  ].filter(d => d.value > 0);

  // Compute Equipment Categories Frequency
  const breakdown = getEquipmentCategoryBreakdown(contracts);
  const equipmentData = Object.entries(breakdown)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
        <p className="text-slate-500 text-sm">Portfolio distribution across all visible contracts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-bold">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-bold">Equipment Category Popularity</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={equipmentData} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={120} />
                  <RechartsTooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="count" fill="hsl(221, 83%, 53%)" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-base font-bold">Contract Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Academy</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Health</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-center">Days Remaining</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">RM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {contracts.slice(0, 10).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-900">{c.academyName}</td>
                    <td className="px-6 py-4 font-medium text-slate-600">{c.status}</td>
                    <td className="px-6 py-4"><HealthBadge daysRemaining={c.daysRemaining} /></td>
                    <td className="px-6 py-4 text-center font-bold text-slate-900">{c.daysRemaining}</td>
                    <td className="px-6 py-4 text-slate-600">{c.relationshipManager}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
