import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockContracts } from "@/data/contracts";
import { Target, TrendingUp, Activity, Users, Database } from "lucide-react";
import { Button } from "react-day-picker";

export default function Analytics() {
  // Compute Status Distribution
  const statusCounts = mockContracts.reduce((acc, curr) => {
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
  const catFreq: Record<string, number> = {};
  mockContracts.forEach(c => {
    c.equipmentCategories.forEach(cat => {
      catFreq[cat] = (catFreq[cat] || 0) + 1;
    });
  });
  const equipmentData = Object.entries(catFreq)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Compute RM Performance Leaderboard
  const rmMap: Record<string, { contracts: number, value: number }> = {};
  mockContracts.forEach(c => {
    if (!rmMap[c.relationshipManager]) {
      rmMap[c.relationshipManager] = { contracts: 0, value: 0 };
    }
    rmMap[c.relationshipManager].contracts += 1;
    rmMap[c.relationshipManager].value += c.currentContractValue;
  });
  
  const rmPerformance = Object.entries(rmMap)
    .map(([name, data]) => ({
      name,
      contracts: data.contracts,
      valueFormatted: `₹${(data.value / 100000).toFixed(1)}L`,
      progress: Math.min(100, Math.round((data.value / 2000000) * 100)) // Fake target
    }))
    .sort((a, b) => b.contracts - a.contracts);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
        <p className="text-slate-500 text-sm">Portfolio performance and contract metrics derived from current data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Value</p>
              <h3 className="text-2xl font-black">₹{(mockContracts.reduce((a,c)=>a+c.currentContractValue,0)/100000).toFixed(1)}L</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Avg Contract</p>
              <h3 className="text-2xl font-black">₹{((mockContracts.reduce((a,c)=>a+c.currentContractValue,0)/mockContracts.length)/100000).toFixed(1)}L</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Renewal Rate</p>
              <h3 className="text-2xl font-black">
                {Math.round((statusCounts['Renewed'] || 0) / mockContracts.length * 100)}%
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Academies</p>
              <h3 className="text-2xl font-black">{mockContracts.length}</h3>
            </div>
          </CardContent>
        </Card>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-bold">RM Performance Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-white text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">RM Name</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-center">Contracts</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Portfolio Value</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Relative Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rmPerformance.map((rm) => (
                  <tr key={rm.name} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-900">{rm.name}</td>
                    <td className="px-6 py-4 text-center font-medium text-slate-600">{rm.contracts}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">{rm.valueFormatted}</td>
                    <td className="px-6 py-4 w-1/3">
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-blue-500" 
                            style={{width: `${rm.progress}%`}}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-dashed border-2">
          <CardContent className="p-8 h-full flex flex-col items-center justify-center text-center">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
              <Database className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Time-Series Data Unavailable</h3>
            <p className="text-sm text-slate-500 mb-6">Connect backend data to unlock Monthly Renewals Trend and Revenue Retention charts.</p>
            <Button variant="outline" className="bg-white shadow-sm font-semibold text-slate-700">Configure Integration</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}