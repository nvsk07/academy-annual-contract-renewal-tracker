import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileBarChart, Download, Info, Loader2 } from "lucide-react";
import { getVisibleContracts, ContractWithHealth } from "@/services/contractService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/dateUtils";
import HealthBadge from "@/components/HealthBadge";

export default function Reports() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("summary");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rmFilter, setRmFilter] = useState("all");
  const [allContracts, setAllContracts] = useState<ContractWithHealth[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function loadContracts() {
      setIsLoading(true);
      try {
        const data = await getVisibleContracts(user);
        setAllContracts(data);
      } catch (err) {
        console.error("Failed to load reports:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadContracts();
  }, [user]);

  const availableRMs = Array.from(new Set(allContracts.map((c) => c.relationshipManagerName))).filter(Boolean);

  // Apply filters
  const contracts = allContracts.filter((c) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && (c.status === "Active" || c.status === "Renewed")) ||
      (statusFilter === "expiring" && c.status === "Expiring Soon");
    const matchesRM = rmFilter === "all" || c.relationshipManagerName === rmFilter;
    return matchesStatus && matchesRM;
  });

  const handleExport = () => {
    toast({ title: "Export", description: "CSV export will be available in the final release." });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-500 text-sm font-medium">Loading reports...</p>
        </div>
      </div>
    );
  }

  // ── Empty State ──
  if (allContracts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
          <Info className="h-8 w-8 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No reports available.</h2>
        <p className="text-slate-500 text-sm">Create contracts to generate reports.</p>
      </div>
    );
  }

  const expiringContracts = contracts.filter((c) => c.daysRemaining >= 0 && c.daysRemaining < 90);

  const renderSummary = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left whitespace-nowrap">
        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 font-semibold">Contract ID</th>
            <th className="px-4 py-3 font-semibold">Academy</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Health</th>
            <th className="px-4 py-3 font-semibold">End Date</th>
            {user?.role === "admin" && (
              <th className="px-4 py-3 font-semibold">Relationship Manager</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {contracts.length > 0 ? contracts.map(c => (
            <tr key={c.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-mono text-xs text-slate-600">{c.id}</td>
              <td className="px-4 py-3 font-semibold text-slate-900">{c.academyName}</td>
              <td className="px-4 py-3 text-slate-600">{c.academyType}</td>
              <td className="px-4 py-3 font-medium text-slate-700">{c.status}</td>
              <td className="px-4 py-3"><HealthBadge daysRemaining={c.daysRemaining} /></td>
              <td className="px-4 py-3 text-slate-600">{formatDate(c.contractEndDate)}</td>
              {user?.role === "admin" && (
                <td className="px-4 py-3 text-slate-600">{c.relationshipManagerName}</td>
              )}
            </tr>
          )) : (
            <tr>
              <td colSpan={user?.role === "admin" ? 7 : 6} className="px-4 py-8 text-center text-slate-400">
                No contracts match the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderExpiring = () => (
    <div className="overflow-x-auto">
      {expiringContracts.length === 0 ? (
        <div className="px-4 py-8 text-center text-slate-400">
          No contracts expiring within 90 days match the selected filters.
        </div>
      ) : (
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Academy</th>
              <th className="px-4 py-3 font-semibold">Health</th>
              <th className="px-4 py-3 font-semibold">Expiry Date</th>
              <th className="px-4 py-3 font-semibold">Days Left</th>
              {user?.role === "admin" && (
                <th className="px-4 py-3 font-semibold">Relationship Manager</th>
              )}
              <th className="px-4 py-3 font-semibold">Contact Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expiringContracts.map(c => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">{c.academyName}</td>
                <td className="px-4 py-3"><HealthBadge daysRemaining={c.daysRemaining} /></td>
                <td className="px-4 py-3 text-red-600 font-bold">{formatDate(c.contractEndDate)}</td>
                <td className="px-4 py-3 font-bold text-slate-900">{c.daysRemaining}</td>
                {user?.role === "admin" && (
                  <td className="px-4 py-3 text-slate-600">{c.relationshipManagerName}</td>
                )}
                <td className="px-4 py-3 text-blue-600">{c.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {user?.role === "admin" ? "All contracts" : "Your assigned contracts"} — generated from live Firestore data
        </p>
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-blue-100 bg-blue-50/30">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active &amp; Renewed</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {user?.role === "admin" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Relationship Manager</label>
                <Select value={rmFilter} onValueChange={setRmFilter}>
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Managers</SelectItem>
                    {availableRMs.map(rm => (
                      <SelectItem key={rm} value={rm}>{rm}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button variant="outline" className="bg-white font-semibold" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2 text-slate-500" /> Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data View */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 px-6">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileBarChart className="h-4 w-4 text-blue-600" />
            Showing {contracts.length} of {allContracts.length} contracts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-slate-100 px-6 bg-slate-50/50">
              <TabsList className="bg-transparent h-auto p-0 space-x-6 flex-wrap">
                {[
                  { value: "summary", label: "Contract Summary" },
                  { value: "expiring", label: "Expiring Contracts" },
                ].map(t => (
                  <TabsTrigger
                    key={t.value}
                    value={t.value}
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 py-4 text-sm text-slate-500 data-[state=active]:text-blue-700 font-bold tracking-tight"
                  >
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <TabsContent value="summary" className="m-0 outline-none">{renderSummary()}</TabsContent>
            <TabsContent value="expiring" className="m-0 outline-none">{renderExpiring()}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
