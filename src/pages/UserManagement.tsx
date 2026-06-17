import { useState, useEffect } from "react";
import { Shield, Plus, Pencil, UserX, UserCheck, KeyRound, Users, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  getAllUsers,
  adminUpdateUser,
  adminToggleUserStatus,
  adminResetUserPassword,
  adminCreateFirestoreUser,
  adminCreateAuthUser,
  AuthUser,
} from "@/services/authService";
import { DEPARTMENTS } from "@/constants/appConstants";
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
  tempPassword: string;
}

const emptyForm: UserFormState = {
  employeeId: "",
  name: "",
  email: "",
  role: "relationship_manager",
  department: DEPARTMENTS[0],
  tempPassword: "Welcome@123",
};

function validateForm(form: UserFormState): string | null {
  if (!form.employeeId.trim()) return "Employee ID is required.";
  if (!/^[a-zA-Z0-9-]+$/.test(form.employeeId.trim()))
    return "Employee ID must contain only alphanumeric characters and hyphens.";
  if (!form.name.trim()) return "Full name is required.";
  if (!form.email.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    return "Enter a valid email address.";
  if (!form.department.trim()) return "Department is required.";
  if (!form.tempPassword || form.tempPassword.length < 8)
    return "Temporary password must be at least 8 characters.";
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
          placeholder="e.g. RM004"
          value={form.employeeId}
          onChange={(e) => setField("employeeId", e.target.value)}
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
          onChange={(e) => setField("name", e.target.value)}
          data-testid="input-name"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@oxygensports.com"
          value={form.email}
          onChange={(e) => setField("email", e.target.value)}
          disabled={isEdit}
          data-testid="input-email"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="role">Role</Label>
        <Select
          value={form.role}
          onValueChange={(v) => setField("role", v as "admin" | "relationship_manager")}
        >
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
        <Select value={form.department} onValueChange={(v) => setField("department", v)}>
          <SelectTrigger id="department" data-testid="select-department">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DEPARTMENTS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {!isEdit && (
        <div className="space-y-1.5">
          <Label htmlFor="tempPassword">Temporary Password</Label>
          <Input
            id="tempPassword"
            type="text"
            placeholder="Temporary password (min 8 chars)"
            value={form.tempPassword}
            onChange={(e) => setField("tempPassword", e.target.value)}
            data-testid="input-tempPassword"
          />
          <p className="text-xs text-slate-500">
            User will receive this password and must change it on first login.
          </p>
        </div>
      )}
    </div>
  );
}



export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState<AuthUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load users from Firestore
  const reloadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const all = await getAllUsers();
      setUsers(all);
    } catch (err: any) {
      toast({
        title: "Error loading users",
        description: err.message || "Failed to load users.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "admin") {
      reloadUsers();
    }
  }, [currentUser]);

  if (currentUser?.role !== "admin") {
    return <Unauthorized />;
  }

  function openAdd() {
    setForm(emptyForm);
    setFormError(null);
    setAddDialogOpen(true);
  }

  function openEdit(u: AuthUser) {
    setSelectedUser(u);
    setForm({
      employeeId: u.employeeId,
      name: u.name,
      email: u.email,
      role: u.role,
      department: u.department,
      tempPassword: "",
    });
    setFormError(null);
    setEditDialogOpen(true);
  }

  function openDeactivate(u: AuthUser) {
    setSelectedUser(u);
    setDeactivateDialogOpen(true);
  }

  async function handleAddSubmit() {
    const error = validateForm(form);
    if (error) {
      setFormError(error);
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Create Firebase Auth account client-side
      const uid = await adminCreateAuthUser(
        form.email.trim().toLowerCase(),
        form.tempPassword
      );

      // Step 2: Create Firestore user document
      await adminCreateFirestoreUser(uid, {
        employeeId: form.employeeId.trim(),
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role,
        department: form.department,
      });

      await reloadUsers();
      setAddDialogOpen(false);
      toast({
        title: "User Created Successfully",
        description: `${form.name} added. They can log in with email: ${form.email} and temporary password: ${form.tempPassword}`,
      });
    } catch (err: any) {
      setFormError(err.message || "Failed to create user.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEditSubmit() {
    if (!selectedUser) return;
    const error = validateForm({ ...form, tempPassword: "placeholder" }); // skip password check for edit
    if (error && !error.includes("password")) {
      setFormError(error);
      return;
    }

    setIsSubmitting(true);
    try {
      await adminUpdateUser(selectedUser.uid, {
        name: form.name.trim(),
        role: form.role,
        department: form.department,
      });

      await reloadUsers();
      setEditDialogOpen(false);
      toast({ title: "User Updated", description: `${form.name} profile has been updated.` });
    } catch (err: any) {
      setFormError(err.message || "Failed to update user.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggleStatus() {
    if (!selectedUser || !currentUser) return;

    // Don't allow admins to deactivate themselves
    if (selectedUser.uid === currentUser.uid) {
      toast({
        title: "Action Restricted",
        description: "You cannot deactivate your own administrator account.",
        variant: "destructive",
      });
      setDeactivateDialogOpen(false);
      return;
    }

    try {
      const nextStatus = await adminToggleUserStatus(selectedUser.uid, selectedUser.status);
      await reloadUsers();
      setDeactivateDialogOpen(false);
      toast({
        title: nextStatus === "inactive" ? "User Deactivated" : "User Reactivated",
        description: `${selectedUser.name} has been ${nextStatus === "inactive" ? "deactivated" : "reactivated"}.`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to toggle status.",
        variant: "destructive",
      });
    }
  }

  async function handleResetPassword(u: AuthUser) {
    try {
      await adminResetUserPassword(u.uid);
      toast({
        title: "Password Reset Flag Set",
        description: `${u.name} will be required to change their password on next login. Use Firebase Console to send a password reset email.`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to reset password.",
        variant: "destructive",
      });
    }
  }

  function setField<K extends keyof UserFormState>(key: K, value: UserFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormError(null);
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            User Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage Oxygen Sports employee accounts, access roles, and status.
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 gap-2 w-full sm:w-auto"
          data-testid="button-add-user"
        >
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {isLoadingUsers ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-slate-500 text-sm">Loading users...</p>
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Users className="h-12 w-12 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-700">No Users Found</h3>
          <p className="text-slate-500 text-sm">Add the first user to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-200">
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
                {users.map((u) => (
                  <TableRow
                    key={u.uid}
                    className="hover:bg-slate-50/50 transition-colors"
                    data-testid={`row-user-${u.employeeId}`}
                  >
                    <TableCell className="font-mono text-sm text-slate-600 font-semibold">
                      {u.employeeId}
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">{u.name}</TableCell>
                    <TableCell className="text-slate-600 text-sm">{u.email}</TableCell>
                    <TableCell>
                      {u.role === "admin" ? (
                        <Badge className="bg-blue-50 text-blue-700 border-none shadow-none gap-1 font-semibold">
                          <Shield className="h-3 w-3" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-700 border-none shadow-none font-semibold">
                          Relationship Manager
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">{u.department}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          u.status === "active"
                            ? "bg-green-50 text-green-700 border-none shadow-none font-semibold"
                            : "bg-red-50 text-red-700 border-none shadow-none font-semibold"
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
                          className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => openEdit(u)}
                          title="Edit user"
                          data-testid={`button-edit-${u.employeeId}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${
                            u.status === "active"
                              ? "text-slate-500 hover:text-red-600 hover:bg-red-50"
                              : "text-slate-500 hover:text-green-600 hover:bg-green-50"
                          }`}
                          onClick={() => openDeactivate(u)}
                          title={u.status === "active" ? "Deactivate user" : "Activate user"}
                          data-testid={`button-toggle-${u.employeeId}`}
                        >
                          {u.status === "active" ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                          onClick={() => handleResetPassword(u)}
                          title="Mark for password reset"
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
        </div>
      )}

      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Add New User</DialogTitle>
          </DialogHeader>
          <UserForm form={form} setField={setField} error={formError} isEdit={false} />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddSubmit}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
              data-testid="button-submit-add-user"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Edit User Details</DialogTitle>
          </DialogHeader>
          <UserForm form={form} setField={setField} error={formError} isEdit />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
              data-testid="button-submit-edit-user"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate / Activate Confirmation */}
      <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <AlertDialogContent className="bg-white rounded-xl border border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">
              {selectedUser?.status === "active" ? "Deactivate User" : "Activate User"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              {selectedUser?.status === "active"
                ? `Are you sure you want to deactivate ${selectedUser?.name}? They will immediately lose access to the system.`
                : `Reactivate ${selectedUser?.name}? They will immediately regain login access to the system.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="border-slate-200 hover:bg-slate-50">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              className={
                selectedUser?.status === "active"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
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
