import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import DashboardHome from './components/DashboardHome';
import { Assets } from './components/Assets';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard Layout Routes */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<DashboardHome />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="assets" element={<Assets />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;