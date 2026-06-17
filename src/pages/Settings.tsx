import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Shield, Settings2, Save, Users, Loader2 } from "lucide-react";

export default function Settings() {
  const { user, changePassword } = useAuth();
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Settings Saved", description: "Your preferences have been updated successfully." });
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: "Error", description: "All fields are required.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "New password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast({ title: "Password Updated", description: "Your password has been changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update password. Verify your current password.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 text-sm">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 bg-slate-100 p-1 rounded-lg flex flex-wrap h-auto gap-1">
          <TabsTrigger value="profile" className="flex-1 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 text-sm font-semibold">
            <User className="h-4 w-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 text-sm font-semibold">
            <Bell className="h-4 w-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 text-sm font-semibold">
            <Shield className="h-4 w-4 mr-2" /> Security
          </TabsTrigger>
          {user?.role === "admin" && (
            <TabsTrigger value="system" className="flex-1 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 text-sm font-semibold">
              <Settings2 className="h-4 w-4 mr-2" /> System
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile" className="space-y-6 m-0 outline-none">
          <Card className="shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-bold">Personal Information</CardTitle>
              <CardDescription>Update your photo and personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                  <Avatar className="h-20 w-20 border-2 border-slate-200">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xl font-bold">{user?.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button type="button" variant="outline" size="sm">Change Photo</Button>
                    <p className="text-xs text-slate-500">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.name} className="bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input id="employeeId" defaultValue={user?.employeeId} disabled className="bg-slate-100 text-slate-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" defaultValue={user?.department} disabled className="bg-slate-100 text-slate-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue={user?.role.replace('_', ' ').toUpperCase()} disabled className="bg-slate-100 text-slate-500" />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 m-0 outline-none">
          <Card className="shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-bold">Notification Preferences</CardTitle>
              <CardDescription>Choose what updates you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Email Notifications</h4>
                <div className="flex items-center justify-between py-3 border-b border-slate-50">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Contract Expiry Alerts</Label>
                    <p className="text-sm text-slate-500">Receive emails when contracts are 30, 15, and 7 days from expiry.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-50">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Weekly Summary</Label>
                    <p className="text-sm text-slate-500">Receive a weekly digest of your portfolio's health.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-50">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">System Updates</Label>
                    <p className="text-sm text-slate-500">Receive emails about new features and system maintenance.</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" /> Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 m-0 outline-none">
          <Card className="shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-bold">Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handlePasswordReset} className="space-y-4 max-w-md" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input 
                    id="current" 
                    type="password" 
                    required 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    placeholder="Enter current password"
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input 
                    id="new" 
                    type="password" 
                    required 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="Minimum 6 characters"
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input 
                    id="confirm" 
                    type="password" 
                    required 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="Re-enter new password"
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold"
                    disabled={isUpdatingPassword}
                  >
                    {isUpdatingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {user?.role === "admin" && (
          <TabsContent value="system" className="space-y-6 m-0 outline-none">
            <Card className="shadow-sm border-dashed border-2">
              <CardContent className="p-12 text-center flex flex-col items-center justify-center">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <Users className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">User Management</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">This section is available for admin users to manage staff accounts, roles, and system-wide configurations.</p>
                <Button variant="outline" className="font-semibold shadow-sm">Open Admin Console</Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
