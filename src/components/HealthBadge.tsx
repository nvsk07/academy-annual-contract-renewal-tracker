import { Badge } from "@/components/ui/badge";
import { getHealthLabel, getHealthBadgeClasses } from "@/utils/contractUtils";

export default function HealthBadge({ daysRemaining }: { daysRemaining: number }) {
  const status = daysRemaining < 0 ? "expired" : daysRemaining < 7 ? "critical" : daysRemaining < 30 ? "high-risk" : daysRemaining < 90 ? "attention" : "healthy";
  const label = getHealthLabel(status);
  const colorClass = getHealthBadgeClasses(status);
  
  return (
    <Badge className={`${colorClass} border-none shadow-none font-medium px-2 py-0.5 whitespace-nowrap`}>
      {label}
    </Badge>
  );
}
