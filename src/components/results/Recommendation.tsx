import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Info,
  TrendingUp,
  Assignment,
  Schedule
} from '@material-ui/icons';

interface RecommendationItem {
  id: string;
  category: 'proceed' | 'caution' | 'investigate' | 'action';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeline?: string;
}

const recommendationData: RecommendationItem[] = [
  {
    id: 'flood-insurance',
    category: 'action',
    title: 'Obtain Comprehensive Flood Insurance',
    description: 'Given the high flood risk rating, securing adequate flood insurance is essential before settlement.',
    priority: 'high',
    timeline: 'Before settlement'
  },
  {
    id: 'building-inspection',
    category: 'investigate',
    title: 'Commission Detailed Building Inspection',
    description: 'Recommend professional building inspection focusing on bushfire compliance and structural integrity.',
    priority: 'high',
    timeline: '7-10 days'
  },
  {
    id: 'council-approvals',
    category: 'investigate',
    title: 'Verify Council Approvals',
    description: 'Check all building approvals and compliance certificates are current and valid.',
    priority: 'medium',
    timeline: '5-7 days'
  },
  {
    id: 'infrastructure-impact',
    category: 'caution',
    title: 'Monitor Infrastructure Development',
    description: 'Planned road works may temporarily affect property access. Consider timing of settlement.',
    priority: 'medium',
    timeline: 'Ongoing monitoring'
  },
  {
    id: 'proceed-purchase',
    category: 'proceed',
    title: 'Proceed with Purchase',
    description: 'Property shows strong fundamentals. Low landslip risk and good geological stability support the investment.',
    priority: 'low',
    timeline: 'As planned'
  }
];

const overallRecommendation = {
  decision: 'Proceed with Caution',
  confidence: 75,
  summary: 'This property presents a viable investment opportunity with manageable risks. The key concerns around flood risk can be mitigated through appropriate insurance and due diligence.',
  keyFactors: [
    'Strong property fundamentals and location',
    'Manageable risk profile with proper mitigation',
    'Good long-term investment potential',
    'Infrastructure improvements will add value'
  ]
};

const Recommendation: React.FC = () => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'proceed': return <CheckCircle style={{ color: '#4caf50' }} />;
      case 'caution': return <Warning style={{ color: '#ff9800' }} />;
      case 'investigate': return <Info style={{ color: '#2196f3' }} />;
      case 'action': return <Assignment style={{ color: '#f44336' }} />;
      default: return <Info style={{ color: '#757575' }} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'proceed': return '#4caf50';
      case 'caution': return '#ff9800';
      case 'investigate': return '#2196f3';
      case 'action': return '#f44336';
      default: return '#757575';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#4caf50';
    if (confidence >= 60) return '#ff9800';
    return '#f44336';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Our Recommendation
      </Typography>

      {/* Overall Recommendation Card */}
      <Card sx={{ mb: 3, border: `2px solid ${getConfidenceColor(overallRecommendation.confidence)}` }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center">
              <TrendingUp style={{ fontSize: 32, color: getConfidenceColor(overallRecommendation.confidence), marginRight: 16 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: getConfidenceColor(overallRecommendation.confidence) }}>
                  {overallRecommendation.decision}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Investment Recommendation
                </Typography>
              </Box>
            </Box>
            <Box textAlign="right">
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: getConfidenceColor(overallRecommendation.confidence) }}>
                {overallRecommendation.confidence}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Confidence Level
              </Typography>
            </Box>
          </Box>

          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Confidence Level
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={overallRecommendation.confidence} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getConfidenceColor(overallRecommendation.confidence)
                }
              }} 
            />
          </Box>

          <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
            {overallRecommendation.summary}
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
            Key Success Factors:
          </Typography>
          <List dense>
            {overallRecommendation.keyFactors.map((factor, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircle style={{ fontSize: 16, color: '#4caf50' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={factor} 
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Action Items & Recommendations
          </Typography>

          <Grid container spacing={2}>
            {recommendationData.map((item, index) => (
              <Grid item xs={12} key={item.id}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    borderLeft: `4px solid ${getCategoryColor(item.category)}`,
                    '&:hover': { boxShadow: 2 }
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                      <Box display="flex" alignItems="flex-start" flex={1}>
                        <Box sx={{ mr: 2, mt: 0.5 }}>
                          {getCategoryIcon(item.category)}
                        </Box>
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
                              {item.title}
                            </Typography>
                            <Chip 
                              label={item.priority.toUpperCase()} 
                              size="small" 
                              sx={{ 
                                backgroundColor: getPriorityColor(item.priority),
                                color: 'white',
                                fontSize: '0.7rem',
                                height: 20
                              }} 
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {item.description}
                          </Typography>
                          {item.timeline && (
                            <Box display="flex" alignItems="center">
                              <Schedule style={{ fontSize: 16, color: '#666', marginRight: 4 }} />
                              <Typography variant="caption" color="text.secondary">
                                Timeline: {item.timeline}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                      <Chip 
                        label={item.category.replace(/^\w/, c => c.toUpperCase())} 
                        variant="outlined"
                        size="small"
                        sx={{ 
                          borderColor: getCategoryColor(item.category),
                          color: getCategoryColor(item.category),
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
                {index < recommendationData.length - 1 && <Divider sx={{ my: 1 }} />}
              </Grid>
            ))}
          </Grid>

          {/* Summary Alert */}
          <Alert 
            severity="info" 
            sx={{ 
              mt: 3,
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              border: '1px solid rgba(33, 150, 243, 0.3)'
            }}
          >
            <Typography variant="body2">
              <strong>Next Steps:</strong> We recommend addressing high-priority action items first, 
              particularly flood insurance and building inspections. Our team is available to assist 
              with connecting you to recommended service providers and monitoring the settlement process.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Recommendation;