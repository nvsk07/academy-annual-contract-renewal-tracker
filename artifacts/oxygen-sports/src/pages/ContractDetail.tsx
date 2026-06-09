import { Link, useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockContracts, getDaysRemaining } from "@/data/contracts";
import { mockActivity } from "@/data/activity";
import HealthBadge from "@/components/HealthBadge";
import RenewalTimeline from "@/components/RenewalTimeline";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, Edit, Printer, Download, MapPin, Phone, Mail, User, 
  Calendar, CheckCircle, TrendingUp, IndianRupee, Clock,
  Activity, Archive, Plus, AlertCircle, RefreshCw, FileText,
  Bell
} from "lucide-react";

export default function ContractDetail() {
  const { id } = useParams<{ id: string }>();
  const contract = mockContracts.find(c => c.id === id) || mockContracts[0];
  const { toast } = useToast();

  const daysRemaining = getDaysRemaining(contract.contractExpiryDate);
  const increase = ((contract.currentContractValue - contract.previousContractValue) / contract.previousContractValue) * 100;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active": return <Badge className="bg-green-100 text-green-800 border-none shadow-none px-3">Active</Badge>;
      case "Expiring Soon": return <Badge className="bg-orange-100 text-orange-800 border-none shadow-none px-3">Expiring Soon</Badge>;
      case "Renewed": return <Badge className="bg-blue-100 text-blue-800 border-none shadow-none px-3">Renewed</Badge>;
      case "Archived": return <Badge className="bg-slate-100 text-slate-800 border-none shadow-none px-3">Archived</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getStageFromStatus = () => {
    if (contract.status === "Active") return 1;
    if (contract.status === "Expiring Soon") return 2;
    if (contract.status === "Renewed" || contract.status === "Archived") return 4;
    return 0;
  };

  const handleAction = (action: string) => {
    toast({ title: action, description: `${action} feature will be available with backend integration.` });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/contracts">
          <Button variant="ghost" size="sm" className="h-8 text-slate-500 hover:text-slate-900 pl-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Contracts
          </Button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{contract.academyName}</h1>
              {getStatusBadge(contract.status)}
              <HealthBadge daysRemaining={daysRemaining} />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md font-mono text-slate-700">
                <FileText className="h-3.5 w-3.5" /> {contract.id}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                {contract.academyType}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                RM: <span className="font-semibold text-slate-900">{contract.relationshipManager}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                <span className="font-bold text-slate-900">{daysRemaining}</span> days remaining
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto shrink-0">
            <Button variant="outline" className="bg-white hover:bg-slate-50" onClick={() => handleAction("Print")}>
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
            <Button variant="outline" className="bg-white hover:bg-slate-50" onClick={() => handleAction("Export PDF")}>
              <Download className="h-4 w-4 mr-2" /> PDF
            </Button>
            <Button variant="outline" className="bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200" onClick={() => handleAction("Archive")}>
              <Archive className="h-4 w-4 mr-2" /> Archive
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-bold flex items-center">
              <User className="h-4 w-4 mr-2 text-blue-600" /> Academy Info
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-5">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Person</div>
              <div className="font-semibold text-slate-900 text-lg">{contract.contactPerson}</div>
            </div>
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-start gap-3 text-sm">
                <div className="bg-slate-100 p-1.5 rounded-md text-slate-500 mt-0.5"><Phone className="h-3.5 w-3.5" /></div>
                <div className="font-medium text-slate-700 pt-1">{contract.phone}</div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="bg-slate-100 p-1.5 rounded-md text-slate-500 mt-0.5"><Mail className="h-3.5 w-3.5" /></div>
                <div className="font-medium text-slate-700 pt-1 break-all">{contract.email}</div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="bg-slate-100 p-1.5 rounded-md text-slate-500 mt-0.5"><MapPin className="h-3.5 w-3.5" /></div>
                <div className="font-medium text-slate-700 pt-1">
                  {contract.address}<br />
                  {contract.city}, {contract.state}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-bold flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-600" /> Contract Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              <div className="flex justify-between items-center p-4">
                <span className="text-sm font-medium text-slate-500">Start Date</span>
                <span className="font-bold text-slate-900">{new Date(contract.contractStartDate).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-orange-50/30">
                <span className="text-sm font-medium text-slate-500">Expiry Date</span>
                <span className="font-bold text-slate-900">{new Date(contract.contractExpiryDate).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-sm font-medium text-slate-500">Duration</span>
                <span className="font-bold text-slate-900">{contract.durationMonths} Months</span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-sm font-medium text-slate-500">Supply Frequency</span>
                <Badge variant="outline" className="bg-slate-50 text-slate-700 font-semibold">{contract.supplyFrequency}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-bold flex items-center">
              <IndianRupee className="h-4 w-4 mr-2 text-blue-600" /> Equipment & Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-5">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Current Contract Value</div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">₹{contract.currentContractValue.toLocaleString('en-IN')}</div>
              {increase !== 0 && (
                <div className={`flex items-center text-xs mt-2 font-bold ${increase > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {increase > 0 ? <TrendingUp className="h-3.5 w-3.5 mr-1" /> : <TrendingUp className="h-3.5 w-3.5 mr-1 rotate-180" />}
                  {Math.abs(increase).toFixed(1)}% revision from previous
                </div>
              )}
            </div>
            
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Equipment Categories</div>
              <div className="flex flex-wrap gap-2">
                {contract.equipmentCategories.map(cat => (
                  <Badge key={cat} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none shadow-none">{cat}</Badge>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <span className="text-sm font-medium text-slate-500">Total Quantity Approved:</span>
              <span className="font-bold text-slate-900 text-lg">{contract.quantity}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Renewal Timeline */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-base font-bold">Renewal Timeline</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <RenewalTimeline currentStage={getStageFromStatus()} />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-base font-bold flex items-center">
            <Activity className="h-4 w-4 mr-2 text-blue-600" /> Activity History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
            {mockActivity.filter(a => a.contractId === contract.id).length > 0 ? (
              mockActivity.filter(a => a.contractId === contract.id).map((activity) => (
                <div key={activity.id} className="relative flex items-start gap-4">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow-sm shrink-0 z-10">
                    {activity.type === 'contract_created' && <Plus className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'price_updated' && <TrendingUp className="h-4 w-4 text-indigo-500" />}
                    {activity.type === 'contract_renewed' && <RefreshCw className="h-4 w-4 text-green-500" />}
                    {activity.type === 'reminder_generated' && <Bell className="h-4 w-4 text-orange-500" />}
                    {activity.type === 'status_changed' && <AlertCircle className="h-4 w-4 text-slate-600" />}
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1">
                      <div className="font-bold text-slate-900 text-sm">{activity.actor}</div>
                      <time className="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">
                        {new Date(activity.timestamp).toLocaleString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </time>
                    </div>
                    <div className="text-slate-600 text-sm mt-2">{activity.description}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 font-medium">No activity recorded for this contract yet.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}