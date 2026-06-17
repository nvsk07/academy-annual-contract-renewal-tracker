import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVisibleContracts, ContractWithHealth } from "@/services/contractService";
import { useAuth } from "@/hooks/useAuth";
import { BarChart2, Info, Loader2 } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  "Active":        "hsl(221, 83%, 53%)",
  "Expiring Soon": "hsl(25, 95%, 53%)",
  "Renewed":       "hsl(142, 71%, 45%)",
  "Archived":      "hsl(215, 16%, 47%)",
};

const ACADEMY_COLORS = [
  "hsl(221, 83%, 53%)",
  "hsl(25, 95%, 53%)",
  "hsl(142, 71%, 45%)",
  "hsl(271, 91%, 65%)",
  "hsl(330, 81%, 60%)",
];

function getEquipmentCategoryBreakdown(contracts: ContractWithHealth[]): Record<string, number> {
  const breakdown: Record<string, number> = {};
  contracts.forEach(c => {
    (c.equipmentCategories || []).forEach(cat => {
      breakdown[cat] = (breakdown[cat] || 0) + 1;
    });
  });
  return breakdown;
}

function getAcademyTypeDistribution(contracts: ContractWithHealth[]): Record<string, number> {
  const dist: Record<string, number> = {};
  contracts.forEach(c => {
    dist[c.academyType] = (dist[c.academyType] || 0) + 1;
  });
  return dist;
}

export default function Analytics() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<ContractWithHealth[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await getVisibleContracts(user);
        setContracts(data);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-500 text-sm font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
          <Info className="h-8 w-8 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No data available for visualization.</h2>
        <p className="text-slate-500 text-sm">Create contracts to see analytics.</p>
      </div>
    );
  }

  // ── Status Distribution ──
  const statusCounts = contracts.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusCounts)
    .map(([name, value]) => ({ name, value, color: STATUS_COLORS[name] || "#94a3b8" }))
    .filter(d => d.value > 0);

  // ── Equipment Category Frequency ──
  const breakdown = getEquipmentCategoryBreakdown(contracts);
  const equipmentData = Object.entries(breakdown)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // ── Academy Type Distribution ──
  const typeBreakdown = getAcademyTypeDistribution(contracts);
  const academyTypeData = Object.entries(typeBreakdown)
    .map(([name, value], i) => ({ name: name.replace(" Academy", ""), value, color: ACADEMY_COLORS[i % ACADEMY_COLORS.length] }))
    .filter(d => d.value > 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Portfolio distribution derived from {contracts.length} contract{contracts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statusData.map(s => (
          <Card key={s.name} className="shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.name}</div>
              <div className="text-3xl font-black mt-1 text-slate-900">{s.value}</div>
              <div className="mt-2 h-1 rounded-full" style={{ backgroundColor: s.color, width: `${(s.value / contracts.length) * 100}%`, minWidth: 4 }} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contract Status Pie */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-blue-600" /> Contract Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={90}
                    paddingAngle={4} dataKey="value"
                  >
                    {statusData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number, name: string) => [`${value} contract${value !== 1 ? "s" : ""}`, name]} />
                  <Legend verticalAlign="bottom" height={40} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Academy Type Distribution */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-blue-600" /> Academy Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={academyTypeData}
                    cx="50%" cy="50%"
                    outerRadius={90} paddingAngle={3}
                    dataKey="value"
                  >
                    {academyTypeData.map((entry, i) => (
                      <Cell key={`actype-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number, name: string) => [`${value} contract${value !== 1 ? "s" : ""}`, name]} />
                  <Legend verticalAlign="bottom" height={40} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {equipmentData.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-blue-600" /> Equipment Category Frequency
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={equipmentData} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} width={140} />
                  <RechartsTooltip cursor={{ fill: "#f8fafc" }} formatter={(value: number) => [`${value} contract${value !== 1 ? "s" : ""}`, "Frequency"]} />
                  <Bar dataKey="count" fill="hsl(221, 83%, 53%)" radius={[0, 4, 4, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
