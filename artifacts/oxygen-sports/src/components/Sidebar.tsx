import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  FileText, 
  FilePlus, 
  BarChart2, 
  FileBarChart, 
  BellRing, 
  Settings,
  Shield,
  Menu,
  X,
  ChevronDown,
  RefreshCw,
  Users,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { getVisibleContractsExpiringWithin } from "@/services/contractService";

export default function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [contractsExpanded, setContractsExpanded] = useState(true);
  const { user, logout } = useAuth();

  const criticalAndHighRiskCount = getVisibleContractsExpiringWithin(user, 30).length;

  const allNavItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { 
      label: "Contracts", 
      icon: FileText,
      subItems: [
        { label: "All Contracts", href: "/contracts", icon: FileText },
        { label: "Create Contract", href: "/contracts/new", icon: FilePlus },
        { label: "Renewal Tracker", href: "/contracts/renewal-tracker", icon: RefreshCw },
      ]
    },
    { label: "Analytics", href: "/analytics", icon: BarChart2, adminOnly: true },
    { label: "Reports", href: "/reports", icon: FileBarChart },
    { label: "Alerts Center", href: "/alerts", icon: BellRing, badge: criticalAndHighRiskCount },
    { label: "User Management", href: "/admin/users", icon: Users, adminOnly: true },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const navItems = allNavItems.filter(item => {
    if (item.adminOnly && user?.role !== "admin") return false;
    return true;
  });

  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        className="md:hidden fixed top-3 left-4 z-50 bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-[#0A192F] text-slate-300 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
          <Shield className="h-6 w-6 text-blue-500 mr-3 shrink-0" />
          <div>
            <div className="font-bold text-lg text-white tracking-tight leading-tight">Oxygen Sports</div>
            <div className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold">Contract Tracker</div>
          </div>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu</div>
          <nav className="space-y-1">
            {navItems.map((item, idx) => {
              if (item.subItems) {
                const isGroupActive = item.subItems.some(sub => location === sub.href);
                return (
                  <div key={idx} className="space-y-1">
                    <div 
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer group",
                        isGroupActive ? "text-white" : "hover:bg-slate-800/50 hover:text-white"
                      )}
                      onClick={() => setContractsExpanded(!contractsExpanded)}
                    >
                      <div className="flex items-center">
                        <item.icon className={cn("h-5 w-5 mr-3", isGroupActive ? "text-blue-500" : "text-slate-400 group-hover:text-blue-400")} />
                        {item.label}
                      </div>
                      <ChevronDown className={cn("h-4 w-4 transition-transform", contractsExpanded ? "rotate-180" : "")} />
                    </div>
                    
                    <AnimatePresence>
                      {contractsExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-10 space-y-1"
                        >
                          {item.subItems.map(sub => {
                            const isSubActive = location === sub.href;
                            return (
                              <Link key={sub.href} href={sub.href} onClick={() => setIsOpen(false)}>
                                <div className={cn(
                                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer group",
                                  isSubActive 
                                    ? "bg-blue-600 text-white shadow-sm" 
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}>
                                  <sub.icon className="h-4 w-4 mr-3 opacity-70" />
                                  {sub.label}
                                </div>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  <div className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer group",
                    isActive 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}>
                    <div className="flex items-center">
                      <Icon className={cn("h-5 w-5 mr-3", isActive ? "text-blue-200" : "text-slate-400 group-hover:text-blue-400")} />
                      {item.label}
                    </div>
                    {item.badge && item.badge > 0 ? (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {user && (
          <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 mt-auto">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0 shadow-inner">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">{user.name}</div>
                <div className="text-[10px] text-blue-300 uppercase tracking-wider truncate">
                  {user.role === 'admin' ? 'Administrator' : 'Relationship Manager'}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400 hover:bg-red-400/10 h-8 w-8" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}