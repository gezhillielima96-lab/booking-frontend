import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "react-datepicker/dist/react-datepicker.css";
import NavigationBar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import Properties from './pages/Properties/Properties';
import PropertyDetails from './pages/PropertyDetails/PropertyDetails';
import Booking from './pages/Booking/Booking';
import MyBookings from './pages/MyBookings/MyBookings';
import Profile from './pages/Profile/Profile'; 
import Admin from './pages/Admin/Admin';
import Login from './pages/Login/Login';    
import Register from './pages/Register/Register'; 
import AddProperty from './pages/Admin/addProperty';
import Checkout from './pages/Checkout/Checkout';

function App() {
  return (
    <Router>
      
      <NavigationBar />
      
      <Routes>
       
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/property-details/:id" element={<PropertyDetails />} />
        
       
        <Route path="/booking" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/profile" element={<Profile />} />
        
        <Route path="/admin" element={<Admin />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      
      <Footer />
    </Router>
  );
}

export default App;