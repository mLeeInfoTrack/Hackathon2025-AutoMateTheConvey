// src/components/Message.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { MessageDto } from "../models/MessageDto";

interface MessageProps {
  message: MessageDto;
}

const Message = ({ message }: MessageProps) => {
  // Function to render text with bold formatting
  const renderFormattedText = (text: string) => {
    // Split by both **bold** and *italic* patterns
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // Double asterisk = bold
        const boldText = part.slice(2, -2);
        return (
          <Typography key={index} component="span" sx={{ fontWeight: "bold" }}>
            {boldText}
          </Typography>
        );
      } else if (
        part.startsWith("*") &&
        part.endsWith("*") &&
        !part.startsWith("**")
      ) {
        // Single asterisk = italic
        const italicText = part.slice(1, -1);
        return (
          <Typography key={index} component="span" sx={{ fontStyle: "italic" }}>
            {italicText}
          </Typography>
        );
      }
      return part;
    });
  };

  return (
    <Box sx={{ textAlign: message.isUser ? "right" : "left", margin: "8px" }}>
      <Box
        sx={{
          color: message.isUser ? "#ffffff" : "#000000",
          backgroundColor: message.isUser ? "#1186fe" : "#eaeaea",
          padding: "15px",
          borderRadius: "8px",
          display: "inline-block",
        }}
      >
        {message.content.split("\n").map((text, index) => (
          <Box key={index}>
            {renderFormattedText(text)}
            {index < message.content.split("\n").length - 1 && (
              <Box component="br" />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Message;
