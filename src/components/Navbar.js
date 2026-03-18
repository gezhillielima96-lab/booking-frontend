import React, { useState, useEffect } from 'react';
import { Navbar, Container, Button, Nav, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigimi from './Navigimi'; 
import './Navbar.css';

function NavigationBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      if (!token || user?.role !== 'admin') return; 

      const url = `http://localhost:5000/api/admin/notifications`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) setNotifications(res.data);
    } catch (err) {
      console.log("Gabim te zilja:", err.message);
      setNotifications([]); 
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id, token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  return (
    <Navbar expand="lg" className="py-3 sticky-top shadow-sm custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-white d-flex align-items-center">
          <i className="bi bi-building-fill-check me-2 navbar-icon"></i>
          <span>YourBooking</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="bg-light" />

        <Navbar.Collapse id="basic-navbar-nav">
          <div className="mx-auto">
            <div className="nav-fix">
              <Navigimi />
            </div>
          </div>

          <Nav className="ms-auto align-items-center gap-3">
            {!token ? (
              <>
                <Link to="/login" className="nav-link text-white fw-medium">Log In</Link>
                <Button as={Link} to="/register" className="rounded-1 px-4 py-2 btn-regjistro text-white">
                  Regjistrohu
                </Button>
              </>
            ) : (
              <>
                {user?.role === 'admin' && (
                  <Link to="/notifications" className="position-relative me-2 text-white text-decoration-none">
                    <i className="bi bi-bell fs-4"></i>
                    {notifications.length > 0 && (
                      <Badge 
                        pill 
                        bg="danger" 
                        className="position-absolute" 
                        style={{ top: '-5px', right: '-8px', fontSize: '0.65rem' }}
                      >
                        {notifications.length}
                      </Badge>
                    )}
                  </Link>
                )}

                <span className="text-white small d-none d-md-block">Përshëndetje, {user?.emri}</span>
                
                <Link to="/profile" className="text-white fs-4">
                  <i className="bi bi-person-circle"></i>
                </Link>

                <Button variant="outline-light" size="sm" onClick={handleLogout} className="rounded-1 ms-2">
                  Dil
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;