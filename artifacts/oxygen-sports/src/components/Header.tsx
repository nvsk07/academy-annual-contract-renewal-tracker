import { Bell, Search, Plus, User, LogOut, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { getContractsExpiringWithin } from "@/services/contractService";
import { TODAY_DATE } from "@/constants/appConstants";

export default function Header() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currentDate = new Intl.DateTimeFormat("en-IN", { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date(TODAY_DATE));

  const recentAlerts = getContractsExpiringWithin(30)
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 3);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shadow-sm ml-12 md:ml-0">
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            type="search" 
            placeholder="Search academies, contracts, or RMs..." 
            className="w-full bg-slate-50 border-slate-200 pl-9 h-9 text-sm focus-visible:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-4 ml-auto">
        <div className="hidden md:block text-sm text-slate-500 font-medium mr-2">
          {currentDate}
        </div>
        
        <Link href="/contracts/new">
          <Button size="sm" className="hidden sm:flex bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-1" /> Add Contract
          </Button>
        </Link>
        
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </Button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50 overflow-hidden"
                >
                  <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <span className="font-semibold text-sm text-slate-900">Notifications</span>
                    <Link href="/alerts" onClick={() => setShowNotifications(false)}>
                      <span className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer font-medium">View All</span>
                    </Link>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-[300px] overflow-auto">
                    {recentAlerts.length > 0 ? (
                      recentAlerts.map(alert => (
                        <Link key={alert.id} href={`/contracts/${alert.id}`} onClick={() => setShowNotifications(false)}>
                          <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer block">
                            <div className="text-sm font-medium text-slate-900 line-clamp-1">{alert.academyName}</div>
                            <div className="text-xs text-slate-500 mt-0.5">Expires in {alert.daysRemaining} days</div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-slate-500">No new notifications</div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        
        <div className="relative pl-2 border-l border-slate-200">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="hidden md:block text-right mr-3">
              <div className="text-sm font-bold text-slate-900 leading-tight">{user?.name || "Guest"}</div>
              <div className="text-xs text-slate-500 capitalize">{user?.role.replace('_', ' ') || "User"}</div>
            </div>
            <Avatar className="h-9 w-9 border border-slate-200 group-hover:ring-2 ring-primary/20 transition-all">
              <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">{user?.avatar || "G"}</AvatarFallback>
            </Avatar>
          </div>

          <AnimatePresence>
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50 overflow-hidden py-1"
                >
                  <Link href="/settings" onClick={() => setShowUserMenu(false)}>
                    <div className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer">
                      <User className="h-4 w-4 mr-2" /> My Profile
                    </div>
                  </Link>
                  <Link href="/settings" onClick={() => setShowUserMenu(false)}>
                    <div className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" /> Settings
                    </div>
                  </Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <div 
                    onClick={() => { setShowUserMenu(false); logout(); }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer font-medium"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
