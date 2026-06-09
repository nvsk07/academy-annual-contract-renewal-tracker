import { Link, useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockContracts } from "@/data/contracts";
import { mockActivity } from "@/data/activity";
import { 
  ArrowLeft, Edit, Printer, Download, MapPin, Phone, Mail, User, 
  Calendar, CheckCircle, TrendingUp, IndianRupee, Clock,
  Activity
} from "lucide-react";

export default function ContractDetail() {
  const { id } = useParams<{ id: string }>();
  const contract = mockContracts.find(c => c.id === id) || mockContracts[0];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active": return <Badge className="bg-green-100 text-green-800 border-none">Active</Badge>;
      case "Expiring Soon": return <Badge className="bg-orange-100 text-orange-800 border-none">Expiring</Badge>;
      case "Renewed": return <Badge className="bg-blue-100 text-blue-800 border-none">Renewed</Badge>;
      case "Archived": return <Badge className="bg-slate-100 text-slate-800 border-none">Archived</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const increase = ((contract.currentContractValue - contract.previousContractValue) / contract.previousContractValue) * 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/contracts">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <span className="text-sm font-medium text-slate-500">Back to Contracts</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">{contract.academyName}</h1>
            {getStatusBadge(contract.status)}
          </div>
          <div className="text-sm text-slate-500 flex items-center gap-4">
            <span>ID: <span className="font-medium text-slate-700">{contract.id}</span></span>
            <span>Type: <span className="font-medium text-slate-700">{contract.academyType}</span></span>
            <span>RM: <span className="font-medium text-slate-700">{contract.relationshipManager}</span></span>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none">
            <Printer className="h-4 w-4 mr-2" /> Print
          </Button>
          <Button variant="outline" className="flex-1 md:flex-none">
            <Download className="h-4 w-4 mr-2" /> PDF
          </Button>
          <Button className="flex-1 md:flex-none">
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base flex items-center">
              <User className="h-4 w-4 mr-2 text-primary" /> Academy Info
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">Contact Person</div>
              <div className="font-medium text-slate-900">{contract.contactPerson}</div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
              <div className="text-slate-700">{contract.phone}</div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Mail className="h-4 w-4 text-slate-400 mt-0.5" />
              <div className="text-slate-700">{contract.email}</div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
              <div className="text-slate-700">
                {contract.address}<br />
                {contract.city}, {contract.state}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" /> Contract Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Start Date</span>
              <span className="font-medium text-slate-900">{new Date(contract.contractStartDate).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Expiry Date</span>
              <span className="font-medium text-slate-900">{new Date(contract.contractExpiryDate).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Duration</span>
              <span className="font-medium text-slate-900">{contract.durationMonths} Months</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-500">Frequency</span>
              <span className="font-medium text-slate-900">{contract.supplyFrequency}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base flex items-center">
              <IndianRupee className="h-4 w-4 mr-2 text-primary" /> Pricing & Supply
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Current Value</div>
              <div className="text-2xl font-bold text-slate-900">₹{contract.currentContractValue.toLocaleString('en-IN')}</div>
              {increase > 0 && (
                <div className="flex items-center text-xs text-green-600 mt-1 font-medium">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {increase.toFixed(1)}% from previous
                </div>
              )}
            </div>
            
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">Equipment Categories</div>
              <div className="flex flex-wrap gap-2">
                {contract.equipmentCategories.map(cat => (
                  <Badge key={cat} variant="secondary" className="bg-slate-100 text-slate-700">{cat}</Badge>
                ))}
              </div>
            </div>
            <div className="pt-2">
              <span className="text-sm text-slate-500">Total Quantity: </span>
              <span className="font-medium text-slate-900">{contract.quantity} items</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-lg">Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {mockActivity.filter(a => a.contractId === contract.id).length > 0 ? (
              mockActivity.filter(a => a.contractId === contract.id).map((activity, index) => (
                <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    {activity.type === 'contract_created' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {activity.type === 'price_updated' && <TrendingUp className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'contract_renewed' && <CheckCircle className="h-4 w-4 text-primary" />}
                    {activity.type === 'reminder_generated' && <Clock className="h-4 w-4 text-orange-500" />}
                    {activity.type === 'status_changed' && <Activity className="h-4 w-4 text-slate-600" />}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-slate-200 shadow-sm bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-slate-900 text-sm">{activity.actor}</div>
                      <time className="text-xs font-medium text-slate-500">
                        {new Date(activity.timestamp).toLocaleDateString('en-IN')}
                      </time>
                    </div>
                    <div className="text-slate-600 text-sm">{activity.description}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">No activity recorded for this contract yet.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}