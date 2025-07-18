export interface CalculationResults {
  id: number;
  propertyAddress: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  suburb: string;
  postcode: string;

  // Results
  rentalYield?: number;
  mortgageRepayment?: number;
  cashFlow?: number;
  roi?: number;
  breakEven?: boolean;
  projectedValue5yr?: number;
  projectedValue10yr?: number;

  // Input data used in calculations (for showing working)
  inputData?: {
    price?: number;
    weeklyRent?: number;
    annualRent?: number;
    deposit?: number;
    loanAmount?: number;
    interestRate?: number;
    loanTerm?: number;
    councilRate?: number;
    waterRate?: number;
    strata?: number;
    insuranceEstimate?: number;
    maintenanceCost?: number;
    stampDuty?: number;
    purchaseCosts?: number;
    historicalGrowth?: number;
    bank?: string;
  };
}
