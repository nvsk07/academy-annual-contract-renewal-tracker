import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileBarChart, Download, Printer } from "lucide-react";

export default function Reports() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports Module</h1>
        <p className="text-slate-500 text-sm">Generate and export detailed contract reports</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Date Range</label>
              <Select defaultValue="this_year">
                <SelectTrigger>
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
              <label className="text-sm font-medium text-slate-700">Status</label>
              <Select defaultValue="all">
                <SelectTrigger>
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
              <label className="text-sm font-medium text-slate-700">Relationship Manager</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All Managers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Managers</SelectItem>
                  <SelectItem value="priya">Priya Sharma</SelectItem>
                  <SelectItem value="arjun">Arjun Mehta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">
              <FileBarChart className="h-4 w-4 mr-2" /> Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg font-bold">Report Preview</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Excel
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="summary" className="w-full">
            <div className="border-b border-slate-100 px-6 pt-2">
              <TabsList className="bg-transparent h-auto p-0 space-x-6">
                <TabsTrigger value="summary" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-slate-500 data-[state=active]:text-primary font-medium">Contract Summary</TabsTrigger>
                <TabsTrigger value="renewal" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-slate-500 data-[state=active]:text-primary font-medium">Renewal Report</TabsTrigger>
                <TabsTrigger value="revenue" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-slate-500 data-[state=active]:text-primary font-medium">Revenue Impact</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="summary" className="p-6 m-0 outline-none">
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-lg p-12 text-center text-slate-500">
                <FileBarChart className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p>Click "Generate" to view the report data here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="renewal" className="p-6 m-0 outline-none">
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-lg p-12 text-center text-slate-500">
                <p>Renewal report preview...</p>
              </div>
            </TabsContent>
            
            <TabsContent value="revenue" className="p-6 m-0 outline-none">
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-lg p-12 text-center text-slate-500">
                <p>Revenue impact preview...</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}