import { Navbar, Container, Button, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Navigimi from './Navigimi'; 
import './Navbar.css';

function NavigationBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

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
                <Button as={Link} to="/register" className="rounded-1 px-4 py-2 btn-regjistro">
                  Regjistrohu
                </Button>
              </>
            ) : (
              <>
                <span className="text-white small">Përshëndetje, {user?.emri}</span>
                <Link to="/profile" className="text-white fs-4 me-2">
                  <i className="bi bi-person-circle"></i>
                </Link>
                <Button variant="outline-light" size="sm" onClick={handleLogout} className="rounded-1">
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