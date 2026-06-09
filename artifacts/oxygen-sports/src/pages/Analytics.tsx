import { Link } from "wouter";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockContracts } from "@/data/contracts";
import { TrendingUp, Users, Target, Activity } from "lucide-react";

export default function Analytics() {
  const activeCount = mockContracts.filter(c => c.status === "Active").length;
  const expiringCount = mockContracts.filter(c => c.status === "Expiring Soon").length;
  const renewedCount = mockContracts.filter(c => c.status === "Renewed").length;

  const statusData = [
    { name: 'Active', value: activeCount, color: 'hsl(221, 83%, 53%)' },
    { name: 'Expiring', value: expiringCount, color: 'hsl(25, 95%, 53%)' },
    { name: 'Renewed', value: renewedCount, color: 'hsl(142, 71%, 45%)' },
  ];

  const monthlyTrendData = [
    { month: 'Jan', renewals: 4 },
    { month: 'Feb', renewals: 3 },
    { month: 'Mar', renewals: 5 },
    { month: 'Apr', renewals: 2 },
    { month: 'May', renewals: 6 },
    { month: 'Jun', renewals: 8 },
  ];

  const revenueData = [
    { name: 'Q1', retained: 45, target: 50 },
    { name: 'Q2', retained: 52, target: 48 },
    { name: 'Q3', retained: 61, target: 55 },
    { name: 'Q4', retained: 48, target: 60 },
  ];

  const rmPerformance = [
    { name: 'Priya Sharma', contracts: 8, value: '₹1.2Cr', progress: 85 },
    { name: 'Arjun Mehta', contracts: 6, value: '₹95L', progress: 72 },
    { name: 'Vikram Singh', contracts: 5, value: '₹82L', progress: 65 },
    { name: 'Sneha Patel', contracts: 4, value: '₹65L', progress: 90 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
        <p className="text-slate-500 text-sm">Portfolio performance and contract metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Conversion Rate</p>
              <h3 className="text-2xl font-bold">84.2%</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Avg Value Increase</p>
              <h3 className="text-2xl font-bold">+12.5%</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Avg Renewal Time</p>
              <h3 className="text-2xl font-bold">14 Days</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active RMs</p>
              <h3 className="text-2xl font-bold">4</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-lg">Monthly Renewals Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="renewals" stroke="hsl(221, 83%, 53%)" strokeWidth={3} dot={{r: 4, fill: 'hsl(221, 83%, 53%)', strokeWidth: 2, stroke: '#fff'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-lg">Revenue Retention (Lakhs)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <RechartsTooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="retained" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" fill="hsl(214, 32%, 91%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-lg">RM Performance Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">RM Name</th>
                  <th className="px-6 py-3 font-semibold text-center">Contracts</th>
                  <th className="px-6 py-3 font-semibold text-right">Portfolio Value</th>
                  <th className="px-6 py-3 font-semibold">Target Achievement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rmPerformance.map((rm) => (
                  <tr key={rm.name} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{rm.name}</td>
                    <td className="px-6 py-4 text-center text-slate-600">{rm.contracts}</td>
                    <td className="px-6 py-4 text-right font-medium">{rm.value}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${rm.progress >= 80 ? 'bg-green-500' : 'bg-primary'}`} 
                            style={{width: `${rm.progress}%`}}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-slate-600 min-w-[3ch]">{rm.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-lg">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[200px] w-full mb-4">
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
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {statusData.map(stat => (
                <div key={stat.name} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: stat.color}}></div>
                    <span className="text-slate-600">{stat.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{stat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}