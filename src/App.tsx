import React, { useState, useEffect } from "react";
import Chat from "./components/Chat";
import PDFPreviewer from "./components/PdfPreviewer";
import { Box } from "@mui/material";
import DragAndDropInput from "./components/DragandDropInput";
import axios from "axios";
import yieldmate from "./YieldMate_logo.png";
import { Results } from "./components/results/Results";
import {
  CalculationProvider,
  useCalculation,
} from "./contexts/CalculationContext";

const AppContent = () => {
  const { calculationData } = useCalculation();
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [assistant, setAssistant] = useState<any>(null);
  const [thread, setThread] = useState<any>(null);
  const [chatStarted, setChatStarted] = useState<boolean>(false);

  // Check if context contains data
  const hasCalculationData = calculationData !== null;

  // Trigger animation when calculation data is available
  useEffect(() => {
    if (calculationData && !chatStarted) {
      setChatStarted(true);
    }
  }, [calculationData, chatStarted]);

  const initChatBot = async (file: File) => {
    if (!file) {
      return;
    }
    setFileName(file.name);
    setIsWaiting(true);
    const formData = new FormData();
    formData.append("file", file!);

    axios
      .post("http://localhost:8080/initAssistant", formData)
      .then((response: any) => {
        setAssistant((response.data! as any).assistant!);
        setThread((response.data! as any).thread);
        setIsWaiting(false);
      });
  };
  return (
    <Box className="App">
      <Box component="header" className="App-header">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              style={{ textAlign: "center" }}
              sx={{ fontSize: "40px", display: "flex", alignItems: "center" }}
            >
              <Box
                component="img"
                style={{
                  width: "10rem",
                  height: "8rem",
                  marginLeft: "-10px",
                  marginRight: "-15px",
                  zIndex: -1,
                }}
                src={yieldmate}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        component="main"
        className="main-container"
        style={{ height: "81vh" }}
      >
        <Box className="content-container" style={{ height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              sx={{
                width: hasCalculationData ? "70%" : "0%",
                overflow: "auto",
                opacity: hasCalculationData ? 1 : 0,
                transition: "width 0.8s ease-in-out, opacity 0.8s ease-in-out",
              }}
            >
              <Results />
            </Box>
            <Box
              sx={{
                height: "100%",
                width: hasCalculationData ? "30%" : "100%",
                borderLeft: hasCalculationData ? "1px solid #ccc" : "none",
                transition:
                  "width 0.8s ease-in-out, border-left 0.8s ease-in-out",
              }}
            >
              <Chat
                isWaiting={isWaiting}
                setIsWaiting={setIsWaiting}
                assistant={assistant}
                thread={thread}
                onChatStart={() => setChatStarted(true)}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const App = () => {
  return (
    <CalculationProvider>
      <AppContent />
    </CalculationProvider>
  );
};

export default App;
