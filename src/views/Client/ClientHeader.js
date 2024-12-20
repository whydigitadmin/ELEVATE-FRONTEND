import { Logout } from '@mui/icons-material';
import { AppBar, Avatar, Box, IconButton, Toolbar, Typography } from '@mui/material';

const HeaderClient = ({ username, onLogout }) => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#1E1E1E' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left Section */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#ffffff',
            fontSize: '1.5rem',
            letterSpacing: 2,
            textTransform: 'uppercase',
            position: 'relative',
            '&::after': {
              content: "''",
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '3px',
              backgroundColor: '#FF421B', // Underline color
              transform: 'scaleX(0)',
              transformOrigin: 'bottom right',
              transition: 'transform 0.3s ease'
            },
            '&:hover::after': {
              transform: 'scaleX(1)',
              transformOrigin: 'bottom left'
            }
          }}
        >
          Elevate
        </Typography>

        {/* Right Section - Username and Logout */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Username Display */}
          <Typography variant="body1" sx={{ color: 'white', marginRight: 2 }}>
            {username}
          </Typography>

          {/* User Avatar */}
          <Avatar sx={{ marginRight: 2 }} alt={username} src="/path/to/avatar.jpg" />

          {/* Logout Button */}
          <IconButton color="inherit" onClick={onLogout} sx={{ borderRadius: '50%' }}>
            <Logout />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderClient;
