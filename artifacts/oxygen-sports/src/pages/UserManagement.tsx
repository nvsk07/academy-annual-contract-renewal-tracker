import { useState } from "react";
import { Shield, Plus, Pencil, UserX, UserCheck, KeyRound, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { MOCK_USERS, MockUser, DEPARTMENTS } from "@/constants/appConstants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import Unauthorized from "@/pages/Unauthorized";

interface UserFormState {
  employeeId: string;
  name: string;
  email: string;
  role: "admin" | "relationship_manager";
  department: string;
  status: "active" | "inactive";
}

const emptyForm: UserFormState = {
  employeeId: "",
  name: "",
  email: "",
  role: "relationship_manager",
  department: DEPARTMENTS[0],
  status: "active",
};

function validateForm(form: UserFormState): string | null {
  if (!form.employeeId.trim()) return "Employee ID is required.";
  if (!form.name.trim()) return "Full name is required.";
  if (!form.email.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email address.";
  if (!form.department.trim()) return "Department is required.";
  return null;
}

interface UserFormProps {
  form: UserFormState;
  setField: <K extends keyof UserFormState>(key: K, value: UserFormState[K]) => void;
  error: string | null;
  isEdit: boolean;
}

function UserForm({ form, setField, error, isEdit }: UserFormProps) {
  return (
    <div className="space-y-4 py-2">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="employeeId">Employee ID</Label>
        <Input
          id="employeeId"
          placeholder="e.g. OXY-006"
          value={form.employeeId}
          onChange={e => setField("employeeId", e.target.value)}
          disabled={isEdit}
          data-testid="input-employeeId"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="Full name"
          value={form.name}
          onChange={e => setField("name", e.target.value)}
          data-testid="input-name"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@oxygensports.in"
          value={form.email}
          onChange={e => setField("email", e.target.value)}
          data-testid="input-email"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="role">Role</Label>
        <Select value={form.role} onValueChange={v => setField("role", v as "admin" | "relationship_manager")}>
          <SelectTrigger id="role" data-testid="select-role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="relationship_manager">Relationship Manager</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="department">Department</Label>
        <Select value={form.department} onValueChange={v => setField("department", v)}>
          <SelectTrigger id="department" data-testid="select-department">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DEPARTMENTS.map(d => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="status">Status</Label>
        <Select value={form.status} onValueChange={v => setField("status", v as "active" | "inactive")}>
          <SelectTrigger id="status" data-testid="select-status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default function UserManagement() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState<MockUser[]>([...MOCK_USERS]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  if (user?.role !== "admin") {
    return <Unauthorized />;
  }

  function openAdd() {
    setForm(emptyForm);
    setFormError(null);
    setAddDialogOpen(true);
  }

  function openEdit(u: MockUser) {
    setSelectedUser(u);
    setForm({ employeeId: u.employeeId, name: u.name, email: u.email, role: u.role, department: u.department, status: u.status });
    setFormError(null);
    setEditDialogOpen(true);
  }

  function openDeactivate(u: MockUser) {
    setSelectedUser(u);
    setDeactivateDialogOpen(true);
  }

  function handleAddSubmit() {
    const error = validateForm(form);
    if (error) { setFormError(error); return; }
    if (users.some(u => u.employeeId === form.employeeId.trim())) {
      setFormError("Employee ID already exists.");
      return;
    }
    const newUser: MockUser = {
      employeeId: form.employeeId.trim(),
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      department: form.department,
      status: form.status,
    };
    setUsers(prev => [...prev, newUser]);
    setAddDialogOpen(false);
    toast({ title: "User created", description: `${newUser.name} has been added successfully.` });
  }

  function handleEditSubmit() {
    if (!selectedUser) return;
    const error = validateForm(form);
    if (error) { setFormError(error); return; }
    setUsers(prev =>
      prev.map(u =>
        u.employeeId === selectedUser.employeeId
          ? { ...u, name: form.name.trim(), email: form.email.trim(), role: form.role, department: form.department, status: form.status }
          : u
      )
    );
    setEditDialogOpen(false);
    toast({ title: "User updated", description: `${form.name} has been updated.` });
  }

  function handleToggleStatus() {
    if (!selectedUser) return;
    const nextStatus = selectedUser.status === "active" ? "inactive" : "active";
    setUsers(prev =>
      prev.map(u => u.employeeId === selectedUser.employeeId ? { ...u, status: nextStatus } : u)
    );
    setDeactivateDialogOpen(false);
    toast({
      title: nextStatus === "inactive" ? "User deactivated" : "User activated",
      description: `${selectedUser.name} has been ${nextStatus === "inactive" ? "deactivated" : "reactivated"}.`,
    });
  }

  function handleResetPassword(u: MockUser) {
    toast({
      title: "Password reset",
      description: `A reset link would be sent to ${u.email} in a live system.`,
    });
  }

  function setField<K extends keyof UserFormState>(key: K, value: UserFormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
    setFormError(null);
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            User Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage Oxygen Sports employee accounts and access roles.
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2" data-testid="button-add-user">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-700">Employee ID</TableHead>
              <TableHead className="font-semibold text-slate-700">Full Name</TableHead>
              <TableHead className="font-semibold text-slate-700">Email</TableHead>
              <TableHead className="font-semibold text-slate-700">Role</TableHead>
              <TableHead className="font-semibold text-slate-700">Department</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(u => (
              <TableRow
                key={u.employeeId}
                className="hover:bg-slate-50 transition-colors"
                data-testid={`row-user-${u.employeeId}`}
              >
                <TableCell className="font-mono text-sm text-slate-600">{u.employeeId}</TableCell>
                <TableCell className="font-medium text-slate-900">{u.name}</TableCell>
                <TableCell className="text-slate-600 text-sm">{u.email}</TableCell>
                <TableCell>
                  {u.role === "admin" ? (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 gap-1 font-medium">
                      <Shield className="h-3 w-3" />
                      Admin
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 font-medium">
                      Relationship Manager
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-slate-600 text-sm">{u.department}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      u.status === "active"
                        ? "bg-green-100 text-green-800 hover:bg-green-100 font-medium"
                        : "bg-red-100 text-red-800 hover:bg-red-100 font-medium"
                    }
                  >
                    {u.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-primary hover:bg-blue-50"
                      onClick={() => openEdit(u)}
                      title="Edit user"
                      data-testid={`button-edit-${u.employeeId}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${u.status === "active" ? "text-slate-500 hover:text-red-600 hover:bg-red-50" : "text-slate-500 hover:text-green-600 hover:bg-green-50"}`}
                      onClick={() => openDeactivate(u)}
                      title={u.status === "active" ? "Deactivate user" : "Activate user"}
                      data-testid={`button-toggle-${u.employeeId}`}
                    >
                      {u.status === "active" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                      onClick={() => handleResetPassword(u)}
                      title="Reset password"
                      data-testid={`button-reset-${u.employeeId}`}
                    >
                      <KeyRound className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <UserForm form={form} setField={setField} error={formError} isEdit={false} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSubmit} data-testid="button-submit-add-user">Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <UserForm form={form} setField={setField} error={formError} isEdit />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit} data-testid="button-submit-edit-user">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate / Activate Confirmation */}
      <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.status === "active" ? "Deactivate User" : "Activate User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.status === "active"
                ? `Are you sure you want to deactivate ${selectedUser?.name}? They will immediately lose access to the system.`
                : `Reactivate ${selectedUser?.name}? They will regain access to the system.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              className={
                selectedUser?.status === "active"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {selectedUser?.status === "active" ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
