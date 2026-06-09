import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Search, Plus, Download, FileBarChart, Eye, Pencil, Trash2, Printer 
} from "lucide-react";
import { mockContracts } from "@/data/contracts";
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

export default function Contracts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredContracts = mockContracts.filter(c => {
    const matchesSearch = c.academyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none shadow-none">Active</Badge>;
      case "Expiring Soon": return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-none shadow-none">Expiring</Badge>;
      case "Renewed": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none shadow-none">Renewed</Badge>;
      case "Archived": return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100 border-none shadow-none">Archived</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getDaysBadge = (days: number) => {
    if (days < 15) return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{days}d</Badge>;
    if (days < 30) return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">{days}d</Badge>;
    if (days < 60) return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{days}d</Badge>;
    return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{days}d</Badge>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contracts</h1>
          <p className="text-slate-500 text-sm">Manage and track all academy contracts</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="hidden sm:flex">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
          <Button variant="outline" className="hidden sm:flex">
            <FileBarChart className="h-4 w-4 mr-2" /> Report
          </Button>
          <Link href="/contracts/new" className="w-full sm:w-auto">
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Contract
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search by ID or Academy Name..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                      <SelectItem value="Renewed">Renewed</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[140px] hidden md:flex">
                      <SelectValue placeholder="Manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All RMs</SelectItem>
                      <SelectItem value="Priya Sharma">Priya Sharma</SelectItem>
                      <SelectItem value="Arjun Mehta">Arjun Mehta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Contract ID</th>
                    <th className="px-4 py-3 font-semibold">Academy Name</th>
                    <th className="px-4 py-3 font-semibold">RM Name</th>
                    <th className="px-4 py-3 font-semibold">Value</th>
                    <th className="px-4 py-3 font-semibold">Renewal Date</th>
                    <th className="px-4 py-3 font-semibold">Days</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredContracts.map((contract) => {
                    const daysRemaining = Math.floor((new Date(contract.contractExpiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) + 180; // Added 180 for demo purposes to simulate days
                    
                    return (
                      <tr key={contract.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900">
                          <Link href={`/contracts/${contract.id}`} className="hover:text-primary">
                            {contract.id}
                          </Link>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">{contract.academyName}</td>
                        <td className="px-4 py-3 text-slate-600">{contract.relationshipManager}</td>
                        <td className="px-4 py-3 text-slate-900">₹{(contract.currentContractValue/100000).toFixed(1)}L</td>
                        <td className="px-4 py-3 text-slate-600">{new Date(contract.contractExpiryDate).toLocaleDateString('en-IN')}</td>
                        <td className="px-4 py-3">{getDaysBadge(daysRemaining)}</td>
                        <td className="px-4 py-3">{getStatusBadge(contract.status)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/contracts/${contract.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-primary">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the contract
                                    for {contract.academyName} and remove the data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {filteredContracts.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  No contracts found matching your filters.
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
              <span className="text-sm text-slate-500">Showing {filteredContracts.length} contracts</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="w-full lg:w-72 shrink-0">
          <Card className="sticky top-20">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-lg">
              <h3 className="font-bold text-slate-900 text-sm">Action Required</h3>
            </div>
            <div className="p-0">
              <div className="divide-y divide-slate-100">
                {mockContracts.filter(c => c.status === "Expiring Soon").map(contract => (
                  <div key={`alert-${contract.id}`} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm text-slate-900 line-clamp-1">{contract.academyName}</span>
                      <Badge className="bg-orange-100 text-orange-800 border-none shadow-none text-[10px] px-1.5 py-0">Urgent</Badge>
                    </div>
                    <div className="text-xs text-slate-500 mb-2">Exp: {new Date(contract.contractExpiryDate).toLocaleDateString('en-IN')}</div>
                    <Link href={`/contracts/${contract.id}`}>
                      <Button variant="outline" size="sm" className="w-full text-xs h-7">Review Contract</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}