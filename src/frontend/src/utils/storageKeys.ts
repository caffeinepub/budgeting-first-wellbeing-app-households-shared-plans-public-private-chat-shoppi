export function getBudgetEntriesKey(principalId: string): string {
  return `budget_entries_${principalId}`;
}

export function clearUserStorage(principalId: string): void {
  const key = getBudgetEntriesKey(principalId);
  localStorage.removeItem(key);
}
