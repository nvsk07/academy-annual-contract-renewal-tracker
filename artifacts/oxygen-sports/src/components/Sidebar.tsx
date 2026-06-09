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
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Contracts", href: "/contracts", icon: FileText },
  { label: "Renewal Entry", href: "/contracts/new", icon: FilePlus },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
  { label: "Reports", href: "/reports", icon: FileBarChart },
  { label: "Alerts Center", href: "/alerts", icon: BellRing, badge: 3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

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
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col shadow-sm",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Shield className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold text-lg text-slate-900 tracking-tight">Oxygen Sports</span>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Main Menu</div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  <div className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer group",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}>
                    <div className="flex items-center">
                      <Icon className={cn("h-5 w-5 mr-3", isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600")} />
                      {item.label}
                    </div>
                    {item.badge && (
                      <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
            <div className="text-xs text-slate-500 mb-1">Contract Quota</div>
            <div className="text-sm font-bold text-slate-900">85% Used</div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
              <div className="bg-primary h-1.5 rounded-full w-[85%]"></div>
            </div>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}