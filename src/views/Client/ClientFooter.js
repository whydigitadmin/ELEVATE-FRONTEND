import { Facebook, Instagram, LinkedIn, Twitter } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';

const ClientFooter = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#2C3E50',
        color: '#ECF0F1',
        padding: '10px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.3)'
      }}
    >
      <Typography variant="body2" sx={{ marginLeft: 2 }}>
        © {new Date().getFullYear()} SCM AI-PACKS Private Limited. All rights reserved.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 2 }}>
        <IconButton color="inherit" href="https://www.facebook.com" target="_blank" sx={{ margin: '0 10px' }}>
          <Facebook />
        </IconButton>
        <IconButton color="inherit" href="https://www.twitter.com" target="_blank" sx={{ margin: '0 10px' }}>
          <Twitter />
        </IconButton>
        <IconButton color="inherit" href="https://www.linkedin.com" target="_blank" sx={{ margin: '0 10px' }}>
          <LinkedIn />
        </IconButton>
        <IconButton color="inherit" href="https://www.instagram.com" target="_blank" sx={{ margin: '0 10px' }}>
          <Instagram />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ClientFooter;
