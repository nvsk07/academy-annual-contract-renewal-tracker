import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
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
import { Plus, Edit, UserX, UserCheck, Key, Shield, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { MOCK_USERS, MockUser } from "@/constants/appConstants";
import Unauthorized from "@/pages/Unauthorized";

export default function UserManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<MockUser[]>(MOCK_USERS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<MockUser | null>(null);

  if (!user || user.role !== "admin") {
    return <Unauthorized />;
  }

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUser: MockUser = {
      employeeId: formData.get("employeeId") as string,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as "admin" | "relationship_manager",
      department: formData.get("department") as string,
      status: formData.get("status") as "active" | "inactive",
    };
    setUsers([...users, newUser]);
    setIsAddOpen(false);
    toast({ title: "Success", description: "User created successfully." });
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    const formData = new FormData(e.currentTarget);
    const updatedUser: MockUser = {
      ...editingUser,
      employeeId: formData.get("employeeId") as string,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as "admin" | "relationship_manager",
      department: formData.get("department") as string,
      status: formData.get("status") as "active" | "inactive",
    };
    setUsers(users.map(u => u.employeeId === updatedUser.employeeId ? updatedUser : u));
    setIsEditOpen(false);
    setEditingUser(null);
    toast({ title: "Success", description: "User updated successfully." });
  };

  const handleToggleStatus = (targetUser: MockUser) => {
    const newStatus = targetUser.status === "active" ? "inactive" : "active";
    setUsers(users.map(u => u.employeeId === targetUser.employeeId ? { ...u, status: newStatus } : u));
    toast({ title: "Status Updated", description: `User is now ${newStatus}.` });
  };

  const handleResetPassword = (email: string) => {
    toast({ title: "Password Reset", description: `Password reset email would be sent to ${email} in a live system.` });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 text-sm">Manage Oxygen Sports employee accounts</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employee ID</label>
                  <Input name="employeeId" required placeholder="OXY-XXX" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input name="name" required placeholder="John Doe" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input name="email" type="email" required placeholder="john.doe@oxygensports.in" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select name="role" defaultValue="relationship_manager">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="relationship_manager">Relationship Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Input name="department" required placeholder="e.g. Sales" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select name="status" defaultValue="active">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Create User</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Employee ID</th>
                  <th className="px-4 py-3 font-semibold">Full Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Department</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.employeeId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-600">{u.employeeId}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                    <td className="px-4 py-3 text-slate-500">{u.email}</td>
                    <td className="px-4 py-3">
                      {u.role === "admin" ? (
                        <Badge className="bg-blue-100 text-blue-800 border-none shadow-none"><Shield className="h-3 w-3 mr-1" /> Admin</Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-700 border-none shadow-none"><User className="h-3 w-3 mr-1" /> Manager</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{u.department}</td>
                    <td className="px-4 py-3">
                      {u.status === "active" ? (
                        <Badge className="bg-green-100 text-green-800 border-none shadow-none">Active</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 border-none shadow-none">Inactive</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600" title="Edit" onClick={() => { setEditingUser(u); setIsEditOpen(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-amber-600" title="Reset Password" onClick={() => handleResetPassword(u.email)}>
                          <Key className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600" title={u.status === 'active' ? 'Deactivate' : 'Activate'}>
                              {u.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{u.status === 'active' ? 'Deactivate User' : 'Activate User'}</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to {u.status === 'active' ? 'deactivate' : 'activate'} {u.name}? 
                                {u.status === 'active' ? ' They will lose access to the system.' : ' They will regain access to the system.'}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className={u.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} 
                                onClick={() => handleToggleStatus(u)}
                              >
                                {u.status === 'active' ? 'Deactivate' : 'Activate'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if(!open) setEditingUser(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employee ID</label>
                  <Input name="employeeId" required defaultValue={editingUser.employeeId} readOnly className="bg-slate-50 text-slate-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input name="name" required defaultValue={editingUser.name} />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input name="email" type="email" required defaultValue={editingUser.email} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select name="role" defaultValue={editingUser.role}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="relationship_manager">Relationship Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Input name="department" required defaultValue={editingUser.department} />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select name="status" defaultValue={editingUser.status}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setIsEditOpen(false); setEditingUser(null); }}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
