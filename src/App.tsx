import './App.css'
import HomePage from './pages/HomePage';
import ApplicationForm from './pages/ApplicationForm';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PaymentSuccess from './pages/Payment_Success';
import AdminLogin from './pages/adminLogin';
import AdminDashboard from './pages/adminDashboard';


function App() {
  return (
    <>
      <BrowserRouter basename="/professional">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/apply-elite/:step" element={<ApplicationForm plan="elite" />} />
          <Route path="/apply-elite" element={<Navigate to="/apply-elite/personal-details" replace />} />
          <Route path="/apply-foundational/:step" element={<ApplicationForm plan="foundational"/>} />
          <Route path="/apply-foundational" element={<Navigate to="/apply-foundational/personal-details" replace />} />
          <Route path="/payment_success" element={<PaymentSuccess/>} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
