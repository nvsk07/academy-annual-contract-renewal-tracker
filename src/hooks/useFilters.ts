import { useState, useCallback } from "react";

export function useFilters<T extends Record<string, string>>(initialFilters: T) {
  const [filters, setFilters] = useState<T>(initialFilters);

  const setFilter = useCallback((key: keyof T, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const hasActiveFilters = Object.keys(initialFilters).some(
    key => filters[key as keyof T] !== initialFilters[key as keyof T]
  );

  return { filters, setFilter, clearFilters, hasActiveFilters };
}
