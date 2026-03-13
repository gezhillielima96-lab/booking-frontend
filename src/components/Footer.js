import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="py-5 mt-5 footer">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h4 className="fw-bold text-info">YourBooking</h4>
            <p className="text-light opacity-75">
              Platforma juaj e besuar për rezervime të hoteleve dhe apartamenteve në të gjithë Shqipërinë.
            </p>
          </Col>

          <Col md={4} className="mb-4">
            <h5>Linke të Shpejta</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-white text-decoration-none opacity-75">Home</Link></li>
              <li><Link to="/properties" className="text-white text-decoration-none opacity-75">Properties</Link></li>
              <li><Link to="/profile" className="text-white text-decoration-none opacity-75">Profili</Link></li>
            </ul>
          </Col>

          <Col md={4} className="mb-4">
            <h5>Na Ndiqni</h5>
            <div className="d-flex gap-3 fs-4 mt-3">
              <i className="bi bi-facebook pointer"></i>
              <i className="bi bi-instagram pointer"></i>
              <i className="bi bi-linkedin pointer"></i>
            </div>
            <p className="mt-3 opacity-75"><i className="bi bi-envelope me-2"></i> info@yourbooking.al</p>
          </Col>
        </Row>
        <hr className="bg-light" />
        <p className="text-center mb-0 opacity-50">©2026 YourBooking. Të gjitha të drejtat e rezervuara.</p>
      </Container>
    </footer>
  );
}

export default Footer;