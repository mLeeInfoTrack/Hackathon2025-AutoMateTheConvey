import React from "react";
import { CalculationResults } from "./CalcultationResults";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

interface RentalYieldProps {
  propertyData?: CalculationResults;
}

const RentalYield = ({ propertyData }: RentalYieldProps) => {
  if (!propertyData) {
    return <div>Loading rental yield data...</div>;
  }

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "N/A";
    return `$${value.toLocaleString()}`;
  };

  const formatPercentage = (value: number | undefined) => {
    if (value === undefined) return "N/A";
    return `${value.toFixed(2)}%`;
  };

  const getYieldColor = (yieldValue: number | undefined) => {
    if (!yieldValue) return "default";
    if (yieldValue >= 5) return "success";
    if (yieldValue >= 3) return "warning";
    return "error";
  };

  const getCashFlowColor = (cashFlow: number | undefined) => {
    if (!cashFlow) return "default";
    return cashFlow >= 0 ? "success" : "error";
  };

  const calculateMonthlyCashFlow = () => {
    const monthlyRent = (propertyData.inputData?.weeklyRent || 0) * 52 / 12;
    const monthlyMortgage = propertyData.mortgageRepayment || 0;
    const monthlyCouncilRates = (propertyData.inputData?.councilRate || 0) / 12;
    const monthlyWaterRates = (propertyData.inputData?.waterRate || 0) / 12;
    const monthlyStrata = (propertyData.inputData?.strata || 0) / 12;
    const monthlyInsurance = (propertyData.inputData?.insuranceEstimate || 0) / 12;
    
    const monthlyCashFlow = monthlyRent - monthlyMortgage - monthlyCouncilRates - monthlyWaterRates - monthlyStrata - monthlyInsurance;
    return monthlyCashFlow;
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Rental Yield Analysis - {propertyData.propertyAddress}
      </Typography>

      {/* Key Metrics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Rental Yield
              </Typography>
              <Typography variant="h5">
                {formatPercentage(propertyData.rentalYield)}
              </Typography>
              <Chip
                label={
                  propertyData.rentalYield && propertyData.rentalYield >= 4
                    ? "Good"
                    : "Low"
                }
                color={getYieldColor(propertyData.rentalYield)}
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Monthly Cash Flow
              </Typography>
              <Typography variant="h5">
                {formatCurrency(calculateMonthlyCashFlow())}
              </Typography>
              <Chip
                label={
                  calculateMonthlyCashFlow() >= 0
                    ? "Positive"
                    : "Negative"
                }
                color={getCashFlowColor(calculateMonthlyCashFlow())}
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                ROI
              </Typography>
              <Typography variant="h5">
                {formatPercentage(propertyData.roi)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Break Even
              </Typography>
              <Typography variant="h5">
                {propertyData.breakEven ? "Yes" : "No"}
              </Typography>
              <Chip
                label={propertyData.breakEven ? "Achieved" : "Not Achieved"}
                color={propertyData.breakEven ? "success" : "error"}
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Analysis Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Detail</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Property Details */}
            <TableRow>
              <TableCell rowSpan={4}>Property Details</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>{propertyData.propertyAddress}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>House</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bedrooms</TableCell>
              <TableCell>1</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bathrooms</TableCell>
              <TableCell>1</TableCell>
            </TableRow>

            {/* Income & Expenses */}
            <TableRow>
              <TableCell rowSpan={8}>Income & Expenses</TableCell>
              <TableCell>Purchase Price</TableCell>
              <TableCell>
                {formatCurrency(propertyData.inputData?.price)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Weekly Rent</TableCell>
              <TableCell>
                {formatCurrency(propertyData.inputData?.weeklyRent)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Annual Rent</TableCell>
              <TableCell>
                {formatCurrency(propertyData.inputData?.annualRent)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Monthly Mortgage</TableCell>
              <TableCell>
                {formatCurrency(propertyData.mortgageRepayment)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Council Rates</TableCell>
              <TableCell>
                {formatCurrency(propertyData.inputData?.councilRate)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Water Rates</TableCell>
              <TableCell>
                {formatCurrency(propertyData.inputData?.waterRate)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Strata/Body Corp</TableCell>
              <TableCell>
                {formatCurrency(propertyData.inputData?.strata)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Insurance</TableCell>
              <TableCell>
                {formatCurrency(propertyData.inputData?.insuranceEstimate)}
              </TableCell>
            </TableRow>

            {/* Projections */}
            <TableRow>
              <TableCell rowSpan={3}>Projections</TableCell>
              <TableCell>Historical Growth Rate</TableCell>
              <TableCell>
                {formatPercentage(propertyData.inputData?.historicalGrowth)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>5 Year Value</TableCell>
              <TableCell>
                {formatCurrency(propertyData.projectedValue5yr)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>10 Year Value</TableCell>
              <TableCell>
                {formatCurrency(propertyData.projectedValue10yr)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RentalYield;
