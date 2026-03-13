import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedB, setSelectedB] = useState(null);
  const [nota, setNota] = useState(5);
  const [komenti, setKomenti] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:5000/api/user-bookings/${user.id}`)
        .then(res => {
          console.log("TE DHENAT PER PROFESORIN:", res.data);
          setBookings(res.data);
        })
        .catch(err => console.error("Gabim serveri:", err));
    }
  }, [user?.id]);

  const handleOpenReview = (booking) => {
    setSelectedB(booking);
    setShowModal(true);
  };

  const submitReview = async () => {
    
    const hotelId = selectedB?.id_prona || selectedB?.property_id || selectedB?.id;
    const roomId = selectedB?.id_dhoma || selectedB?.room_id;

    const dataReview = {
      user_id: user?.id,
      property_id: hotelId, 
      room_id: roomId,
      nota: nota,
      komenti: komenti || ""
    };

    if (!hotelId) {
      alert("Gabim: Nuk u gjet asnje ID!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/reviews/add', dataReview);
      if (response.status === 201 || response.status === 200) {
        alert("Vleresimi u dërgua me sukses!");
        setShowModal(false);
        window.location.reload(); 
      }
    } catch (err) {
      console.error("GABIMI I SERVERIT:", err.response?.data);
      alert("Gabim: " + (err.response?.data?.error || "Kontrollo Backend-in"));
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '900px' }}>
      <div className="d-flex align-items-center mb-5">
        <div className="bg-primary rounded-3 p-2 me-3">
            <i className="bi bi-calendar-check text-white fs-3"></i>
        </div>
        <h2 className="fw-bold m-0">Rezervimet e Mia</h2>
      </div>
      
      {bookings.length > 0 ? bookings.map((b) => (
        <Card key={b.id} className="mb-4 border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
          <Row className="g-0 align-items-center">
            <Col xs={12} md={9} className="p-4">
              <div className="d-flex align-items-center mb-2">
                <Badge bg="primary" className="me-2 px-2 py-1">Aktiv</Badge>
                <h5 className="fw-bold m-0 text-dark">{b.emri_prones || "Hotel"}</h5>
              </div>
              <div className="text-muted small d-flex flex-wrap gap-3">
                <span><i className="bi bi-calendar3 me-1"></i> {new Date(b.data_hyrjes).toLocaleDateString()}</span>
                <span><i className="bi bi-door-open me-1"></i> {b.tipi || "Dhomë"}</span>
                <span className="fw-bold text-success">€{b.totali_pageses || b.cmimi}</span>
              </div>
            </Col>
            <Col xs={12} md={3} className="p-4 bg-light text-center border-start">
              <Button 
                variant="warning" 
                className="w-100 rounded-pill fw-bold shadow-sm" 
                onClick={() => handleOpenReview(b)}
              >
                ★ Vlerëso
              </Button>
            </Col>
          </Row>
        </Card>
      )) : (
        <div className="text-center py-5">
          <i className="bi bi-inbox text-muted display-1"></i>
          <p className="mt-3 text-muted">Nuk u gjet asnjë rezervim.</p>
        </div>
      )}

      
      <Modal show={showModal} onHide={() => setShowModal(false)} centered border="0">
        <Modal.Body className="p-5 text-center">
          <div className="mb-4">
            <h4 className="fw-bold">Si ishte qëndrimi juaj?</h4>
            <p className="text-muted small">{selectedB?.emri_prones}</p>
          </div>
          
          <div className="bg-light p-3 rounded-pill d-inline-flex mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <i 
                key={star} 
                className={`bi ${star <= nota ? 'bi-star-fill text-warning' : 'bi-star'} fs-1 mx-2`}
                style={{ cursor: 'pointer', transition: '0.2s transform' }} 
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                onClick={() => setNota(star)}
              ></i>
            ))}
          </div>

          <Form.Control 
            as="textarea" 
            rows={3} 
            value={komenti}
            onChange={(e) => setKomenti(e.target.value)}
            placeholder="Na tregoni eksperiencën tuaj..."
            className="border-0 bg-light p-3 mb-4"
            style={{ borderRadius: '12px' }}
          />
          
          <div className="d-flex gap-2">
            <Button variant="light" className="w-100 py-2 fw-bold" onClick={() => setShowModal(false)}>Anulo</Button>
            <Button variant="primary" className="w-100 py-2 fw-bold shadow" onClick={submitReview}>DËRGO</Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default MyBookings;