import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import { Link as LinkIcon, BarChart } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={2}>
          <Container maxWidth="lg">
            <Toolbar>
              <LinkIcon sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                URL Shortener Pro
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  color="inherit"
                  component={Link}
                  to="/"
                  variant={location.pathname === '/' ? 'outlined' : 'text'}
                  startIcon={<LinkIcon />}
                  sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.5)' }}
                >
                  Shortener
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/statistics"
                  variant={location.pathname === '/statistics' ? 'outlined' : 'text'}
                  startIcon={<BarChart />}
                  sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.5)' }}
                >
                  Statistics
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
        
        <Box 
          component="footer" 
          sx={{ 
            py: 3, 
            px: 2, 
            mt: 'auto',
            backgroundColor: theme.palette.grey[200],
            textAlign: 'center'
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary">
              © 2025 Yogendra Neeladri.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;