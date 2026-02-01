/**
 * Format a grocery item for display (supports string or { amount, item }).
 */
export function formatGroceryItemLabel(
  item: string | { amount?: string; item?: string }
): string {
  if (typeof item === "string") return item;
  const amount = item.amount ? `${item.amount} ` : "";
  return `${amount}${item.item || ""}`.trim();
}
