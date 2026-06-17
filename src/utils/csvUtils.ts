import { ContractWithHealth } from "@/services/contractService";
import { formatDate } from "@/utils/dateUtils";

/**
 * Triggers a browser download of a CSV file populated with the provided contracts list.
 */
export function exportContractsToCSV(contracts: ContractWithHealth[], filename: string = "contracts_report.csv") {
  const headers = [
    "Contract ID",
    "Academy Name",
    "Academy Type",
    "Contact Person",
    "Phone",
    "Email",
    "Address",
    "City",
    "State",
    "Start Date",
    "End Date",
    "Duration (Months)",
    "Contract Value (INR)",
    "Price Revision (%)",
    "Status",
    "Health Status",
    "Days Remaining",
    "Equipment Categories",
    "Quantity",
    "Supply Frequency",
    "Relationship Manager",
    "Department",
    "Logistics Notes"
  ];

  const csvRows = [headers.join(",")];

  for (const c of contracts) {
    const categories = c.equipmentCategories ? c.equipmentCategories.join(" | ") : "";
    const fields = [
      c.id,
      c.academyName,
      c.academyType,
      c.contactPerson,
      c.phone,
      c.email,
      c.address,
      c.city,
      c.state,
      c.contractStartDate,
      c.contractEndDate,
      c.durationMonths,
      c.contractValue,
      c.priceRevision || 0,
      c.status,
      c.healthStatus,
      c.daysRemaining < 0 ? "Expired" : c.daysRemaining,
      categories,
      c.quantity,
      c.supplyFrequency,
      c.relationshipManagerName,
      c.department,
      c.notes
    ];

    // Escape quotes and wrap each field in quotes to avoid breaking on commas
    const escapedFields = fields.map(f => {
      const val = f === undefined || f === null ? "" : String(f);
      const cleanVal = val.replace(/"/g, '""'); // CSV escapes double-quotes with another double-quote
      return `"${cleanVal}"`;
    });

    csvRows.push(escapedFields.join(","));
  }

  const csvContent = "\uFEFF" + csvRows.join("\n"); // Prepend UTF-8 BOM to display regional symbols correctly in Excel
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
