import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import UrlShortener from './components/UrlShortener';
import Statistics from './components/Statistics';
import RedirectHandler from './components/RedirectHandler';
import { logger } from './middleware/LoggingMiddleware';

function App() {
  React.useEffect(() => {
    logger.info('Application started');
    
    
    const handleBeforeUnload = () => {
      logger.info('Application closing');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Redirect routes - must come before layout routes */}
          <Route path="/:shortcode" element={<RedirectHandler />} />
          
          {/* Main application routes */}
          <Route
            path="/"
            element={
              <Layout>
                <UrlShortener />
              </Layout>
            }
          />
          <Route
            path="/statistics"
            element={
              <Layout>
                <Statistics />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;