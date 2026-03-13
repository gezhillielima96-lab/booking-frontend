import React from 'react';
import { Link } from 'react-router-dom';

function Navigimi() {
 
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <ul className="d-flex list-unstyled gap-4 mb-0 align-items-center">
      <li><Link to="/" className="text-white text-decoration-none fw-medium">Home</Link></li>
      <li><Link to="/properties" className="text-white text-decoration-none fw-medium">Properties</Link></li>
      
      
      {user && user.role !== 'admin' && (
  <li>
    <Link to="/my-bookings" className="text-white text-decoration-none fw-medium">
      My Bookings
    </Link>
  </li>
)}
      
  {user?.role === 'admin' && (
  <li>
    <Link to="/admin" className="text-warning text-decoration-none fw-bold">
      Admin
    </Link>
  </li>
)}
    </ul>
  );
}

export default Navigimi;