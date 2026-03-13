import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios'; 
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    emri: '',
    mbiemri: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: '' 
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    if (formData.password !== formData.confirmPassword) {
      return setError("Fjalëkalimet nuk përputhen!");
    }

    try {
      
      const response = await API.post('/auth/register', {
        emri: formData.emri,
        mbiemri: formData.mbiemri,
        email: formData.email,
        password: formData.password,
        adminCode: formData.adminCode
      });

      alert(response.data.message || "U regjistruat me sukses!");
      navigate('/login'); 
    } catch (err) {
      
      setError(err.response?.data?.message || "Gabim gjatë regjistrimit. Serveri nuk përgjigjet.");
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0 p-4">
            <h2 className="text-center fw-bold mb-4 text-primary">Krijo Llogari</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-bold">Emri</Form.Label>
                  <Form.Control 
                    name="emri" 
                    placeholder="Emri juaj"
                    onChange={handleChange} 
                    required 
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-bold">Mbiemri</Form.Label>
                  <Form.Control 
                    name="mbiemri" 
                    placeholder="Mbiemri juaj"
                    onChange={handleChange} 
                    required 
                  />
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Email Adresa</Form.Label>
                <Form.Control 
                  name="email" 
                  type="email" 
                  placeholder="shembull@email.com"
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Fjalëkalimi</Form.Label>
                <Form.Control 
                  name="password" 
                  type="password" 
                  placeholder="Më shumë se 6 karaktere"
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Konfirmo Fjalëkalimin</Form.Label>
                <Form.Control 
                  name="confirmPassword" 
                  type="password" 
                  placeholder="Përsërit fjalëkalimin"
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label className="text-muted small fw-bold">Kodi i Adminit (Vetëm për stafin)</Form.Label>
                <Form.Control 
                  name="adminCode" 
                  type="password" 
                  placeholder="Lini bosh nëse jeni përdorues i thjeshtë" 
                  onChange={handleChange} 
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 fw-bold py-2">
                Regjistrohu Tani
              </Button>
              
              <div className="text-center mt-3">
                <small>Keni një llogari? <a href="/login" className="text-decoration-none">Identifikohuni</a></small>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;