/**
 * useContracts — async hook that fetches contracts from Firestore
 * and applies search/filter logic on the client side.
 */
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  getVisibleContracts,
  subscribeVisibleContracts,
  ContractWithHealth,
} from "@/services/contractService";

export interface ContractFilters {
  search: string;
  status: string;
  healthStatus: string;
  relationshipManager: string;
  academyType: string;
}

const DEFAULT_FILTERS: ContractFilters = {
  search: "",
  status: "All",
  healthStatus: "All",
  relationshipManager: "All",
  academyType: "All",
};

export function useContracts() {
  const { user } = useAuth();
  const [allContracts, setAllContracts] = useState<ContractWithHealth[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ContractFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeVisibleContracts(
      user,
      (data) => {
        setAllContracts(data);
        setIsLoading(false);
      },
      (err) => {
        setError(err.message || "Failed to load contracts.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const load = () => {};

  const setFilter = <K extends keyof ContractFilters>(
    key: K,
    value: ContractFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  // Apply filters client-side
  const contracts = allContracts.filter((c) => {
    const searchLower = filters.search.toLowerCase();
    if (
      filters.search &&
      !c.academyName.toLowerCase().includes(searchLower) &&
      !c.id.toLowerCase().includes(searchLower) &&
      !c.relationshipManagerName.toLowerCase().includes(searchLower)
    ) {
      return false;
    }
    if (filters.status !== "All" && c.status !== filters.status) return false;
    if (filters.healthStatus !== "All" && c.healthStatus !== filters.healthStatus) return false;
    if (
      filters.relationshipManager !== "All" &&
      c.relationshipManagerName !== filters.relationshipManager
    )
      return false;
    if (filters.academyType !== "All" && c.academyType !== filters.academyType) return false;
    return true;
  });

  return {
    contracts,
    allContracts,
    filters,
    setFilter,
    clearFilters,
    reload: load,
    isLoading,
    error,
  };
}
