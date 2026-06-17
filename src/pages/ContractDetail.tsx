import { Link, useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVisibleContractById, updateContract, deleteContract, getContractActivities } from "@/services/contractService";
import { ContractWithHealth } from "@/services/contractService";
import { useAuth } from "@/hooks/useAuth";
import Unauthorized from "@/pages/Unauthorized";
import { Activity as ActivityType } from "@/data/activity";
import HealthBadge from "@/components/HealthBadge";
import RenewalTimeline from "@/components/RenewalTimeline";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, Edit, Printer, Download, MapPin, Phone, Mail, User, 
  Calendar, Package, Activity, Archive, Plus, AlertCircle, RefreshCw, FileText, Bell, Trash2, Loader2
} from "lucide-react";
import { getStatusBadgeClasses, getRenewalStageIndex } from "@/utils/contractUtils";
import { formatDate } from "@/utils/dateUtils";
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

export default function ContractDetail() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [contract, setContract] = useState<ContractWithHealth | null | undefined>(undefined);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadData() {
    setIsLoading(true);
    try {
      const [c, acts] = await Promise.all([
        getVisibleContractById(user, id || ""),
        getContractActivities(id || ""),
      ]);
      setContract(c);
      setActivities(acts);
    } catch (err) {
      console.error("Failed to load contract detail:", err);
      setContract(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user) loadData();
  }, [user, id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-500 text-sm font-medium">Loading contract details...</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return <Unauthorized />;
  }

  const getStatusBadge = (status: string) => {
    return <Badge className={`${getStatusBadgeClasses(status)} border-none shadow-none px-3`}>{status}</Badge>;
  };

  const handlePrint = () => window.print();

  const handleExportPDF = () => {
    toast({
      title: "Exporting Document",
      description: "A PDF copy of this contract worksheet has been prepared for download.",
    });
  };

  const handleArchive = async () => {
    if (!user) return;
    try {
      await updateContract(contract.id, { status: "Archived" }, user);
      toast({ title: "Contract Archived", description: "The contract has been set to Archived status." });
      loadData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to archive.", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    try {
      await deleteContract(contract.id, user);
      toast({
        title: "Contract Deleted",
        description: `Contract ${contract.id} has been permanently deleted from Oxygen Sports database.`,
      });
      setLocation("/contracts");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to delete.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/contracts">
          <Button variant="ghost" size="sm" className="h-8 text-slate-500 hover:text-slate-900 border border-slate-200 pl-2">
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
              <HealthBadge daysRemaining={contract.daysRemaining} />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md font-mono text-slate-700">
                <FileText className="h-3.5 w-3.5" /> {contract.id}
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                {contract.academyType}
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                RM: <span className="font-bold text-slate-900">{contract.relationshipManagerName}</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                {contract.daysRemaining < 0 ? (
                  <span className="font-bold text-red-600">Expired</span>
                ) : (
                  <>
                    <span className="font-bold text-slate-900">{contract.daysRemaining}</span> days remaining
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto shrink-0">
            <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
            <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" /> PDF
            </Button>
            {contract.status !== "Archived" && (
              <Button variant="outline" className="bg-white hover:bg-red-55 hover:text-red-700 hover:border-red-200 border-slate-200" onClick={handleArchive}>
                <Archive className="h-4 w-4 mr-2" /> Archive
              </Button>
            )}
            {user?.role === "admin" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="bg-white hover:bg-red-100 text-red-600 hover:text-red-700 border-slate-200">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white rounded-xl border border-slate-200">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-bold">Delete Contract</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500">
                      Are you sure you want to permanently delete contract {contract.id} ({contract.academyName})? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="border-slate-200">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Link href={`/contracts/${contract.id}/edit`}>
              <Button className="bg-blue-600 hover:bg-blue-700 font-semibold">
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-bold flex items-center text-slate-800">
              <User className="h-4 w-4 mr-2 text-blue-600" /> Academy Info
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-5">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Person</div>
              <div className="font-bold text-slate-900 text-lg">{contract.contactPerson}</div>
            </div>
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-start gap-3 text-sm">
                <div className="bg-slate-100 p-1.5 rounded-md text-slate-500 mt-0.5"><Phone className="h-3.5 w-3.5" /></div>
                <div className="font-semibold text-slate-700 pt-1">{contract.phone}</div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="bg-slate-100 p-1.5 rounded-md text-slate-500 mt-0.5"><Mail className="h-3.5 w-3.5" /></div>
                <div className="font-semibold text-slate-700 pt-1 break-all">{contract.email}</div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="bg-slate-100 p-1.5 rounded-md text-slate-500 mt-0.5"><MapPin className="h-3.5 w-3.5" /></div>
                <div className="font-semibold text-slate-700 pt-1">
                  {contract.address}<br />
                  {contract.city}, {contract.state}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-bold flex items-center text-slate-800">
              <Calendar className="h-4 w-4 mr-2 text-blue-600" /> Contract Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              <div className="flex justify-between items-center p-4">
                <span className="text-sm font-semibold text-slate-500">Start Date</span>
                <span className="font-bold text-slate-900">{formatDate(contract.contractStartDate)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-orange-50/20">
                <span className="text-sm font-semibold text-slate-500">Expiry Date</span>
                <span className="font-bold text-slate-900">{formatDate(contract.contractEndDate)}</span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-sm font-semibold text-slate-500">Duration</span>
                <span className="font-bold text-slate-900">{contract.durationMonths} Months</span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-sm font-semibold text-slate-500">Supply Frequency</span>
                <Badge variant="outline" className="bg-slate-50 text-slate-700 font-semibold border-slate-200">{contract.supplyFrequency}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-bold flex items-center text-slate-800">
              <Package className="h-4 w-4 mr-2 text-blue-600" /> Equipment &amp; Supply
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-5">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Equipment Categories</div>
              <div className="flex flex-wrap gap-2">
                {contract.equipmentCategories.map(cat => (
                  <Badge key={cat} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none shadow-none font-semibold">{cat}</Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-500">Total Quantity Approved</span>
                <span className="font-bold text-slate-900 text-lg">{contract.quantity} units</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-500">Department</span>
                <span className="font-bold text-slate-900">{contract.department || "General Sports"}</span>
              </div>
              {contract.notes && (
                <div className="pt-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Logistics Notes</div>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed font-semibold">{contract.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Renewal Timeline */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-base font-bold text-slate-800">Renewal Timeline</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <RenewalTimeline currentStage={getRenewalStageIndex(contract.status)} />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-base font-bold flex items-center text-slate-800">
            <Activity className="h-4 w-4 mr-2 text-blue-600" /> Activity History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="relative flex items-start gap-4">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow-sm shrink-0 z-10">
                    {activity.type === 'contract_created' && <Plus className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'price_updated' && <RefreshCw className="h-4 w-4 text-indigo-500" />}
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
                    <div className="text-slate-600 text-sm mt-2 font-medium">{activity.description}</div>
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
