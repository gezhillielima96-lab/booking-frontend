import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import PropertyCard from '../../components/PropertyCard';
import API from '../../api/axios'; 
import './Properties.css';

function Properties() {
  const [kerko, setKerko] = useState("");
  const [teGjitha, setTeGjitha] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await API.get('/all');
        setTeGjitha(response.data);
      } catch (err) {
        console.error("Gabimi te Properties.js:", err);
        setError("Gabim gjatë ngarkimit të pronave.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);
  const hoteletEFiltruara = teGjitha.filter(hotel => 
    hotel.lokacioni?.toLowerCase().includes(kerko.toLowerCase()) || 
    hotel.emri_prones?.toLowerCase().includes(kerko.toLowerCase())
  );

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4 properties-title">Eksploro të gjitha pronat ({teGjitha.length})</h2>
      
      <Row className="mb-5 justify-content-center">
        <Col md={8} lg={6}>
          <InputGroup size="lg" className="shadow-sm search-container">
            <InputGroup.Text className="bg-white border-end-0 search-icon-box">
              <i className="bi bi-search text-primary"></i>
            </InputGroup.Text>
            <Form.Control 
              placeholder="Kërko qytetin ose hotelin..." 
              className="border-start-0 search-input" 
              onChange={(e) => setKerko(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Duke ngarkuar pronat...</p>
        </div>
      ) : (
<Row className="g-4">
  {hoteletEFiltruara.length > 0 ? (
    hoteletEFiltruara.map((hotel) => (
      <Col key={hotel.id} xs={12} sm={6} md={4} lg={3}>
        <PropertyCard 
          id={hotel.id}
          emri={hotel.emri_prones}
          vendndodhja={hotel.lokacioni}
          foto={hotel.foto} 
        />
      </Col>
    ))
          ) : (
            <Col className="text-center py-5 w-100">
              <i className="bi bi-building-exclamation display-1 text-muted opacity-25"></i>
              <h4 className="text-muted mt-3">
                {teGjitha.length === 0 
                  ? "Nuk ka prona në sistem." 
                  : `Nuk u gjend asnjë rezultat për "${kerko}"`}
              </h4>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
}

export default Properties;