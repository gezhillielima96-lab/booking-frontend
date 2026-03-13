import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import PropertyCard from '../../components/PropertyCard';
import API from '../../api/axios';
import './Home.css';

function Home() {
  const [ofertat, setOfertat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await API.get('/all');
        setOfertat(response.data);
      } catch (err) {
        setError("Nuk u mundësua ngarkimi i ofertave.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <>
      <div className="hero">
        <Container>
          <h1 className="display-3 fw-bold text-white">Gjeni shtëpinë tuaj të ardhshme</h1>
          <p className="lead text-white">Eksploroni ofertat më të mira për pushimet tuaja këtë sezon.</p>
        </Container>
      </div>

      <Container className="py-5">
        <h2 className="mb-4 fw-bold">Ofertat tona kryesore:</h2>
        
        {loading && <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Row className="g-4">
          {ofertat.length > 0 ? (
            // Marrim vetëm 4 të parat
            ofertat.slice(0, 4).map((prop) => (
              <Col key={prop.id} xs={12} sm={6} md={4} lg={3}>
                <PropertyCard 
                  id={prop.id} 
                  emri={prop.emri_prones} 
                  vendndodhja={prop.lokacioni} 
                  cmimi={prop.cmimi}
                  // NDRYSHIMI KËTU: hotel.foto në vend të hotel.foto_url
                  foto={prop.foto} 
                />
              </Col>
            ))
          ) : !loading && (
            <p className="text-muted text-center py-5">Nuk ka prona për të shfaqur.</p>
          )}
        </Row>
      </Container>
    </>
  );
}

export default Home;