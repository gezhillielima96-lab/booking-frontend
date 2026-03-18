import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios'; 
import './Login.css';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      
      const response = await API.post('/auth/login', credentials);
      
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      console.log("Login i suksesshëm si:", user.role);

      if (user.role === 'admin' || user.roli === 'admin') {
        navigate('/admin'); 
      } else {
        navigate('/profile'); 
      }

     
      window.location.reload();

    } catch (err) {
      console.error("Gabim gjatë logimit:", err);
      setError(err.response?.data?.message || "Email ose Fjalëkalim i gabuar!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="login-card shadow-lg border-0">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <i className="bi bi-shield-lock display-4 text-primary"></i>
                <h3 className="fw-bold mt-2">Mirësevini</h3>
                <p className="text-muted small">Hyni në llogarinë tuaj</p>
              </div>

              {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Email</Form.Label>
                  <Form.Control 
                    name="email" 
                    type="email" 
                    placeholder="email" 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold">Fjalëkalimi</Form.Label>
                  <Form.Control 
                    name="password" 
                    type="password" 
                    placeholder="password" 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 py-2 fw-bold" 
                  disabled={loading}
                >
                  {loading ? "Duke u loguar..." : "Hyr"}
                </Button>

                <div className="text-center mt-4">
                  <span className="small text-muted">Nuk keni llogari? </span>
                  <Link to="/register" className="small fw-bold text-decoration-none">
                    Regjistrohuni
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;