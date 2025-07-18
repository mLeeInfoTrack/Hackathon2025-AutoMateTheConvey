import React, { createContext, useContext, useState, ReactNode } from "react";
import { CalculationResults } from "../components/results/CalcultationResults";

interface CalculationContextType {
  calculationData: CalculationResults | null;
  setCalculationData: (data: CalculationResults | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const CalculationContext = createContext<CalculationContextType | undefined>(
  undefined
);

export const useCalculation = () => {
  const context = useContext(CalculationContext);
  if (context === undefined) {
    throw new Error("useCalculation must be used within a CalculationProvider");
  }
  return context;
};

interface CalculationProviderProps {
  children: ReactNode;
}

export const CalculationProvider = ({ children }: CalculationProviderProps) => {
  const [calculationData, setCalculationData] =
    useState<CalculationResults | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const value = {
    calculationData,
    setCalculationData,
    isLoading,
    setIsLoading,
  };

  return (
    <CalculationContext.Provider value={value}>
      {children}
    </CalculationContext.Provider>
  );
};
