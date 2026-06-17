import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  getVisibleContracts,
  getHealthSummary,
  getContractsSortedByUrgency,
  ContractWithHealth,
} from "@/services/contractService";
import { getAllUsers } from "@/services/authService";
import type { AuthUser } from "@/services/authService";
import HealthBadge from "@/components/HealthBadge";
import {
  AlertCircle,
  Activity as ActivityIcon,
  Plus,
  CheckCircle,
  Clock,
  ArrowRight,
  FileText,
  ShieldCheck,
  Users,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import { HealthStatus } from "@/utils/contractUtils";

export default function Dashboard() {
  const { user } = useAuth();
  const [visibleContracts, setVisibleContracts] = useState<ContractWithHealth[]>([]);
  const [needsAttention, setNeedsAttention] = useState<ContractWithHealth[]>([]);
  const [healthCounts, setHealthCounts] = useState<Record<HealthStatus, number>>({
    critical: 0,
    "high-risk": 0,
    attention: 0,
    healthy: 0,
  });
  const [totalRMs, setTotalRMs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadDashboard() {
      setIsLoading(true);
      try {
        const [contracts, health, sorted, allUsers] = await Promise.all([
          getVisibleContracts(user),
          getHealthSummary(user),
          getContractsSortedByUrgency(user),
          user!.role === "admin" ? getAllUsers() : Promise.resolve([] as AuthUser[]),
        ]);

        setVisibleContracts(contracts);
        setHealthCounts(health);

        const attention = sorted
          .filter((c) => c.daysRemaining >= 0 && c.daysRemaining <= 90)
          .slice(0, 5);
        setNeedsAttention(attention);

        if (user!.role === "admin") {
          const rmCount = allUsers.filter(
            (u) => u.role === "relationship_manager" && u.status === "active"
          ).length;
          setTotalRMs(rmCount);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [user]);

  // ── KPI Counts — derived from actual contract data ──
  const totalContracts = visibleContracts.length;
  const activeContracts = visibleContracts.filter((c) => c.status === "Active").length;
  const expiringSoon = visibleContracts.filter((c) => c.status === "Expiring Soon").length;

  // RM specific metrics
  const rmExpiring30 = visibleContracts.filter(
    (c) => c.status === "Expiring Soon" && c.daysRemaining > 0 && c.daysRemaining <= 30
  ).length;
  const rmPendingRenewals = visibleContracts.filter(
    (c) =>
      c.workflowStage === "negotiation" || c.workflowStage === "reminder_sent"
  ).length;
  const rmAlertsCount = visibleContracts.filter(
    (c) => c.status !== "Archived" && c.daysRemaining >= 0 && c.daysRemaining < 90
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-500 text-sm font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ── Empty State ──
  if (totalContracts === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-5 max-w-md mx-auto px-4">
        <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
          <FileText className="h-10 w-10 text-slate-400" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">No Contracts Found</h2>
          <p className="text-slate-500 text-sm">
            Create your first academy contract to begin tracking renewals.
          </p>
        </div>
        <Link href="/contracts/new">
          <Button className="bg-blue-600 hover:bg-blue-700 font-semibold shadow-sm">
            <Plus className="h-4 w-4 mr-2" /> Create Contract
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5 font-medium">
            {user?.role === "admin"
              ? "Contract health overview — all active managers"
              : `Your assigned contracts portfolio — ${user?.name}`}
          </p>
        </div>
        <Link href="/contracts/new">
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto font-semibold">
            <Plus className="h-4 w-4 mr-2" /> Add Contract
          </Button>
        </Link>
      </div>

      {/* ── KPI Cards ── */}
      {user?.role === "admin" ? (
        /* Admin Dashboard KPIs */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Contracts</p>
                  <h3 className="text-3xl font-black mt-1 text-slate-900">{totalContracts}</h3>
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
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Contracts</p>
                  <h3 className="text-3xl font-black mt-1 text-slate-900">{activeContracts}</h3>
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
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expiring Soon</p>
                  <h3 className="text-3xl font-black mt-1 text-slate-900">{expiringSoon}</h3>
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
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Relationship Managers</p>
                  <h3 className="text-3xl font-black mt-1 text-slate-900">{totalRMs}</h3>
                </div>
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Relationship Manager Dashboard KPIs */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Active Contracts</p>
                  <h3 className="text-3xl font-black mt-1 text-slate-900">{activeContracts}</h3>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                  <ActivityIcon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-orange-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Expiring Contracts</p>
                  <h3 className="text-3xl font-black mt-1 text-slate-900">{rmExpiring30}</h3>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-purple-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Pending Renewals</p>
                  <h3 className="text-3xl font-black mt-1 text-slate-900">{rmPendingRenewals}</h3>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg text-purple-500">
                  <RefreshCw className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-red-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Alerts</p>
                  <h3 className="text-3xl font-black mt-1 text-slate-900">{rmAlertsCount}</h3>
                </div>
                <div className="p-2 bg-red-50 rounded-lg text-red-500">
                  <AlertCircle className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Contract Health Overview ── */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-600" /> Contract Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-3">
            {[
              { key: "critical", label: "Critical", sub: "< 7 days", dot: "bg-red-500", bg: "bg-red-50", border: "border-red-100", text: "text-red-900", sub_: "text-red-700" },
              { key: "high-risk", label: "High Risk", sub: "7–30 days", dot: "bg-orange-500", bg: "bg-orange-50", border: "border-orange-100", text: "text-orange-900", sub_: "text-orange-700" },
              { key: "attention", label: "Attention", sub: "30–90 days", dot: "bg-yellow-500", bg: "bg-yellow-50", border: "border-yellow-100", text: "text-yellow-900", sub_: "text-yellow-700" },
              { key: "healthy", label: "Healthy", sub: "90+ days", dot: "bg-green-500", bg: "bg-green-50", border: "border-green-100", text: "text-green-900", sub_: "text-green-700" },
            ].map(({ key, label, sub, dot, bg, border, text, sub_ }) => (
              <div key={key} className={`flex items-center gap-3 ${bg} border ${border} px-4 py-3 rounded-lg flex-1 min-w-[150px]`}>
                <div className={`h-3 w-3 rounded-full ${dot} shrink-0`} />
                <div>
                  <div className={`text-xs font-bold uppercase tracking-wide ${sub_}`}>{label}</div>
                  <div className={`text-xs ${sub_} opacity-70`}>{sub}</div>
                  <div className={`text-2xl font-black ${text} leading-tight mt-0.5`}>
                    {healthCounts[key as HealthStatus]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Contracts Requiring Attention ── */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" /> Contracts Requiring Attention
          </CardTitle>
          <Link href="/alerts" className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            View All Alerts <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {needsAttention.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <CheckCircle className="h-10 w-10 text-green-400" />
              <p className="text-slate-500 font-medium">All contracts are healthy — no immediate action required.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Academy</th>
                    <th className="px-4 py-3 font-semibold">Health</th>
                    <th className="px-4 py-3 font-semibold">Expiry Date</th>
                    <th className="px-4 py-3 font-semibold">Days Left</th>
                    {user?.role === "admin" && (
                      <th className="px-4 py-3 font-semibold">Relationship Manager</th>
                    )}
                    <th className="px-4 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {needsAttention.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">
                        <Link href={`/contracts/${c.id}`} className="hover:text-blue-600 transition-colors">
                          {c.academyName}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <HealthBadge daysRemaining={c.daysRemaining} />
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-medium">{formatDate(c.contractEndDate)}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{c.daysRemaining}</td>
                      {user?.role === "admin" && (
                        <td className="px-4 py-3 text-slate-600 font-medium">{c.relationshipManagerName}</td>
                      )}
                      <td className="px-4 py-3 text-right">
                        <Link href={`/contracts/${c.id}`}>
                          <Button variant="outline" size="sm" className="h-8">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
