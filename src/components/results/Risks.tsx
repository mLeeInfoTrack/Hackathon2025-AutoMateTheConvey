import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Alert,
  Button,
} from "@mui/material";
import {
  Pool,
  Whatshot,
  Landscape,
  Build,
  ZoomIn,
  ZoomOut,
  MyLocation,
} from "@material-ui/icons";
import { CalculationResults } from "./CalcultationResults";

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface RiskOverlay {
  id: string;
  title: string;
  level: "high" | "medium" | "low" | "info";
  description: string;
  icon: React.ReactNode;
  position: { top: string; left: string };
  coordinates: { lat: number; lng: number };
  details: string[];
}

const riskOverlays: RiskOverlay[] = [
  {
    id: "flood",
    title: "Flood Risk",
    level: "high",
    description: "High flood risk area - 1 in 100 year flood zone",
    icon: <Pool />,
    position: { top: "20%", left: "25%" },
    coordinates: { lat: -33.8708, lng: 151.2073 }, // Slightly north-west
    details: [
      "Property located in 1% annual flood risk zone",
      "Historical flooding recorded in 1998, 2011",
      "Recommended: Flood insurance required",
      "Council flood studies available",
    ],
  },
  {
    id: "bushfire",
    title: "Bushfire Risk",
    level: "medium",
    description: "Moderate bushfire risk - BAL-19 rating",
    icon: <Whatshot />,
    position: { top: "30%", left: "70%" },
    coordinates: { lat: -33.8668, lng: 151.2113 }, // Slightly south-east
    details: [
      "Bushfire Attack Level (BAL) rating: BAL-19",
      "Asset Protection Zone required: 20m",
      "Building standards: AS 3959-2018 compliance",
      "Fire danger period: October - April",
    ],
  },
  {
    id: "landslip",
    title: "Landslip Risk",
    level: "low",
    description: "Low landslip potential - stable geology",
    icon: <Landscape />,
    position: { top: "60%", left: "15%" },
    coordinates: { lat: -33.8698, lng: 151.2063 }, // Slightly south-west
    details: [
      "Geological stability: Low risk classification",
      "Slope analysis: < 5% gradient",
      "Soil type: Clay with good drainage",
      "No historical landslip events recorded",
    ],
  },
  {
    id: "infrastructure",
    title: "Infrastructure",
    level: "info",
    description: "Planned road works - temporary access impact",
    icon: <Build />,
    position: { top: "70%", left: "60%" },
    coordinates: { lat: -33.8678, lng: 151.2103 }, // Slightly north-east
    details: [
      "Planned road widening: 2025-2026",
      "Temporary access restrictions possible",
      "Utility upgrades included in project",
      "Property value impact: Positive long-term",
    ],
  },
];

interface RisksProps {
  propertyData?: CalculationResults;
}

const Risks = ({ propertyData }: RisksProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedOverlay, setSelectedOverlay] = useState<string | null>(null);
  const [previousOverlay, setPreviousOverlay] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [mapZoom, setMapZoom] = useState(14);
  const [mapCenter, setMapCenter] = useState({ lat: -33.8688, lng: 151.2093 });
  const [map, setMap] = useState<any>(null);

  // Extract property location from propertyData - need default for hooks
  const PROPERTY_LOCATION = {
    lat: -33.8688, // Default Sydney coordinates - could be enhanced with actual coordinates from API
    lng: 151.2093,
    name: propertyData
      ? `Property Location - ${propertyData.propertyAddress}`
      : "Loading...",
  };

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current || !window.google?.maps) return;

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: PROPERTY_LOCATION.lat, lng: PROPERTY_LOCATION.lng },
        zoom: 14,
        mapTypeId: "roadmap",
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#e9e9e9" }],
          },
        ],
      });

      setMap(mapInstance);

      // Add property location marker
      new window.google.maps.Marker({
        position: { lat: PROPERTY_LOCATION.lat, lng: PROPERTY_LOCATION.lng },
        map: mapInstance,
        title: "Property Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#1976d2",
          fillOpacity: 1,
          strokeColor: "white",
          strokeWeight: 3,
        },
      });

      // Add risk overlay markers
      riskOverlays.forEach((overlay) => {
        const marker = new window.google.maps.Marker({
          position: {
            lat: overlay.coordinates.lat,
            lng: overlay.coordinates.lng,
          },
          map: mapInstance,
          title: overlay.title,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 15,
            fillColor: getRiskColor(overlay.level),
            fillOpacity: 1,
            strokeColor: "white",
            strokeWeight: 2,
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px;">
              <h3 style="margin: 0 0 5px 0; color: ${getRiskColor(
                overlay.level
              )};">${overlay.title}</h3>
              <p style="margin: 0 0 5px 0;">${overlay.description}</p>
              <small style="color: #666;">Click marker on the interface for detailed information</small>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(mapInstance, marker);
          setSelectedOverlay(overlay.id);
        });
      });
    };

    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      // Load Google Maps API
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAr9OctT4i3GQ9YialqW1AZIJruc3iVWlE&callback=initMap`;
      script.async = true;
      script.defer = true;

      window.initMap = initializeMap;
      document.head.appendChild(script);
    }
  }, []); // Only run once on mount

  // Update map center and zoom when state changes
  useEffect(() => {
    if (map) {
      map.setCenter({ lat: mapCenter.lat, lng: mapCenter.lng });
      map.setZoom(mapZoom);
    }
  }, [map, mapCenter, mapZoom]);

  if (!propertyData) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Loading risk data...</Typography>
      </Box>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "#f44336";
      case "medium":
        return "#ff9800";
      case "low":
        return "#4caf50";
      case "info":
        return "#2196f3";
      default:
        return "#757575";
    }
  };

  const getRiskBackgroundColor = (level: string) => {
    switch (level) {
      case "high":
        return "rgba(244, 67, 54, 0.1)";
      case "medium":
        return "rgba(255, 152, 0, 0.1)";
      case "low":
        return "rgba(76, 175, 80, 0.1)";
      case "info":
        return "rgba(33, 150, 243, 0.1)";
      default:
        return "rgba(117, 117, 117, 0.1)";
    }
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(mapZoom + 1, 20);
    setMapZoom(newZoom);
    if (map) {
      map.setZoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(mapZoom - 1, 1);
    setMapZoom(newZoom);
    if (map) {
      map.setZoom(newZoom);
    }
  };

  const handleRecenter = () => {
    setMapCenter(PROPERTY_LOCATION);
    setMapZoom(14);
    if (map) {
      map.setCenter({ lat: PROPERTY_LOCATION.lat, lng: PROPERTY_LOCATION.lng });
      map.setZoom(14);
    }
  };

  const openInMaps = (
    location: { lat: number; lng: number },
    title: string
  ) => {
    // Open in Google Maps
    const url = `https://www.google.com/maps?q=${location.lat},${location.lng}&z=${mapZoom}`;
    window.open(url, "_blank");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
        Risk Assessment Map
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <Typography component="span" sx={{ fontWeight: "bold" }}>
            Google Maps Integration:
          </Typography>{" "}
          This map displays risk overlays for the property location using Google
          Maps. You'll need to add your Google Maps API key to see the map.
          Click on risk markers to view detailed information.
        </Typography>
      </Alert>

      {/* Google Maps Container */}
      <Box
        sx={{
          position: "relative",
          height: "500px",
          border: "2px solid #e0e0e0",
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* Google Maps will render here */}
        <Box
          ref={mapRef}
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        />

        {/* Loading/API Key Message */}
        {!map && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              zIndex: 1,
              backgroundColor: "rgba(255,255,255,0.95)",
              p: 3,
              borderRadius: 2,
              border: "2px solid #2196f3",
              maxWidth: 400,
            }}
          >
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: "bold", mb: 1 }}
            >
              🗺️ Google Maps Loading...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please add your Google Maps API key to display the interactive
              map.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Replace "YOUR_GOOGLE_MAPS_API_KEY" in the component with your
              actual API key.
            </Typography>
          </Box>
        )}

        {/* Map Controls */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <IconButton
            onClick={handleZoomIn}
            sx={{
              backgroundColor: "white",
              boxShadow: 2,
              "&:hover": { backgroundColor: "#f5f5f5" },
              width: 40,
              height: 40,
            }}
          >
            <ZoomIn />
          </IconButton>
          <IconButton
            onClick={handleZoomOut}
            sx={{
              backgroundColor: "white",
              boxShadow: 2,
              "&:hover": { backgroundColor: "#f5f5f5" },
              width: 40,
              height: 40,
            }}
          >
            <ZoomOut />
          </IconButton>
          <IconButton
            onClick={handleRecenter}
            sx={{
              backgroundColor: "white",
              boxShadow: 2,
              "&:hover": { backgroundColor: "#f5f5f5" },
              width: 40,
              height: 40,
            }}
          >
            <MyLocation />
          </IconButton>
        </Box>

        {/* Map Info Panel */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            backgroundColor: "white",
            p: 2,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            border: "1px solid #e0e0e0",
            zIndex: 1000,
            maxWidth: 280,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", mb: 1, color: "#1976d2" }}
          >
            📍 Property Location
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {propertyData.propertyAddress}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            Zoom: {mapZoom} | Lat: {mapCenter.lat.toFixed(4)}, Lng:{" "}
            {mapCenter.lng.toFixed(4)}
          </Typography>
          <Button
            size="small"
            variant="contained"
            startIcon={<MyLocation />}
            onClick={() => openInMaps(mapCenter, PROPERTY_LOCATION.name)}
            sx={{
              mt: 1,
              fontSize: "0.75rem",
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Open in Google Maps
          </Button>
        </Box>
      </Box>

      {/* Risk Details Panel */}
      <Box
        sx={{
          mt: 3,
          overflow: "hidden",
          maxHeight: selectedOverlay ? "1000px" : 0,
          opacity: isAnimating ? 0 : selectedOverlay ? 1 : 0,
          transition: isClosing
            ? "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease-in-out"
            : selectedOverlay
            ? "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out 0.1s"
            : "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease-in-out",
          transformOrigin: "top",
        }}
      >
        {(selectedOverlay || previousOverlay || isClosing) && (
          <Box>
            {riskOverlays
              .filter(
                (overlay) => overlay.id === (selectedOverlay || previousOverlay)
              )
              .map((overlay) => (
                <Card
                  key={overlay.id}
                  sx={{
                    backgroundColor: getRiskBackgroundColor(overlay.level),
                    border: `2px solid ${getRiskColor(overlay.level)}`,
                    transform: selectedOverlay
                      ? "translateY(0)"
                      : "translateY(-20px)",
                    transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box
                        sx={{
                          backgroundColor: getRiskColor(overlay.level),
                          color: "white",
                          borderRadius: "50%",
                          p: 1,
                          mr: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {overlay.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {overlay.title}
                        </Typography>
                        <Chip
                          label={overlay.level.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: getRiskColor(overlay.level),
                            color: "white",
                            fontSize: "0.7rem",
                          }}
                        />
                      </Box>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                      {overlay.description}
                    </Typography>

                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, fontWeight: "bold" }}
                    >
                      Detailed Information:
                    </Typography>

                    <Grid container spacing={1}>
                      {overlay.details.map((detail, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box display="flex" alignItems="flex-start">
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                backgroundColor: getRiskColor(overlay.level),
                                borderRadius: "50%",
                                mt: 1,
                                mr: 1,
                                flexShrink: 0,
                              }}
                            />
                            <Typography variant="body2">{detail}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    {/* View in Maps Button */}
                    <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<MyLocation />}
                        onClick={() =>
                          openInMaps(overlay.coordinates, overlay.title)
                        }
                        sx={{
                          borderColor: getRiskColor(overlay.level),
                          color: getRiskColor(overlay.level),
                          "&:hover": {
                            borderColor: getRiskColor(overlay.level),
                            backgroundColor: getRiskBackgroundColor(
                              overlay.level
                            ),
                          },
                        }}
                      >
                        View in Maps
                      </Button>
                      <Typography
                        variant="caption"
                        sx={{ alignSelf: "center", opacity: 0.7 }}
                      >
                        📍 {overlay.coordinates.lat.toFixed(4)},{" "}
                        {overlay.coordinates.lng.toFixed(4)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
          </Box>
        )}
      </Box>

      {/* Risk Summary Cards */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          Risk Summary
        </Typography>
        <Grid container spacing={2}>
          {riskOverlays.map((overlay) => (
            <Grid item xs={12} sm={6} md={3} key={overlay.id}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 3,
                  },
                  border:
                    selectedOverlay === overlay.id
                      ? `2px solid ${getRiskColor(overlay.level)}`
                      : "1px solid #e0e0e0",
                }}
                onClick={() => {
                  const newSelection =
                    selectedOverlay === overlay.id ? null : overlay.id;

                  if (
                    selectedOverlay &&
                    newSelection &&
                    selectedOverlay !== newSelection
                  ) {
                    // Switching between overlays - fade out then fade in
                    setIsAnimating(true);
                    setPreviousOverlay(selectedOverlay);
                    setTimeout(() => {
                      setSelectedOverlay(newSelection);
                      setIsAnimating(false);
                    }, 300);
                  } else if (selectedOverlay && !newSelection) {
                    // Closing current overlay - animate upward
                    setIsClosing(true);
                    setPreviousOverlay(selectedOverlay);
                    setSelectedOverlay(null);
                    setTimeout(() => {
                      setPreviousOverlay(null);
                      setIsClosing(false);
                    }, 400);
                  } else {
                    // Opening new overlay
                    setSelectedOverlay(newSelection);
                    setPreviousOverlay(null);
                  }
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: getRiskColor(overlay.level),
                      color: "white",
                      borderRadius: "50%",
                      p: 1,
                      mb: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {overlay.icon}
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mb: 0.5 }}
                  >
                    {overlay.title}
                  </Typography>
                  <Chip
                    label={overlay.level.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: getRiskColor(overlay.level),
                      color: "white",
                      fontSize: "0.7rem",
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Risks;
