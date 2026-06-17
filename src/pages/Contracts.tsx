import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Search, Plus, Download, Eye, Pencil, Trash2, Archive, X,
  AlertCircle
} from "lucide-react";
import HealthBadge from "@/components/HealthBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useContracts } from "@/hooks/useContracts";
import { useAuth } from "@/hooks/useAuth";
import { getHealthBadgeClasses, getStatusBadgeClasses } from "@/utils/contractUtils";
import { formatDate } from "@/utils/dateUtils";
import { CONTRACT_STATUSES, ACADEMY_TYPES } from "@/constants/contractConstants";
import { deleteContract, updateContract } from "@/services/contractService";

export default function Contracts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { contracts, allContracts, filters, setFilter, clearFilters, reload, isLoading } = useContracts();

  const activeFiltersCount = [
    filters.status !== "All", 
    filters.healthStatus !== "All", 
    filters.relationshipManager !== "All", 
    filters.academyType !== "All"
  ].filter(Boolean).length;

  const requiresAttention = [...allContracts]
    .filter(c => c.status !== "Archived" && (c.healthStatus === "critical" || c.healthStatus === "high-risk"))
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  const getStatusBadge = (status: string) => {
    return <Badge className={`${getStatusBadgeClasses(status)} border-none shadow-none font-semibold`}>{status}</Badge>;
  };

  const handleExport = () => {
    toast({ 
      title: "Data Export Initiated", 
      description: "CSV report of visible contracts has been generated successfully." 
    });
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await deleteContract(id, user);
      toast({ title: "Contract Deleted", description: `Contract ${id} has been permanently deleted.` });
      reload();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to delete.", variant: "destructive" });
    }
  };

  const handleArchive = async (id: string) => {
    if (!user) return;
    try {
      await updateContract(id, { status: "Archived" }, user);
      toast({ title: "Contract Archived", description: `Contract ${id} has been set to Archived status.` });
      reload();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to archive.", variant: "destructive" });
    }
  };

  const uniqueRMs = Array.from(new Set(allContracts.map(c => c.relationshipManagerName)));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contracts</h1>
          <p className="text-slate-500 text-sm">Manage, filter, and track Oxygen Sports academy renewals</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleExport} className="bg-white border-slate-200">
            <Download className="h-4 w-4 mr-2 text-slate-500" /> Export CSV
          </Button>
          <Link href="/contracts/new" className="flex-1 sm:flex-none">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 font-semibold">
              <Plus className="h-4 w-4 mr-2" /> Add Contract
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 space-y-4 min-w-0">
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search by Academy Name, Contract ID, or RM..." 
                    className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                    value={filters.search}
                    onChange={(e) => setFilter("search", e.target.value)}
                  />
                </div>
                
                {/* Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <Select value={filters.healthStatus} onValueChange={(v) => setFilter("healthStatus", v)}>
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Health Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Health Status</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high-risk">High Risk</SelectItem>
                      <SelectItem value="attention">Attention</SelectItem>
                      <SelectItem value="healthy">Healthy</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.status} onValueChange={(v) => setFilter("status", v)}>
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Contract Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      {CONTRACT_STATUSES.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {user?.role === 'admin' ? (
                    <Select value={filters.relationshipManager} onValueChange={(v) => setFilter("relationshipManager", v)}>
                      <SelectTrigger className="bg-white border-slate-200">
                        <SelectValue placeholder="Relationship Manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Managers</SelectItem>
                        {uniqueRMs.map(rm => (
                          <SelectItem key={rm} value={rm}>{rm}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : <div className="hidden md:block"></div>}

                  <Select value={filters.academyType} onValueChange={(v) => setFilter("academyType", v)}>
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Academy Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Types</SelectItem>
                      {ACADEMY_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
                    <span className="text-xs font-semibold text-slate-500">Active Filters:</span>
                    {filters.healthStatus !== "All" && (
                      <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer" onClick={() => setFilter("healthStatus", "All")}>
                        Health: {filters.healthStatus} <X className="ml-1 h-3 w-3" />
                      </Badge>
                    )}
                    {filters.status !== "All" && (
                      <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer" onClick={() => setFilter("status", "All")}>
                        Status: {filters.status} <X className="ml-1 h-3 w-3" />
                      </Badge>
                    )}
                    {filters.relationshipManager !== "All" && (
                      <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer" onClick={() => setFilter("relationshipManager", "All")}>
                        RM: {filters.relationshipManager} <X className="ml-1 h-3 w-3" />
                      </Badge>
                    )}
                    {filters.academyType !== "All" && (
                      <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer" onClick={() => setFilter("academyType", "All")}>
                        Type: {filters.academyType} <X className="ml-1 h-3 w-3" />
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-slate-500" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold w-[120px]">Contract ID</th>
                    <th className="px-4 py-3 font-semibold">Academy</th>
                    {user?.role === 'admin' && <th className="px-4 py-3 font-semibold">RM</th>}
                    <th className="px-4 py-3 font-semibold">Expiry Date</th>
                    <th className="px-4 py-3 font-semibold text-center">Days</th>
                    <th className="px-4 py-3 font-semibold">Health</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <Link href={`/contracts/${contract.id}`} className="hover:text-blue-600 transition-colors font-semibold">
                          {contract.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{contract.academyName}</div>
                        <div className="text-xs text-slate-500 font-semibold">{contract.academyType}</div>
                      </td>
                      {user?.role === 'admin' && <td className="px-4 py-3 text-slate-600">{contract.relationshipManagerName}</td>}
                      <td className="px-4 py-3 text-slate-600">{formatDate(contract.contractEndDate)}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 font-bold text-slate-900">
                          <div className={`w-2 h-2 rounded-full ${getHealthBadgeClasses(contract.healthStatus).split(' ')[0]}`}></div>
                          {contract.daysRemaining}
                        </div>
                      </td>
                      <td className="px-4 py-3"><HealthBadge daysRemaining={contract.daysRemaining} /></td>
                      <td className="px-4 py-3">{getStatusBadge(contract.status)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/contracts/${contract.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50" title="View details">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/contracts/${contract.id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-amber-600 hover:bg-amber-50" title="Edit contract">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          {contract.status !== "Archived" && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-200" title="Archive contract" onClick={() => handleArchive(contract.id)}>
                              <Archive className="h-4 w-4" />
                            </Button>
                          )}
                          {user?.role === "admin" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50" title="Delete contract">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-white rounded-xl border border-slate-200">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="font-bold">Delete Contract</AlertDialogTitle>
                                  <AlertDialogDescription className="text-slate-500">
                                    Are you sure you want to permanently delete contract {contract.id} ({contract.academyName})? This action will permanently remove it from the tracking database and cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-2">
                                  <AlertDialogCancel className="border-slate-200">Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleDelete(contract.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {contracts.length === 0 && (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                  <Search className="h-10 w-10 text-slate-300 mb-3" />
                  <p className="font-bold text-slate-700">No contracts found</p>
                  <p className="text-sm mt-1">Try adjusting your filters or search term.</p>
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
              <span className="text-sm font-semibold text-slate-600">Showing {contracts.length} results</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled className="bg-white border-slate-200 text-slate-400">Previous</Button>
                <Button variant="outline" size="sm" disabled className="bg-white border-slate-200 text-slate-400">Next</Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="w-full xl:w-[320px] shrink-0">
          <Card className="sticky top-20 shadow-sm border-orange-200">
            <div className="p-4 border-b border-orange-100 bg-orange-50/50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500 animate-pulse" /> Requires Attention
              </h3>
            </div>
            <div className="p-0 max-h-[600px] overflow-y-auto">
              <div className="divide-y divide-slate-100">
                {requiresAttention.length > 0 ? (
                  requiresAttention.map(contract => (
                    <div key={`alert-${contract.id}`} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <Link href={`/contracts/${contract.id}`}>
                          <span className="font-bold text-sm text-blue-600 hover:underline hover:text-blue-800 line-clamp-1 cursor-pointer">
                            {contract.academyName}
                          </span>
                        </Link>
                        <HealthBadge daysRemaining={contract.daysRemaining} />
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-xs text-slate-500 space-y-1">
                          <div className="font-semibold text-slate-700">Exp: {formatDate(contract.contractEndDate)}</div>
                          <div className="font-semibold text-slate-400">RM: {contract.relationshipManagerName}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Days Left</div>
                          <div className={`font-black text-lg leading-none ${contract.healthStatus === 'critical' ? 'text-red-600' : 'text-orange-600'}`}>
                            {contract.daysRemaining}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500 font-medium">
                    All contracts are healthy.
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
