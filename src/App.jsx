import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeComp from './components/HomeComp';
import LoginPage from './components/LoginPage';
import ChatRoom from './components/ChatRoom'; // Import ChatRoom component
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomeComp />
              </PrivateRoute>
            }
          />
          <Route
            path="/chatroom"
            element={
              <PrivateRoute>
                <ChatRoom />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
