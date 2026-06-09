import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockContracts, getDaysRemaining } from "@/data/contracts";
import HealthBadge from "@/components/HealthBadge";
import RenewalTimeline from "@/components/RenewalTimeline";
import { Button } from "@/components/ui/button";

const STAGES = ["Contract Created", "Active", "Reminder Sent", "Negotiation", "Renewed"];

export default function RenewalTracker() {
  const contractsWithComputed = mockContracts.map(c => {
    let stage = 0;
    if (c.status === "Active") stage = 1;
    if (c.status === "Expiring Soon") stage = 2;
    if (c.status === "Renewed" || c.status === "Archived") stage = 4;
    
    return {
      ...c,
      daysRemaining: getDaysRemaining(c.contractExpiryDate),
      stage
    };
  });

  const stageCounts = STAGES.map((_, idx) => 
    contractsWithComputed.filter(c => c.stage === idx).length
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
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
              {contractsWithComputed.filter(c => c.stage === idx).map(contract => (
                <div key={contract.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/contracts/${contract.id}`}>
                      <span className="font-bold text-sm text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1">{contract.academyName}</span>
                    </Link>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500 mb-3">
                    <span>RM: {contract.relationshipManager}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <HealthBadge daysRemaining={contract.daysRemaining} />
                    <Link href={`/contracts/${contract.id}`}>
                      <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2">View</Button>
                    </Link>
                  </div>
                </div>
              ))}
              {stageCounts[idx] === 0 && (
                <div className="text-center py-6 text-slate-400 text-sm font-medium">
                  Empty
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}