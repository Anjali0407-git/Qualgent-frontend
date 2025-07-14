import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TestCases from './pages/TestCases';
import RunView from './pages/RunView';
import Files from './pages/Files';
import Queue from './pages/Queue';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const isAuthenticated = () => !!localStorage.getItem('token');

const PrivateRoute = ({ children }) => (isAuthenticated() ? children : <Navigate to="/login" />);

export default function App() {
  return (
    <Router>
      <NavBar />
      {/* Push content below NavBar */}
      <Box sx={{ pt: '64px', bgcolor: '#f6f7fb', maxHeight: 'calc(100vh - 64px)', display: 'flex', flex: 1 }}>
        <Grid container sx={{display: 'flex', flex: 1}}>
          {isAuthenticated() && (
            <Grid
              item
              xs={2}
              sx={{
                bgcolor: 'white',
                borderRight: 2,
                borderColor: 'divider',
                overflowY: 'auto',
                zIndex: 1100,
              }}
            >
              <SideBar />
            </Grid>
          )}

          <Grid
            item
            xs={isAuthenticated() ? 10 : 12}
            sx={{display: 'flex', flex: 1, bgcolor: 'white'  }}
          >
            <Routes>
              <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <Login />} />
              <Route path="/signup" element={isAuthenticated() ? <Navigate to="/" /> : <Signup />} />
              <Route path="/" element={<PrivateRoute><TestCases /></PrivateRoute>} />
              <Route path="/test-cases" element={<PrivateRoute><TestCases /></PrivateRoute>} />
              <Route path="/run-view" element={<PrivateRoute><RunView /></PrivateRoute>} />
              <Route path="/files" element={<PrivateRoute><Files /></PrivateRoute>} />
              <Route path="/queue" element={<PrivateRoute><Queue /></PrivateRoute>} />
              <Route path="*" element={<Navigate to={isAuthenticated() ? "/" : "/login"} />} />
            </Routes>
          </Grid>
        </Grid>
      </Box>
    </Router>
  );
}

