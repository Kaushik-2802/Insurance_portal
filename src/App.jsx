import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from "./pages/Home"
import ClaimForm from './pages/ClaimForm'
import BuyInsurance from "./pages/BuyInsurance"
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/claim-form" element={<ClaimForm />} />
        <Route path="/buy-insurance" element={<BuyInsurance />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
