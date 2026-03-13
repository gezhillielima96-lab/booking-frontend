import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Spinner, Carousel } from 'react-bootstrap';
import axios from 'axios';

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/properties/${id}`);
        setProperty(res.data.property);
        setRooms(res.data.rooms || []);
        
        
        const resAll = await axios.get(`http://localhost:5000/api/reviews/${id}`);
        setReviews(resAll.data || []);
      } catch (err) {
        console.error("Gabim:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;

  return (
    <Container className="py-5">
      <div className="mb-5 p-4 bg-white rounded shadow-sm border-start border-primary border-5">
        <h2 className="fw-bold">{property?.emri_prones}</h2>
        <p className="text-muted"><i className="bi bi-geo-alt-fill text-danger me-2"></i>{property?.lokacioni}</p>
      </div>

      <h3 className="fw-bold mb-4">Dhomat e Disponueshme</h3>
      <Row className="g-4 mb-5">
        {rooms.map((room) => {
            const fotoArray = room.fotot ? room.fotot.split(',') : [];
            return (
              <Col key={room.id} xs={12} md={6} lg={4}>
                <Card className="h-100 shadow-sm border-0">
                  <div className="position-relative">
                    {fotoArray.length > 0 ? (
                      <Carousel interval={null} indicators={fotoArray.length > 1}>
                        {fotoArray.map((path, index) => (
                          <Carousel.Item key={index}>
                            <img className="d-block w-100" src={`http://localhost:5000${path}`} style={{ height: '220px', objectFit: 'cover' }} />
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    ) : <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '220px' }}>Nuk ka foto</div>}
                  </div>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold mb-0">{room.tipi}</h5>
                      <Badge bg="success">€{room.cmimi}</Badge>
                    </div>
                    
                    <p className="text-muted small">Kapaciteti: {room.kapaciteti} persona</p>
                    <Button variant="primary" className="w-100" onClick={() => navigate('/checkout', { state: { room, propertyName: property.emri_prones } })}>Rezervo Tani</Button>
                  </Card.Body>
                </Card>
              </Col>
            );
        })}
      </Row>

      <h4 className="fw-bold mb-4">Eksperiencat e vizitorëve</h4>
      <Row>
          {reviews.length > 0 ? reviews.map((rev) => (
              <Col md={6} key={rev.id} className="mb-3">
                  <Card className="border-0 shadow-sm p-3 h-100 bg-light">
                      <div className="d-flex justify-content-between">
                          <strong>{rev.emri} {rev.mbiemri}</strong>
                          <span className="text-warning">{"★".repeat(rev.nota)}</span>
                      </div>
                      <p className="text-muted small mt-2">"{rev.komenti}"</p>
                  </Card>
              </Col>
          )) : <p className="text-muted ps-3">Ende nuk ka komente për këtë hotel.</p>}
      </Row>
    </Container>
  );
}
export default PropertyDetails;