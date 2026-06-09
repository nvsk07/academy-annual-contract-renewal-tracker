import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Header() {
  const currentDate = new Intl.DateTimeFormat("en-IN", { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date());

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

      <div className="flex items-center space-x-4 md:space-x-6 ml-auto">
        <div className="hidden md:block text-sm text-slate-500 font-medium">
          {currentDate}
        </div>
        
        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1.5 h-2 w-2 bg-orange-500 rounded-full border-2 border-white"></span>
        </Button>
        
        <div className="flex items-center pl-2 border-l border-slate-200">
          <div className="hidden md:block text-right mr-3">
            <div className="text-sm font-bold text-slate-900 leading-tight">Rajesh Kumar</div>
            <div className="text-xs text-slate-500">Sales Manager</div>
          </div>
          <Avatar className="h-9 w-9 border border-slate-200 cursor-pointer hover:ring-2 ring-primary/20 transition-all">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">RK</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}