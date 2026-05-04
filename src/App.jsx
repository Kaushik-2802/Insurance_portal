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
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import PrivacyPolicy from './components/PrivacyPolicy'
import Compliance from './components/Compliance'
import Terms from './components/Terms'
import Profile from './pages/Profile'
import MyPolicies from './pages/MyPolicies'
import Help from './pages/Help'
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
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/compliance' element={<Compliance />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/my-insurance' element={<MyPolicies />} />
        <Route path='/support' element={<Help />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
