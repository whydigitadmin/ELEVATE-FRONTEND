import { Brightness4, Brightness7, Logout } from '@mui/icons-material';
import { AppBar, Avatar, Box, IconButton, Toolbar, Typography, useTheme } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';

import Logo from '../../assets/images/Elevate_logo-removebg-preview.png';

const HeaderClient = ({ username, onLogout, onToggleCallBack }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // State to track theme mode
  const theme = useTheme();

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    onToggleCallBack();
  };

  // Custom theme configuration
  const customTheme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#FF421B'
      }
    },
    typography: {
      allVariants: {
        color: isDarkMode ? '#ffffff' : '#000000' // Adjust text color based on theme
      }
    }
  });

  return (
    <ThemeProvider theme={customTheme}>
      <AppBar position="fixed" sx={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }}>
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
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
              cursor: 'pointer'
            }}
          >
            <Box
              component="img"
              src={Logo}
              alt="Logo"
              sx={{
                height: 40,
                width: 'auto'
              }}
            />
          </Typography>

          {/* Right Section - Username, Theme Toggle, and Logout */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Username Display */}
            <Typography sx={{ marginRight: 2 }}>{username}</Typography>

            {/* Theme Toggle */}
            <IconButton onClick={toggleDarkMode} sx={{ marginRight: 2 }}>
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* User Avatar */}
            <Avatar sx={{ marginRight: 2 }} alt={username} src="/path/to/avatar.jpg" />

            {/* Logout Button */}
            <IconButton color="" onClick={onLogout} sx={{ borderRadius: '50%' }}>
              {isDarkMode ? <Logout /> : <Logout color="#000000" />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default HeaderClient;
