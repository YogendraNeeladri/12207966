import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  CircularProgress, 
  Alert,
  Box 
} from '@mui/material';
import { Launch } from '@mui/icons-material';
import { useUrlShortener } from '../hooks/useUrlShortener';

const RedirectHandler: React.FC = () => {
  const { shortcode } = useParams<{ shortcode: string }>();
  const { handleRedirect } = useUrlShortener();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performRedirect = async () => {
      if (!shortcode) {
        setError('Invalid shortcode');
        setLoading(false);
        return;
      }

      try {
        const url = await handleRedirect(shortcode);
        if (url) {
          setRedirectUrl(url);
          setTimeout(() => {
            window.location.href = url;
          }, 2000);
        } else {
          setError('URL not found or has expired');
        }
      } catch (err) {
        setError('An error occurred while redirecting');
      } finally {
        setLoading(false);
      }
    };

    performRedirect();
  }, [shortcode, handleRedirect]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" gutterBottom>
            Redirecting...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please wait while we redirect you to your destination.
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Typography variant="h5" gutterBottom>
            Shortcode: /{shortcode}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This shortened URL is either invalid or has expired.
          </Typography>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              <a href="/">← Go back to URL Shortener</a>
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (redirectUrl) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Launch color="primary" sx={{ fontSize: 60, mb: 3 }} />
          <Typography variant="h5" gutterBottom>
            Redirecting to:
          </Typography>
          <Typography 
            variant="body1" 
            color="primary" 
            sx={{ 
              wordBreak: 'break-all', 
              mb: 3,
              p: 2,
              bgcolor: 'background.default',
              borderRadius: 1
            }}
          >
            {redirectUrl}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            If you are not redirected automatically, 
            <a href={redirectUrl} target="_blank" rel="noopener noreferrer"> click here</a>.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return <Navigate to="/" replace />;
};

export default RedirectHandler;