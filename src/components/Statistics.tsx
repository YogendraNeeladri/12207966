import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Grid,
  Divider
} from '@mui/material';
import {
  Launch,
  TrendingUp,
  Schedule,
  LocationOn
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const Statistics: React.FC = () => {
  const { state } = useApp();
  const { shortenedUrls } = state;

  const totalClicks = shortenedUrls.reduce((total, url) => total + url.clickCount, 0);
  const activeUrls = shortenedUrls.filter(url => url.expiresAt > new Date());
  const expiredUrls = shortenedUrls.filter(url => url.expiresAt <= new Date());

  const formatDateTime = (date: Date) => {
    return date.toLocaleString();
  };

  const getShortUrl = (shortcode: string) => {
    return `${window.location.origin}/${shortcode}`;
  };

  if (shortenedUrls.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
            Statistics Dashboard
          </Typography>
          <Alert severity="info" sx={{ mt: 3 }}>
            No URLs have been shortened yet. Create some shortened URLs to see statistics here.
          </Alert>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Statistics Dashboard
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="primary">
                  {totalClicks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Clicks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Launch color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="success.main">
                  {activeUrls.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active URLs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Schedule color="error" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="error.main">
                  {expiredUrls.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expired URLs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {shortenedUrls.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total URLs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Detailed URL Statistics */}
        {shortenedUrls.map((url) => (
          <Card key={url.id} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {getShortUrl(url.shortcode)}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
                  Original: {url.originalUrl}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip
                    label={`Created: ${formatDateTime(url.createdAt)}`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`Expires: ${formatDateTime(url.expiresAt)}`}
                    size="small"
                    variant="outlined"
                    color={url.expiresAt < new Date() ? 'error' : 'success'}
                  />
                  <Chip
                    label={`Total Clicks: ${url.clickCount}`}
                    size="small"
                    color="primary"
                  />
                </Box>
              </Box>

              {url.clicks.length > 0 ? (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Click Logs
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Timestamp</TableCell>
                          <TableCell>Referrer</TableCell>
                          <TableCell>Location</TableCell>
                          <TableCell>IP Address</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {url.clicks.slice().reverse().map((click, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {formatDateTime(click.timestamp)}
                            </TableCell>
                            <TableCell>
                              {click.referrer === 'Direct' ? (
                                <Chip label="Direct" size="small" />
                              ) : (
                                click.referrer
                              )}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationOn fontSize="small" color="action" />
                                {click.location}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace">
                                {click.ipAddress}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No clicks recorded yet for this URL.
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </Paper>
    </Container>
  );
};

export default Statistics;