import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileBarChart, Download, Printer, Filter } from "lucide-react";
import { mockContracts } from "@/data/contracts";
import { useToast } from "@/hooks/use-toast";

export default function Reports() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("summary");

  const handleExport = () => {
    toast({ title: "Exporting", description: "Export feature will be available with backend integration." });
  };

  const renderContractSummary = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left whitespace-nowrap">
        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 font-semibold">ID</th>
            <th className="px-4 py-3 font-semibold">Academy</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Value</th>
            <th className="px-4 py-3 font-semibold">RM</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {mockContracts.map(c => (
            <tr key={c.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-900">{c.id}</td>
              <td className="px-4 py-3 font-semibold text-slate-900">{c.academyName}</td>
              <td className="px-4 py-3 text-slate-600">{c.academyType}</td>
              <td className="px-4 py-3 font-medium text-slate-700">{c.status}</td>
              <td className="px-4 py-3 text-slate-900 font-medium">₹{(c.currentContractValue/100000).toFixed(1)}L</td>
              <td className="px-4 py-3 text-slate-600">{c.relationshipManager}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderExpiring = () => {
    const expiring = [...mockContracts]
      .filter(c => c.status === "Expiring Soon")
      .sort((a, b) => new Date(a.contractExpiryDate).getTime() - new Date(b.contractExpiryDate).getTime());
      
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Academy</th>
              <th className="px-4 py-3 font-semibold">Expiry Date</th>
              <th className="px-4 py-3 font-semibold">Current Value</th>
              <th className="px-4 py-3 font-semibold">RM</th>
              <th className="px-4 py-3 font-semibold">Contact Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expiring.map(c => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">{c.academyName}</td>
                <td className="px-4 py-3 text-red-600 font-bold">{new Date(c.contractExpiryDate).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3 text-slate-900 font-medium">₹{(c.currentContractValue/100000).toFixed(1)}L</td>
                <td className="px-4 py-3 text-slate-600">{c.relationshipManager}</td>
                <td className="px-4 py-3 text-blue-600">{c.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports Module</h1>
        <p className="text-slate-500 text-sm">Generate and export real-time data reports</p>
      </div>

      <Card className="shadow-sm border-blue-100 bg-blue-50/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Report Configuration</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date Range</label>
              <Select defaultValue="this_year">
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="this_quarter">This Quarter</SelectItem>
                  <SelectItem value="this_year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
              <Select defaultValue="all">
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active & Renewed</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Manager</label>
              <Select defaultValue="all">
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="All Managers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Managers</SelectItem>
                  <SelectItem value="priya">Priya Sharma</SelectItem>
                  <SelectItem value="arjun">Arjun Mehta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 font-semibold shadow-sm">
              <FileBarChart className="h-4 w-4 mr-2" /> Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 px-6">
          <CardTitle className="text-lg font-bold text-slate-900">Data View</CardTitle>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="bg-white flex-1 sm:flex-none" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2 text-slate-500" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" className="bg-white flex-1 sm:flex-none" onClick={handleExport}>
              <Printer className="h-4 w-4 mr-2 text-slate-500" /> Print
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-slate-100 px-6 bg-slate-50/50">
              <TabsList className="bg-transparent h-auto p-0 space-x-6 flex-wrap">
                <TabsTrigger value="summary" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 py-4 text-sm text-slate-500 data-[state=active]:text-blue-700 font-bold tracking-tight">Contract Summary</TabsTrigger>
                <TabsTrigger value="expiring" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 py-4 text-sm text-slate-500 data-[state=active]:text-blue-700 font-bold tracking-tight">Expiring Contracts</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="summary" className="m-0 outline-none">
              {renderContractSummary()}
            </TabsContent>
            
            <TabsContent value="expiring" className="m-0 outline-none">
              {renderExpiring()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}