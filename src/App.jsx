import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from "./pages/Home"
import ClaimForm from './pages/ClaimForm'
import BuyInsurance from "./pages/BuyInsurance"
import PolicyReference from './pages/PolicyReference'
import Payment from './pages/Payment'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/claim-form" element={<ClaimForm />} />
        <Route path="/buy-insurance" element={<BuyInsurance />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/policy-reference" element={<PolicyReference />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
