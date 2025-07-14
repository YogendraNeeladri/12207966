import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Grid
} from '@mui/material';
import {
  ContentCopy,
  Launch,
  AccessTime,
  Link as LinkIcon
} from '@mui/icons-material';
import { UrlFormData } from '../types';
import { useUrlShortener } from '../hooks/useUrlShortener';

const UrlShortener: React.FC = () => {
  const {
    shortenedUrls,
    isLoading,
    error,
    formErrors,
    shortenUrl,
    clearError,
    setFormErrors
  } = useUrlShortener();

  const [formData, setFormData] = useState<UrlFormData>({
    originalUrl: '',
    validityMinutes: '',
    customShortcode: ''
  });

  const handleInputChange = (field: keyof UrlFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    
    setFormErrors(prev => prev.filter(error => error.field !== field));
    if (error) clearError();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const success = await shortenUrl(formData);
    if (success) {
      setFormData({
        originalUrl: '',
        validityMinutes: '',
        customShortcode: ''
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getFieldError = (field: string) => {
    return formErrors.find(error => error.field === field)?.message;
  };

  const getShortUrl = (shortcode: string) => {
    return `${window.location.origin}/${shortcode}`;
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          URL Shortener
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          Shorten up to 5 URLs with custom shortcodes and expiry times
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Original URL"
                value={formData.originalUrl}
                onChange={handleInputChange('originalUrl')}
                error={!!getFieldError('originalUrl')}
                helperText={getFieldError('originalUrl')}
                placeholder="https://example.com/very-long-url"
                required
                InputProps={{
                  startAdornment: <LinkIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Validity (minutes)"
                type="number"
                value={formData.validityMinutes}
                onChange={handleInputChange('validityMinutes')}
                error={!!getFieldError('validityMinutes')}
                helperText={getFieldError('validityMinutes') || 'Default: 30 minutes'}
                placeholder="30"
                InputProps={{
                  startAdornment: <AccessTime sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Custom Shortcode (optional)"
                value={formData.customShortcode}
                onChange={handleInputChange('customShortcode')}
                error={!!getFieldError('customShortcode')}
                helperText={getFieldError('customShortcode') || 'Alphanumeric, max 10 chars'}
                placeholder="my-link"
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading || shortenedUrls.length >= 5}
              startIcon={isLoading ? <CircularProgress size={20} /> : <LinkIcon />}
              sx={{ minWidth: 200 }}
            >
              {isLoading ? 'Shortening...' : 'Shorten URL'}
            </Button>
          </Box>
        </Box>

        {shortenedUrls.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Your Shortened URLs ({shortenedUrls.length}/5)
            </Typography>
            
            <Grid container spacing={2}>
              {shortenedUrls.map((url) => (
                <Grid item xs={12} key={url.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          Original: {url.originalUrl}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                          <Typography variant="h6" color="primary" sx={{ flexGrow: 1 }}>
                            {getShortUrl(url.shortcode)}
                          </Typography>
                          <Tooltip title="Copy to clipboard">
                            <IconButton
                              size="small"
                              onClick={() => copyToClipboard(getShortUrl(url.shortcode))}
                            >
                              <ContentCopy />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Open in new tab">
                            <IconButton
                              size="small"
                              onClick={() => window.open(getShortUrl(url.shortcode), '_blank')}
                            >
                              <Launch />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={`Created: ${formatDateTime(url.createdAt)}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={`Expires: ${formatDateTime(url.expiresAt)}`}
                          size="small"
                          variant="outlined"
                          color={url.expiresAt < new Date() ? 'error' : 'default'}
                        />
                        <Chip
                          label={`Clicks: ${url.clickCount}`}
                          size="small"
                          color="primary"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UrlShortener;