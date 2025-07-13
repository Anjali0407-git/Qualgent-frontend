import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TestCases from './pages/TestCases';
import RunView from './pages/RunView';
import Files from './pages/Files';
import Queue from './pages/Queue';
import Box from '@mui/material/Box';

// Auth util
const isAuthenticated = () => !!localStorage.getItem('token');
console.log('isAuthenticated:', isAuthenticated());
console.log('Token:', localStorage.getItem('token'));

// Protected route wrapper
const PrivateRoute = ({ children }) => isAuthenticated() ? children : <Navigate to="/login" />;

const drawerWidth = 200;

function App() {
  return (
    <Router>
      <NavBar />
      {isAuthenticated() && <SideBar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: isAuthenticated() ? `${drawerWidth}px` : 0,
          mt: '64px', p: 3
        }}
      >
        <Routes>
          <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={isAuthenticated() ? <Navigate to="/" /> : <Signup />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/test-cases" element={<PrivateRoute><TestCases /></PrivateRoute>} />
          <Route path="/run-view" element={<PrivateRoute><RunView /></PrivateRoute>} />
          <Route path="/files" element={<PrivateRoute><Files /></PrivateRoute>} />
          <Route path="/queue" element={<PrivateRoute><Queue /></PrivateRoute>} />
          <Route path="*" element={<Navigate to={isAuthenticated() ? "/" : "/login"} />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
