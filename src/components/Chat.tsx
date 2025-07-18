// src/components/Chat.tsx
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  LinearProgress,
} from "@mui/material";
import Message from "./Message";
import { MessageDto } from "../models/MessageDto";
import axios from "axios";
import DragAndDropInput from "./DragandDropInput";
import { useCalculation } from "../contexts/CalculationContext";
import { CalculationResults } from "./results/CalcultationResults";

const Chat = ({
  isWaiting,
  setIsWaiting,
  assistant,
  thread,
  onChatStart,
}: {
  isWaiting: boolean;
  setIsWaiting: (isWaiting: boolean) => void;
  assistant: any;
  thread: any;
  onChatStart?: () => void;
}) => {
  const [messages, setMessages] = useState<Array<MessageDto>>(
    new Array<MessageDto>()
  );
  const [input, setInput] = useState<string>("");
  const { setCalculationData, setIsLoading } = useCalculation();

  useEffect(() => {
    setMessages([
      {
        content:
          "*G'day! I’m your AI property scout.*\n\n**Punch in an address**, and I’ll crunch the rent, yield, growth, vacancy — all that tricky stuff — and tell you if it’s worth it.",
        isUser: false,
      },
    ]);
  }, [assistant]);

  const createNewMessage = (content: string, isUser: boolean) => {
    const newMessage = new MessageDto(isUser, content);
    return newMessage;
  };

  const transformApiResponseToCalculationResults = (
    apiResponse: any
  ): CalculationResults => {
    // Transform the API response into CalculationResults format
    // This is a placeholder - adjust based on your actual API response structure
    return {
      id: apiResponse.id || 1,
      propertyAddress:
        apiResponse.propertyAddress || apiResponse.address || "Unknown Address",
      propertyType:
        apiResponse.propertyType || apiResponse.type || "Unknown Type",
      bedrooms: apiResponse.bedrooms || 0,
      bathrooms: apiResponse.bathrooms || 0,
      suburb: apiResponse.suburb || "Unknown Suburb",
      postcode: apiResponse.postcode || "0000",

      // Results
      rentalYield: apiResponse.rentalYield || apiResponse.yield,
      mortgageRepayment:
        apiResponse.mortgageRepayment || apiResponse.monthlyMortgage,
      cashFlow: apiResponse.cashFlow || apiResponse.monthlyCashFlow,
      roi: apiResponse.roi || apiResponse.returnOnInvestment,
      breakEven: apiResponse.breakEven || false,
      projectedValue5yr:
        apiResponse.projectedValue5yr || apiResponse.fiveYearValue,
      projectedValue10yr:
        apiResponse.projectedValue10yr || apiResponse.tenYearValue,

      // Input data
      inputData: {
        price: apiResponse.price || apiResponse.purchasePrice,
        weeklyRent: apiResponse.weeklyRent || apiResponse.rent,
        annualRent:
          apiResponse.annualRent ||
          (apiResponse.weeklyRent || apiResponse.rent) * 52,
        deposit: apiResponse.deposit,
        loanAmount: apiResponse.loanAmount,
        interestRate: apiResponse.interestRate,
        loanTerm: apiResponse.loanTerm || 30,
        councilRate: apiResponse.councilRate || apiResponse.councilRates,
        waterRate: apiResponse.waterRate || apiResponse.waterRates,
        strata: apiResponse.strata || apiResponse.bodyCorp,
        insuranceEstimate:
          apiResponse.insuranceEstimate || apiResponse.insurance,
        maintenanceCost: apiResponse.maintenanceCost || apiResponse.maintenance,
        stampDuty: apiResponse.stampDuty,
        purchaseCosts: apiResponse.purchaseCosts,
        historicalGrowth:
          apiResponse.historicalGrowth || apiResponse.growthRate,
        bank: apiResponse.bank || "Unknown Bank",
      },
    };
  };

  const handleSendMessage = async () => {
    // Trigger animation when first message is sent
    if (onChatStart) {
      onChatStart();
    }

    messages.push(createNewMessage(input, true));
    setMessages([...messages]);
    const userInput = input;
    setInput("");
    setIsWaiting(true);
    setIsLoading(true);

    try {
      // Use fetch with no headers to avoid CORS preflight
      const response = await fetch(
        "https://cc39darcy2.execute-api.ap-southeast-2.amazonaws.com/evaluate",
        {
          method: "POST",
          body: JSON.stringify({
            chatHistory: [...messages.map((msg) => msg.content)],
          }),
        }
      );

      const apiData = await response.json();

      console.log("API Response:", apiData);
      console.log("Missing Data:", apiData.extractedData?.missingData);
      console.log(
        "Missing Data Length:",
        apiData.extractedData?.missingData?.length
      );

      // Only set context if response is 200 and missingData is empty
      if (
        response.status === 200 &&
        (!apiData.extractedData?.missingData ||
          apiData.extractedData.missingData.length === 0)
      ) {
        console.log("Setting calculation data...");

        // Use extractedData for property info and calculationResult for calculations
        const extractedData = apiData.extractedData || {};
        const calculationResult = apiData.calculationResult || {};

        // Map API response to CalculationResults format
        const calculationResults: CalculationResults = {
          id: 1,
          propertyAddress: extractedData.address || "Address not provided",
          propertyType: "Unknown", // Not provided in API response
          bedrooms: 0, // Not provided in API response
          bathrooms: 0, // Not provided in API response
          suburb: "Unknown", // Not provided in API response
          postcode: "0000", // Not provided in API response

          // Results - using calculationResult data
          rentalYield: calculationResult.rentalYield,
          mortgageRepayment: calculationResult.mortgageRepayment,
          cashFlow: undefined, // Calculate if needed
          roi: calculationResult.roi,
          breakEven: calculationResult.breakEven,
          projectedValue5yr: calculationResult.projectedValue5yr,
          projectedValue10yr: calculationResult.projectedValue10yr,

          // Input data from extractedData
          inputData: {
            price: extractedData.price,
            weeklyRent: extractedData.weeklyRentalIncome,
            annualRent: extractedData.weeklyRentalIncome
              ? extractedData.weeklyRentalIncome * 52
              : undefined,
            deposit: extractedData.deposit,
            loanAmount:
              extractedData.price && extractedData.deposit
                ? extractedData.price - extractedData.deposit
                : undefined,
            interestRate: extractedData.mortgageRate,
            loanTerm: 30, // Default
            councilRate: extractedData.councilRate,
            waterRate: extractedData.waterRate,
            strata: extractedData.strata,
            insuranceEstimate: extractedData.insuranceEstimate,
            maintenanceCost: undefined, // Not provided
            stampDuty: extractedData.stampDuty,
            purchaseCosts: undefined, // Not provided
            historicalGrowth: undefined, // Not provided
            bank: extractedData.bank,
          },
        };

        // Update context with the calculation results
        setCalculationData(calculationResults);
      }

      // Add the API message as assistant response
      const assistantMessage =
        apiData.extractedData?.message || "I've processed your request.";
      setMessages([...messages, createNewMessage(assistantMessage, false)]);
    } catch (error) {
      console.error("Error processing request:", error);
      setMessages([
        ...messages,
        createNewMessage(
          "Sorry, I encountered an error while processing your request. Please try again.",
          false
        ),
      ]);
    } finally {
      setIsWaiting(false);
      setIsLoading(false);
    }
  };

  // detect enter key and send message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column-reverse",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <Grid container direction="column" spacing={2} paddingBottom={5}>
        {messages.map((message, index) => (
          <Grid
            item
            alignSelf={message.isUser ? "flex-end" : "flex-start"}
            key={index}
          >
            <Message key={index} message={message} />
          </Grid>
        ))}
        <Grid item>
          <TextField
            label="Type your message"
            variant="outlined"
            disabled={isWaiting}
            fullWidth
            value={input}
            onChange={(e: any) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          {isWaiting && <LinearProgress color="inherit" />}
        </Grid>
        {!isWaiting && (
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              disabled={isWaiting}
            >
              Send
            </Button>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Chat;
