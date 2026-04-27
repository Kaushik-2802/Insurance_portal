import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from "./pages/Home"
import ClaimInsurance from './pages/ClaimInsurance'
import BuyInsurance from "./pages/BuyInsurance"
import PolicyReference from './pages/PolicyReference'
import Payment from './pages/Payment'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import RenewInsurance from './pages/RenewInsurance'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './Admin/AdminDashboard'
import AdminLogin from './Admin/AdminLogin'
import PolicyType from './pages/PolicyType'
import CalculatePremium from './pages/CalculatePremium'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/claim-insurance" element={<ClaimInsurance />} />
        <Route path="/buy-insurance" element={<BuyInsurance />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/policy-reference" element={<PolicyReference />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/renew" element={<RenewInsurance />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/policy-type" element={<PolicyType />} />
        <Route path="/calculate-premium" element={<CalculatePremium />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
