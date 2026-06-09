import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockContracts } from "@/data/contracts";
import { mockActivity } from "@/data/activity";
import { 
  FileText, AlertCircle, CheckCircle, Archive, 
  TrendingUp, Activity, Plus, FileBarChart, Download, Bell
} from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend 
} from "recharts";

export default function Dashboard() {
  const activeContracts = mockContracts.filter(c => c.status === "Active");
  const expiringContracts = mockContracts.filter(c => c.status === "Expiring Soon");
  const renewedContracts = mockContracts.filter(c => c.status === "Renewed");
  const archivedContracts = mockContracts.filter(c => c.status === "Archived");

  const totalValue = mockContracts.reduce((acc, c) => acc + c.currentContractValue, 0);

  const statusData = [
    { name: 'Active', value: activeContracts.length, color: 'hsl(221, 83%, 53%)' },
    { name: 'Expiring Soon', value: expiringContracts.length, color: 'hsl(25, 95%, 53%)' },
    { name: 'Renewed', value: renewedContracts.length, color: 'hsl(142, 71%, 45%)' },
    { name: 'Archived', value: archivedContracts.length, color: 'hsl(215, 16%, 47%)' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm">Overview of your contract portfolio</p>
        </div>
        <Link href="/contracts/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add New Contract
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Contracts</p>
                <h3 className="text-2xl font-bold mt-1">{mockContracts.length}</h3>
              </div>
              <div className="p-2 bg-slate-100 rounded-lg">
                <FileText className="h-5 w-5 text-slate-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+12.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 border-l-4 border-primary">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Active</p>
                <h3 className="text-2xl font-bold mt-1">{activeContracts.length}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 border-l-4 border-orange-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Expiring Soon</p>
                <h3 className="text-2xl font-bold mt-1">{expiringContracts.length}</h3>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Renewed</p>
                <h3 className="text-2xl font-bold mt-1">{renewedContracts.length}</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Archived</p>
                <h3 className="text-2xl font-bold mt-1">{archivedContracts.length}</h3>
              </div>
              <div className="p-2 bg-slate-100 rounded-lg">
                <Archive className="h-5 w-5 text-slate-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Revenue</p>
                <h3 className="text-xl font-bold mt-1 text-slate-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">₹{(totalValue/100000).toFixed(2)}L</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+8.2%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-lg font-bold">Upcoming Renewals</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Academy</th>
                      <th className="px-4 py-3 font-semibold">Renewal Date</th>
                      <th className="px-4 py-3 font-semibold">Days Remaining</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">RM Name</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {expiringContracts.slice(0, 5).map(contract => (
                      <tr key={contract.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900">
                          <Link href={`/contracts/${contract.id}`} className="hover:text-primary">
                            {contract.academyName}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {new Date(contract.contractExpiryDate).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            30 Days
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                            {contract.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{contract.relationshipManager}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {mockActivity.slice(0, 6).map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="mt-1 bg-slate-100 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                      {activity.type === 'contract_created' && <Plus className="h-4 w-4 text-primary" />}
                      {activity.type === 'contract_renewed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {activity.type === 'price_updated' && <TrendingUp className="h-4 w-4 text-blue-500" />}
                      {activity.type === 'status_changed' && <Activity className="h-4 w-4 text-orange-500" />}
                      {activity.type === 'reminder_generated' && <Bell className="h-4 w-4 text-slate-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                      <div className="flex items-center text-xs text-slate-500 mt-1 gap-2">
                        <span>{activity.actor}</span>
                        <span>•</span>
                        <span>{new Date(activity.timestamp).toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-lg font-bold">Contract Status Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col items-center">
              <div className="h-64 w-full">
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

          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-2 gap-3">
              <Link href="/contracts/new">
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-colors cursor-pointer group text-center gap-2 h-full">
                  <div className="p-2 bg-white rounded-full shadow-sm group-hover:text-primary">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-primary">New Contract</span>
                </div>
              </Link>
              <Link href="/reports">
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-colors cursor-pointer group text-center gap-2 h-full">
                  <div className="p-2 bg-white rounded-full shadow-sm group-hover:text-primary">
                    <FileBarChart className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-primary">Reports</span>
                </div>
              </Link>
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-colors cursor-pointer group text-center gap-2 h-full">
                <div className="p-2 bg-white rounded-full shadow-sm group-hover:text-primary">
                  <Download className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-primary">Export Data</span>
              </div>
              <Link href="/alerts">
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-colors cursor-pointer group text-center gap-2 h-full">
                  <div className="p-2 bg-white rounded-full shadow-sm group-hover:text-primary">
                    <Bell className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-primary">View Alerts</span>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}