import React from "react";
import { Line } from "react-chartjs-2";
import { CalculationResults } from "./CalcultationResults";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

interface PropertyPriceProps {
  propertyData?: CalculationResults;
}

const PropertyPrice = ({ propertyData }: PropertyPriceProps) => {
  if (!propertyData) {
    return <div>Loading property data...</div>;
  }

  // Generate historical and projected price data
  const currentPrice = propertyData.inputData?.price || 0;
  const growthRate = (propertyData.inputData?.historicalGrowth || 3) / 100;

  // Create 10 years of data (5 years historical + current + 5 years projected)
  const years = [];
  const prices = [];

  for (let i = -5; i <= 5; i++) {
    const year = new Date().getFullYear() + i;
    years.push(year.toString());

    if (i <= 0) {
      // Historical and current prices
      prices.push(currentPrice * Math.pow(1 + growthRate, i));
    } else if (i === 5) {
      // Use the calculated 5-year projection
      prices.push(
        propertyData.projectedValue5yr ||
          currentPrice * Math.pow(1 + growthRate, i)
      );
    } else {
      // Other future years
      prices.push(currentPrice * Math.pow(1 + growthRate, i));
    }
  }

  return (
    <div>
      <h2>Property Price Trends - {propertyData.propertyAddress}</h2>
      <Line
        data={{
          labels: years,
          datasets: [
            {
              label: "Property Value ($)",
              data: prices,
              fill: false,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              tension: 0.1,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top" as const,
            },
            tooltip: {
              callbacks: {
                label: function (context: any) {
                  return `$${context.parsed.y.toLocaleString()}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: false,
              ticks: {
                callback: function (value: any) {
                  return "$" + Number(value).toLocaleString();
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default PropertyPrice;
