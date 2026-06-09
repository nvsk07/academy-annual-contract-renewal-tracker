import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Search, Plus, Download, FileBarChart, Eye, Pencil, Trash2, Archive, X,
  AlertCircle
} from "lucide-react";
import { mockContracts, getDaysRemaining, getHealthStatus, getHealthColor } from "@/data/contracts";
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

export default function Contracts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [healthFilter, setHealthFilter] = useState("All");
  const [rmFilter, setRmFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const { toast } = useToast();

  const contractsWithComputed = useMemo(() => {
    return mockContracts.map(c => {
      const days = getDaysRemaining(c.contractExpiryDate);
      return {
        ...c,
        daysRemaining: days,
        health: getHealthStatus(days)
      };
    });
  }, []);

  const filteredContracts = contractsWithComputed.filter(c => {
    const matchesSearch = c.academyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.relationshipManager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesHealth = healthFilter === "All" || c.health === healthFilter;
    const matchesRM = rmFilter === "All" || c.relationshipManager === rmFilter;
    const matchesType = typeFilter === "All" || c.academyType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesHealth && matchesRM && matchesType;
  });

  const activeFiltersCount = [
    statusFilter !== "All", 
    healthFilter !== "All", 
    rmFilter !== "All", 
    typeFilter !== "All"
  ].filter(Boolean).length;

  const clearFilters = () => {
    setStatusFilter("All");
    setHealthFilter("All");
    setRmFilter("All");
    setTypeFilter("All");
    setSearchTerm("");
  };

  const requiresAttention = [...contractsWithComputed]
    .filter(c => c.health === "critical" || c.health === "high-risk")
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active": return <Badge className="bg-green-100 text-green-800 border-none shadow-none font-medium">Active</Badge>;
      case "Expiring Soon": return <Badge className="bg-orange-100 text-orange-800 border-none shadow-none font-medium">Expiring Soon</Badge>;
      case "Renewed": return <Badge className="bg-blue-100 text-blue-800 border-none shadow-none font-medium">Renewed</Badge>;
      case "Archived": return <Badge className="bg-slate-100 text-slate-800 border-none shadow-none font-medium">Archived</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleExport = () => {
    toast({ title: "Exporting", description: "Export feature will be available with backend integration." });
  };

  const handleDelete = (id: string) => {
    toast({ title: "Deleted", description: `Contract ${id} deleted.` });
  };

  const handleArchive = (id: string) => {
    toast({ title: "Archived", description: `Contract ${id} archived.` });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contracts</h1>
          <p className="text-slate-500 text-sm">Manage and track all academy contracts</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleExport} className="bg-white">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Link href="/contracts/new" className="flex-1 sm:flex-none">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
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
                    className="pl-9 bg-slate-50 border-slate-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <Select value={healthFilter} onValueChange={setHealthFilter}>
                    <SelectTrigger className="bg-white">
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

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Contract Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                      <SelectItem value="Renewed">Renewed</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={rmFilter} onValueChange={setRmFilter}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Relationship Manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Managers</SelectItem>
                      {Array.from(new Set(mockContracts.map(c => c.relationshipManager))).map(rm => (
                        <SelectItem key={rm} value={rm}>{rm}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Academy Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Types</SelectItem>
                      {Array.from(new Set(mockContracts.map(c => c.academyType))).map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
                    <span className="text-xs font-medium text-slate-500">Active Filters:</span>
                    {healthFilter !== "All" && (
                      <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer" onClick={() => setHealthFilter("All")}>
                        Health: {healthFilter} <X className="ml-1 h-3 w-3" />
                      </Badge>
                    )}
                    {statusFilter !== "All" && (
                      <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer" onClick={() => setStatusFilter("All")}>
                        Status: {statusFilter} <X className="ml-1 h-3 w-3" />
                      </Badge>
                    )}
                    {rmFilter !== "All" && (
                      <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer" onClick={() => setRmFilter("All")}>
                        RM: {rmFilter} <X className="ml-1 h-3 w-3" />
                      </Badge>
                    )}
                    {typeFilter !== "All" && (
                      <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer" onClick={() => setTypeFilter("All")}>
                        Type: {typeFilter} <X className="ml-1 h-3 w-3" />
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
                    <th className="px-4 py-3 font-semibold">RM</th>
                    <th className="px-4 py-3 font-semibold">Value</th>
                    <th className="px-4 py-3 font-semibold">Expiry Date</th>
                    <th className="px-4 py-3 font-semibold text-center">Days</th>
                    <th className="px-4 py-3 font-semibold">Health</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <Link href={`/contracts/${contract.id}`} className="hover:text-blue-600 transition-colors">
                          {contract.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{contract.academyName}</div>
                        <div className="text-xs text-slate-500">{contract.academyType}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{contract.relationshipManager}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">₹{(contract.currentContractValue/100000).toFixed(1)}L</td>
                      <td className="px-4 py-3 text-slate-600">{new Date(contract.contractExpiryDate).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 font-bold text-slate-900">
                          <div className={`w-2 h-2 rounded-full ${getHealthColor(contract.health).split(' ')[0]}`}></div>
                          {contract.daysRemaining}
                        </div>
                      </td>
                      <td className="px-4 py-3"><HealthBadge daysRemaining={contract.daysRemaining} /></td>
                      <td className="px-4 py-3">{getStatusBadge(contract.status)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/contracts/${contract.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50" title="View">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-amber-600 hover:bg-amber-50" title="Edit">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-200" title="Archive" onClick={() => handleArchive(contract.id)}>
                            <Archive className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50" title="Delete">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Contract</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to permanently delete contract {contract.id} ({contract.academyName})? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(contract.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredContracts.length === 0 && (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                  <Search className="h-10 w-10 text-slate-300 mb-3" />
                  <p className="font-medium text-slate-700">No contracts found</p>
                  <p className="text-sm mt-1">Try adjusting your filters or search term.</p>
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
              <span className="text-sm font-medium text-slate-600">Showing {filteredContracts.length} results</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled className="bg-white">Previous</Button>
                <Button variant="outline" size="sm" disabled className="bg-white">Next</Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="w-full xl:w-[320px] shrink-0">
          <Card className="sticky top-20 shadow-sm border-orange-200">
            <div className="p-4 border-b border-orange-100 bg-orange-50/50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" /> Requires Attention
              </h3>
            </div>
            <div className="p-0 max-h-[600px] overflow-y-auto">
              <div className="divide-y divide-slate-100">
                {requiresAttention.length > 0 ? (
                  requiresAttention.map(contract => (
                    <div key={`alert-${contract.id}`} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <Link href={`/contracts/${contract.id}`}>
                          <span className="font-bold text-sm text-blue-600 hover:underline line-clamp-1 cursor-pointer">
                            {contract.academyName}
                          </span>
                        </Link>
                        <HealthBadge daysRemaining={contract.daysRemaining} />
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-xs text-slate-500 space-y-1">
                          <div className="font-medium">Exp: {new Date(contract.contractExpiryDate).toLocaleDateString('en-IN')}</div>
                          <div>RM: {contract.relationshipManager}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Days Left</div>
                          <div className={`font-black text-lg leading-none ${contract.health === 'critical' ? 'text-red-600' : 'text-orange-600'}`}>
                            {contract.daysRemaining}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500">
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