import React, { useState, useEffect } from "react";
import PropertyPrice from "./PropertyPrice";
import RentalYield from "./RentalYield";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useCalculation } from "../../contexts/CalculationContext";
import PartnerContact from "./PartnerContact";
import Risks from "./Risks";
import zIndex from "@mui/material/styles/zIndex";
import Recommendation from "./Recommendation";

export const Results = () => {
  const { calculationData, isLoading } = useCalculation();
  const [activeSection, setActiveSection] = useState("property-price");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const sections = [
    { id: "rental-yield", label: "Rental Yield" },
    { id: "property-price", label: "Property Price" },
    { id: "risks", label: "Risks" },
    { id: "recommendations", label: "Recommendations" },
    { id: "partner-contact", label: "Partners" },
  ];

  // Handle loading state transitions
  useEffect(() => {
    if (!isLoading && calculationData) {
      // Start fade out loading text
      setShowLoading(false);
      // After loading text fades out, show content with animation
      setTimeout(() => {
        setShowContent(true);
      }, 500); // Wait for loading fade out to complete
    } else if (isLoading) {
      setShowLoading(true);
      setShowContent(false);
    }
  }, [isLoading, calculationData]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setActiveSection(sectionId);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [calculationData]);

  if (isLoading || showLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            opacity: showLoading ? 1 : 0,
            transition: "opacity 0.5s ease-out",
          }}
        >
          Loading calculation results...
        </Typography>
      </Box>
    );
  }

  if (!calculationData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography variant="h6">
          No property data available. Please use the chat to analyze a property.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
      {/* Hover Navigation - Left Side */}
      <Box
        sx={{
          position: "fixed",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1000,
          //paddingBottom: "30%",
        }}
        onMouseEnter={() => setDrawerOpen(true)}
        onMouseLeave={() => setDrawerOpen(false)}
      >
        {/* Navigation Button */}
        <Box
          sx={{
            width: 40,
            height: 100,
            backgroundColor: "primary.main",
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
            fontSize: "12px",
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          NAV
        </Box>

        {/* Sliding Drawer */}
        <Paper
          elevation={6}
          sx={{
            position: "absolute",
            left: 40,
            top: 0,
            width: drawerOpen ? 160 : 0,
            height: sections.length * 32 + 16, // Dynamic height based on number of sections
            overflow: "hidden",
            transition: "width 0.3s ease-in-out",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: drawerOpen ? 1 : 0,
          }}
        >
          {sections.map((section, index) => (
            <Button
              key={section.id}
              size="small"
              variant={activeSection === section.id ? "contained" : "text"}
              onClick={() => scrollToSection(section.id)}
              sx={{
                mb: index < sections.length - 1 ? 0.5 : 0, // No margin on last item
                fontSize: "0.7rem",
                minHeight: 24,
                opacity: drawerOpen ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
                textTransform: "none", // Preserve original text casing
              }}
            >
              {section.label}
            </Button>
          ))}
        </Paper>
      </Box>

      {/* Content Sections */}
      <Box
        id="rental-yield"
        sx={{
          mb: 4,
          opacity: showContent ? 1 : 0,
          transform: showContent ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          transitionDelay: "0.1s",
        }}
      >
        <RentalYield propertyData={calculationData} />
      </Box>

      <Box
        id="property-price"
        sx={{
          mb: 4,
          opacity: showContent ? 1 : 0,
          transform: showContent ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          transitionDelay: "0.2s",
        }}
      >
        <PropertyPrice propertyData={calculationData} />
      </Box>

      <Box
        id="risks"
        sx={{
          mb: 4,
          opacity: showContent ? 1 : 0,
          transform: showContent ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          transitionDelay: "0.3s",
        }}
      >
        <Risks propertyData={calculationData} />
      </Box>

      <Box
        id="recommendations"
        sx={{
          mb: 4,
          opacity: showContent ? 1 : 0,
          transform: showContent ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          transitionDelay: "0.4s",
        }}
      >
        <Recommendation />
      </Box>

      <Box
        id="partner-contact"
        sx={{
          opacity: showContent ? 1 : 0,
          transform: showContent ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          transitionDelay: "0.5s",
        }}
      >
        <PartnerContact />
      </Box>
    </Box>
  );
};
