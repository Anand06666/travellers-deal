import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import ExperienceList from './pages/ExperienceList';
import ExperienceDetail from './pages/ExperienceDetail';
import Payment from './pages/Payment';
import Completion from './pages/Completion';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import VendorDashboard from './pages/VendorDashboard';
import AddExperience from './pages/AddExperience';

import UserProfile from './pages/UserProfile';

import VendorRegister from './pages/VendorRegister';
import AdminLogin from './pages/AdminLogin';
import AdminVendorDetails from './pages/AdminVendorDetails';
import AdminExperienceDetails from './pages/AdminExperienceDetails';
import SupplierPrivacyPolicy from './pages/SupplierPrivacyPolicy';
import PaymentCollectionPolicy from './pages/PaymentCollectionPolicy';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen font-sans bg-gray-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/experiences" element={<ExperienceList />} />
              <Route path="/experiences/:id" element={<ExperienceDetail />} />
              <Route path="/checkout" element={<Payment />} />
              <Route path="/completion" element={<Completion />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/id/:id" element={<AdminVendorDetails />} />
              <Route path="/admin/experience/:id" element={<AdminExperienceDetails />} />
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/vendor/add" element={<AddExperience />} />
              <Route path="/vendor/register" element={<VendorRegister />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/supplier-privacy-policy" element={<SupplierPrivacyPolicy />} />
              <Route path="/payment-collection-policy" element={<PaymentCollectionPolicy />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
