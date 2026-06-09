import { Badge } from "@/components/ui/badge";
import { getHealthLabel, getHealthColor, getHealthStatus } from "@/data/contracts";

export default function HealthBadge({ daysRemaining }: { daysRemaining: number }) {
  const status = getHealthStatus(daysRemaining);
  const label = getHealthLabel(status);
  const colorClass = getHealthColor(status);
  
  return (
    <Badge className={`${colorClass} border-none shadow-none font-medium px-2 py-0.5 whitespace-nowrap`}>
      {label}
    </Badge>
  );
}