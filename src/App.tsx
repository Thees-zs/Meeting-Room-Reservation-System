import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RoomList from './pages/RoomList';
import RoomDetail from './pages/RoomDetail';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="rooms" element={<RoomList />} />
            <Route path="rooms/:id" element={<RoomDetail />} />
            <Route path="book/:roomId" element={<BookingForm />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
