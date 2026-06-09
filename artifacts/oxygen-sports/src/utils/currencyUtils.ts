export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatRevisionPercent(previous: number, current: number): string {
  if (previous === 0) return "+0.0%";
  const diff = current - previous;
  const percent = (diff / previous) * 100;
  const sign = percent > 0 ? "+" : "";
  return `${sign}${percent.toFixed(1)}%`;
}

export function getRevisionDirection(previous: number, current: number): "increase" | "decrease" | "neutral" {
  if (current > previous) return "increase";
  if (current < previous) return "decrease";
  return "neutral";
}
