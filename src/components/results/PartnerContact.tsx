import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  Business,
  Star,
  StarBorder
} from '@material-ui/icons';

interface Contact {
  id: number;
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  specialty: string[];
  rating: number;
  avatar?: string;
}

// Sample contact data
const sampleContacts: Contact[] = [
    {
        id: 1,
        name: "Sarah Johnson",
        company: "Premier Legal Services",
        role: "Senior Conveyancer",
        email: "sarah.johnson@premierlegal.com",
        phone: "+61 2 9876 5432",
        location: "Sydney, NSW",
        specialty: ["Property Law", "Commercial Conveyancing"],
        rating: 5,
    },
    {
        id: 2,
        name: "Michael Chen",
        company: "Metro Property Solutions",
        role: "Licensed Conveyancer",
        email: "m.chen@metroproperty.com.au",
        phone: "+61 3 8765 4321",
        location: "Melbourne, VIC",
        specialty: ["Residential", "First Home Buyers"],
        rating: 4,
    }
];

const PartnerContact: React.FC = () => {
  const renderStarRating = (rating: number) => {
    return (
      <Box display="flex" alignItems="center">
        {[1, 2, 3, 4, 5].map((star) => (
          <IconButton key={star} size="small" disabled style={{ padding: 2 }}>
            {star <= rating ? (
              <Star style={{ fontSize: 16, color: '#ffd700' }} />
            ) : (
              <StarBorder style={{ fontSize: 16, color: '#ccc' }} />
            )}
          </IconButton>
        ))}
        <Typography variant="caption" style={{ marginLeft: 8 }}>
          ({rating}/5)
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Partner Contacts
      </Typography>
      
      <Grid container spacing={3}>
        {sampleContacts.map((contact) => (
          <Grid item xs={12} sm={6} md={6} key={contact.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                width: '100%',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  cursor: 'pointer'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                {/* Header with Avatar and Name */}
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      mr: 2,
                      bgcolor: 'primary.main',
                      fontSize: '1.2rem'
                    }}
                  >
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {contact.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {contact.role}
                    </Typography>
                  </Box>
                </Box>

                {/* Company */}
                <Box display="flex" alignItems="center" mb={1}>
                  <Business style={{ fontSize: 16, marginRight: 8, color: '#666' }} />
                  <Typography variant="body2" color="text.secondary">
                    {contact.company}
                  </Typography>
                </Box>

                {/* Location */}
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationOn style={{ fontSize: 16, marginRight: 8, color: '#666' }} />
                  <Typography variant="body2" color="text.secondary">
                    {contact.location}
                  </Typography>
                </Box>

                {/* Rating */}
                <Box mb={2}>
                  {renderStarRating(contact.rating)}
                </Box>

                {/* Specialties */}
                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Specialties:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {contact.specialty.map((spec, index) => (
                      <Chip
                        key={index}
                        label={spec}
                        size="small"
                        variant="outlined"
                        style={{ fontSize: '0.7rem', margin: '2px' }}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Contact Info */}
                <Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Email style={{ fontSize: 16, marginRight: 8, color: '#1976d2' }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      component="a"
                      href={`mailto:${contact.email}`}
                    >
                      {contact.email}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Phone style={{ fontSize: 16, marginRight: 8, color: '#1976d2' }} />
                    <Typography 
                      variant="body2"
                      sx={{ 
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      component="a"
                      href={`tel:${contact.phone}`}
                    >
                      {contact.phone}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PartnerContact;