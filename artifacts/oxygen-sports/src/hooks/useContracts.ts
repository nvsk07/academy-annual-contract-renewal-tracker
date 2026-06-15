import { useState, useMemo } from "react";
import { getVisibleContracts, ContractWithHealth } from "@/services/contractService";
import { useAuth } from "@/hooks/useAuth";

export interface FilterState {
  search: string;
  status: string;
  academyType: string;
  relationshipManager: string;
  healthStatus: string;
  expiryPeriod: string;
}

export function useContracts() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "All",
    academyType: "All",
    relationshipManager: "All",
    healthStatus: "All",
    expiryPeriod: "All"
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const allContracts = useMemo(() => getVisibleContracts(user), [user]);

  const setFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "All",
      academyType: "All",
      relationshipManager: "All",
      healthStatus: "All",
      expiryPeriod: "All"
    });
  };

  const contracts = useMemo(() => {
    return allContracts.filter(c => {
      const matchesSearch = c.academyName.toLowerCase().includes(filters.search.toLowerCase()) || 
                            c.id.toLowerCase().includes(filters.search.toLowerCase()) ||
                            c.relationshipManager.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === "All" || c.status === filters.status;
      const matchesHealth = filters.healthStatus === "All" || c.healthStatus === filters.healthStatus;
      const matchesRM = filters.relationshipManager === "All" || c.relationshipManager === filters.relationshipManager;
      const matchesType = filters.academyType === "All" || c.academyType === filters.academyType;
      
      return matchesSearch && matchesStatus && matchesHealth && matchesRM && matchesType;
    });
  }, [allContracts, filters]);

  return { contracts, allContracts, filters, setFilter, clearFilters, isLoading };
}
