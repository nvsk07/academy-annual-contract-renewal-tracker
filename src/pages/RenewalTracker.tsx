import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useContracts } from "@/hooks/useContracts";
import { updateContract, ContractWithHealth } from "@/services/contractService";
import HealthBadge from "@/components/HealthBadge";
import { Button } from "@/components/ui/button";
import { getRenewalStageIndex } from "@/utils/contractUtils";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STAGES = ["Created", "Active", "Reminder Sent", "Negotiation", "Renewed"];

export default function RenewalTracker() {
  const { user } = useAuth();
  const { allContracts: visibleContracts, isLoading } = useContracts();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const contracts = visibleContracts.map(c => ({ 
    ...c, 
    stage: c.status === "Expiring Soon" && c.workflowStage === "negotiation" ? 3 : getRenewalStageIndex(c.status) 
  }));

  const stageCounts = STAGES.map((_, idx) => contracts.filter(c => c.stage === idx).length);

  const handleMove = async (contract: ContractWithHealth, direction: "prev" | "next") => {
    if (!user) return;
    const currentStage = contract.status === "Expiring Soon" && contract.workflowStage === "negotiation" 
      ? 3 
      : getRenewalStageIndex(contract.status);
    
    let nextStage = direction === "next" ? currentStage + 1 : currentStage - 1;
    if (nextStage < 0 || nextStage > 4) return;

    setIsUpdating(contract.id);
    try {
      let statusUpdate: string = contract.status;
      let workflowStageUpdate: string = contract.workflowStage;

      if (nextStage === 0) {
        statusUpdate = "Archived";
        workflowStageUpdate = "created";
      } else if (nextStage === 1) {
        statusUpdate = "Active";
        workflowStageUpdate = "active";
      } else if (nextStage === 2) {
        statusUpdate = "Expiring Soon";
        workflowStageUpdate = "reminder_sent";
      } else if (nextStage === 3) {
        statusUpdate = "Expiring Soon";
        workflowStageUpdate = "negotiation";
      } else if (nextStage === 4) {
        statusUpdate = "Renewed";
        workflowStageUpdate = "renewed";
      }

      await updateContract(contract.id, {
        status: statusUpdate as any,
        workflowStage: workflowStageUpdate as any
      }, user);

      toast({
        title: "Stage Updated",
        description: `Moved ${contract.academyName} to ${STAGES[nextStage]}.`
      });
    } catch (err: any) {
      toast({
        title: "Error updating stage",
        description: err.message || "Failed to update contract stage.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-500 text-sm font-medium">Loading renewal tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Renewal Tracker</h1>
        <p className="text-slate-500 text-sm">Visual workflow of all contract renewals</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {STAGES.map((stageName, idx) => (
          <Card key={stageName} className="min-w-[300px] flex-1 bg-slate-50/50 border-dashed border-2">
            <CardHeader className="py-4 px-4 bg-white rounded-t-lg border-b border-solid border-slate-100">
              <CardTitle className="text-sm font-bold flex justify-between items-center">
                <span>{stageName}</span>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{stageCounts[idx]}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              {contracts.filter(c => c.stage === idx).map(contract => (
                <div key={contract.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/contracts/${contract.id}`}>
                      <span className="font-bold text-sm text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1">{contract.academyName}</span>
                    </Link>
                  </div>
                  {user?.role === 'admin' && (
                    <div className="flex justify-between items-center text-xs text-slate-500 mb-3">
                      <span>RM: {contract.relationshipManagerName}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <HealthBadge daysRemaining={contract.daysRemaining} />
                    <div className="flex items-center gap-1">
                      {isUpdating === contract.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      ) : (
                        <>
                          {idx > 0 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full hover:bg-slate-100"
                              onClick={() => handleMove(contract, "prev")}
                              title="Move back"
                            >
                              <ChevronLeft className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {idx < 4 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full hover:bg-slate-100"
                              onClick={() => handleMove(contract, "next")}
                              title="Move forward"
                            >
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </>
                      )}
                      <Link href={`/contracts/${contract.id}`}>
                        <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 ml-1">View</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {stageCounts[idx] === 0 && (
                <div className="text-center py-6 text-slate-400 text-sm font-medium">Empty</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
