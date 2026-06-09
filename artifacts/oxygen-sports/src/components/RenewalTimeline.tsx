import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = ["Contract Created", "Active", "Reminder Sent", "Negotiation", "Renewed"];

interface RenewalTimelineProps {
  currentStage: number;
}

export default function RenewalTimeline({ currentStage }: RenewalTimelineProps) {
  return (
    <div className="py-6 px-4">
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center w-full max-w-4xl mx-auto gap-8 md:gap-0">
        
        {/* Connector line (desktop) */}
        <div className="hidden md:block absolute top-[15px] left-0 w-full h-[2px] bg-slate-200 -z-10 px-8">
          <motion.div 
            className="h-full bg-blue-500 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: currentStage / (STAGES.length - 1) }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>

        {/* Connector line (mobile) */}
        <div className="md:hidden absolute left-[15px] top-0 bottom-0 w-[2px] bg-slate-200 -z-10 my-4">
          <motion.div 
            className="w-full bg-blue-500 origin-top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: currentStage / (STAGES.length - 1) }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>

        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentStage;
          const isCurrent = idx === currentStage;
          
          return (
            <div key={stage} className="relative flex md:flex-col items-center group w-full md:w-auto z-10 gap-4 md:gap-2">
              
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-300",
                isCompleted ? "bg-blue-500 border-blue-500 text-white" : 
                isCurrent ? "bg-white border-blue-500 text-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]" : 
                "bg-white border-slate-300 text-slate-300"
              )}>
                {isCompleted ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + idx * 0.1 }}>
                    <Check className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <span className="text-xs font-bold">{idx + 1}</span>
                )}
              </div>
              
              <div className="flex flex-col md:items-center">
                <span className={cn(
                  "text-sm font-semibold transition-colors duration-300 whitespace-nowrap",
                  isCompleted ? "text-slate-900" : 
                  isCurrent ? "text-blue-600" : 
                  "text-slate-400"
                )}>
                  {stage}
                </span>
                <span className="text-[10px] text-slate-400 md:opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Stage {idx + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}