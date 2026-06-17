import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Save, RefreshCw, ArrowLeft } from "lucide-react";
import { ACADEMY_TYPES, EQUIPMENT_CATEGORIES, CONTRACT_STATUSES, SUPPLY_FREQUENCIES } from "@/constants/contractConstants";
import { DEPARTMENTS } from "@/constants/appConstants";
import { useAuth } from "@/hooks/useAuth";
import { getActiveRelationshipManagers } from "@/services/authService";
import { createContract, updateContract, getContractById } from "@/services/contractService";
import { WorkflowStage } from "@/data/contracts";

const formSchema = z.object({
  academyName: z.string().min(2, "Academy name is required"),
  academyType: z.string().min(1, "Academy type is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  
  contractId: z.string().optional(),
  contractStartDate: z.string().min(1, "Start date is required"),
  contractExpiryDate: z.string().min(1, "Expiry/End date is required"),
  status: z.string().min(1, "Status is required"),
  
  equipmentCategories: z.array(z.string()).min(1, "Select at least one category"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  supplyFrequency: z.string().min(1, "Supply frequency is required"),
  
  relationshipManagerId: z.string().min(1, "Relationship manager is required"),
  department: z.string(),
  notes: z.string().optional(),
  contractValue: z.coerce.number().min(0, "Contract value must be a positive number"),
  priceRevision: z.coerce.number().min(-100, "Price revision must be at least -100%").max(500, "Price revision must be at most 500%"),
});

export default function ContractNew() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const params = useParams<{ id?: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeRMs, setActiveRMs] = useState<any[]>([]);

  const isEditMode = !!params.id;

  // Load relationship managers from Firestore
  useEffect(() => {
    async function loadRMs() {
      try {
        const rms = await getActiveRelationshipManagers();
        setActiveRMs(rms);
      } catch (err) {
        console.error("Failed to load RMs:", err);
      }
    }
    loadRMs();
  }, []);

  // Default RM selection
  const defaultRM = user?.role === "relationship_manager" ? user.employeeId : "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      academyName: "",
      academyType: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      contractId: "",
      contractStartDate: new Date().toISOString().split('T')[0],
      contractExpiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      status: "Active",
      equipmentCategories: [],
      quantity: 1,
      supplyFrequency: "Monthly",
      relationshipManagerId: defaultRM,
      department: user?.department || "",
      notes: "",
      contractValue: 0,
      priceRevision: 0,
    },
  });

  // Load contract details if in Edit Mode
  useEffect(() => {
    if (isEditMode && params.id) {
      async function loadContract() {
        const contract = await getContractById(params.id!);
        if (!contract) {
          toast({
            title: "Contract Not Found",
            description: "The contract you are trying to edit does not exist.",
            variant: "destructive",
          });
          setLocation("/contracts");
          return;
        }

        // Role check: RMs can only edit their own contracts
        if (user?.role === "relationship_manager" && contract.relationshipManagerId !== user.employeeId) {
          toast({
            title: "Unauthorized Access",
            description: "You do not have permission to edit this contract.",
            variant: "destructive",
          });
          setLocation("/contracts");
          return;
        }

        // Populate form fields
        form.reset({
          academyName: contract.academyName,
          academyType: contract.academyType,
          contactPerson: contract.contactPerson,
          phone: contract.phone,
          email: contract.email,
          address: contract.address,
          city: contract.city,
          state: contract.state,
          contractId: contract.id,
          contractStartDate: contract.contractStartDate,
          contractExpiryDate: contract.contractEndDate,
          status: contract.status,
          equipmentCategories: contract.equipmentCategories,
          quantity: contract.quantity,
          supplyFrequency: contract.supplyFrequency,
          relationshipManagerId: contract.relationshipManagerId,
          department: contract.department,
          notes: contract.notes,
          contractValue: contract.contractValue || 0,
          priceRevision: contract.priceRevision || 0,
        });
      }
      loadContract();
    }
  }, [isEditMode, params.id, form, setLocation, user, toast]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    setIsSubmitting(true);

    async function save() {
      try {
        const assignedRM = activeRMs.find(rm => rm.employeeId === values.relationshipManagerId) ||
                          (user!.employeeId === values.relationshipManagerId ? user : null);
        
        const rmName = assignedRM ? assignedRM.name : values.relationshipManagerId;

        const start = new Date(values.contractStartDate);
        const end = new Date(values.contractExpiryDate);
        const durationMonths = Math.max(1, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));

        const payload = {
          academyName: values.academyName.trim(),
          academyType: values.academyType as any,
          contactPerson: values.contactPerson.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          address: values.address.trim(),
          city: values.city.trim(),
          state: values.state.trim(),
          contractStartDate: values.contractStartDate,
          contractEndDate: values.contractExpiryDate,
          durationMonths,
          status: values.status as any,
          equipmentCategories: values.equipmentCategories,
          quantity: Number(values.quantity),
          supplyFrequency: values.supplyFrequency as any,
          relationshipManagerId: values.relationshipManagerId,
          relationshipManagerName: rmName,
          department: values.department,
          notes: values.notes || "",
          contractValue: Number(values.contractValue),
          priceRevision: Number(values.priceRevision),
          workflowStage: (isEditMode ? form.getValues("status") === "Renewed" ? "renewed" : "active" : "created") as WorkflowStage
        };

        if (isEditMode && params.id) {
          await updateContract(params.id, payload, user!);
          toast({
            title: "Contract Updated Successfully",
            description: `${values.academyName} contract details have been updated.`,
          });
          setLocation(`/contracts/${params.id}`);
        } else {
          const created = await createContract(payload, user!);
          toast({
            title: "Contract Created Successfully",
            description: `New contract has been registered.`,
          });
          setLocation("/contracts");
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Failed to save contract.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
    save();
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-slate-900 border border-slate-200" onClick={() => setLocation(isEditMode ? `/contracts/${params.id}` : "/contracts")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isEditMode ? "Edit Contract" : "Renewal Entry"}
          </h1>
          <p className="text-slate-500 text-sm">
            {isEditMode ? `Modify contract information for ID ${params.id}` : "Draft a new contract or enter a renewal"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Section A: Academy Information */}
          <Card className="shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-base font-bold text-slate-800">Section A: Academy Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="academyName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Academy Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter academy name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="academyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academy Type*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ACADEMY_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person*</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. +91 98765 43210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address*</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Street Address*</FormLabel>
                    <FormControl>
                      <Input placeholder="Full address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City*</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State*</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section B: Contract Information */}
          <Card className="shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-base font-bold text-slate-800">Section B: Contract Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="contractId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract ID</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly disabled className="bg-slate-50 font-mono text-slate-500 font-bold" placeholder="Auto-generated on save" />
                    </FormControl>
                    <FormDescription>Unique contract identifier</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONTRACT_STATUSES.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contractStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contractExpiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>renewal dates*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contractValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Value (INR)*</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter financial value" {...field} />
                    </FormControl>
                    <FormDescription>Financial value (enforced but hidden from general detail displays)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priceRevision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>price revision*</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 5 for +5% or -2 for -2%" {...field} />
                    </FormControl>
                    <FormDescription>Percentage adjust for this renewal/contract period</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section C: Equipment Supply */}
          <Card className="shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-base font-bold text-slate-800">Section C: Equipment Supply</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <FormField
                control={form.control}
                name="equipmentCategories"
                render={() => (
                  <FormItem>
                    <div className="mb-3">
                      <FormLabel className="text-sm font-semibold">equipment categories*</FormLabel>
                      <FormDescription>Select categories covered by this renewal contract</FormDescription>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {EQUIPMENT_CATEGORIES.map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="equipmentCategories"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-slate-200 p-3 shadow-none hover:bg-slate-50"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-semibold text-sm cursor-pointer text-slate-700">
                                  {item}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Annual Quantity (approx)*</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supplyFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supply Frequency*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SUPPLY_FREQUENCIES.map(f => (
                            <SelectItem key={f} value={f}>{f}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section D: Relationship Management */}
          <Card className="shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-base font-bold text-slate-800">Section D: Relationship Management</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="relationshipManagerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>relationship manager*</FormLabel>
                      {user?.role === "relationship_manager" ? (
                        <FormControl>
                          <Input value={user.name} disabled className="bg-slate-100 text-slate-700 font-semibold border-slate-200" />
                        </FormControl>
                      ) : (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Assign manager" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {activeRMs.map(rm => (
                              <SelectItem key={rm.employeeId} value={rm.employeeId}>
                                {rm.name} ({rm.employeeId})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DEPARTMENTS.map(d => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter any special terms, conditions, or logistics notes..." 
                        className="resize-none h-24 bg-slate-50 focus:bg-white transition-colors"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 sticky bottom-6 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-sm z-10">
            <Button type="button" variant="outline" onClick={() => form.reset()} className="border-slate-200 hover:bg-slate-50">
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 font-semibold">
              {isSubmitting ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isEditMode ? "Save Changes" : "Save Contract"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
