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
  const token = localStorage.getItem('token'); 

  const fetchBookings = () => {
    if (user?.id) {
      axios.get(`http://localhost:5000/api/user-bookings/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setBookings(res.data);
        })
        .catch(err => console.error("Gabim:", err));
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user?.id]);

  const handleOpenReview = (booking) => {
    setSelectedB(booking);
    setShowModal(true);
  };

 

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("A jeni i sigurt që dëshironi të anulloni këtë rezervim?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { full_name: user?.emri + " " + user?.mbiemri } 
        });
        if (response.data.success) {
          alert("Rezervimi u anullua me sukses!");
          fetchBookings(); 
        }
      } catch (err) {
        console.error("Gabim:", err);
        alert("Nuk mund të anullohej rezervimi.");
      }
    }
  };

  const submitReview = async () => {
    const hotelId = selectedB?.property_id || 1;

    const dataReview = {
      user_id: user?.id,
      property_id: hotelId, 
      room_id: selectedB?.room_id,
      nota: nota,
      komenti: komenti,
    
      full_name: user?.emri + " " + user?.mbiemri 
    };

    try {
      await axios.post('http://localhost:5000/api/reviews/add', dataReview, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Vlerësimi u dërgua!");
      setShowModal(false);
      fetchBookings();
    } catch (err) {
      alert("Gabim: " + (err.response?.data?.error || "Kontrolloni Backend-in"));
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
            <Col xs={12} md={8} className="p-4">
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
            <Col xs={12} md={4} className="p-4 bg-light text-center border-start">
              <div className="d-flex flex-column gap-2">
                <Button variant="warning" className="rounded-pill fw-bold shadow-sm" onClick={() => handleOpenReview(b)}>⭐ Vlerëso</Button>
                <Button variant="outline-danger" className="rounded-pill fw-bold" style={{ fontSize: '0.85rem' }} onClick={() => handleCancelBooking(b.id)}>Anullo Rezervimin</Button>
              </div>
            </Col>
          </Row>
        </Card>
      )) : (
        <div className="text-center py-5">
          <i className="bi bi-inbox text-muted display-1"></i>
          <p className="mt-3 text-muted">Nuk u gjet asnjë rezervim.</p>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
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
                onClick={() => setNota(star)}
              ></i>
            ))}
          </div>
          <div className="d-flex gap-2">
            <Button variant="light" className="w-100 py-2 fw-bold" onClick={() => setShowModal(false)}>Mbyll</Button>
            <Button variant="primary" className="w-100 py-2 fw-bold shadow" onClick={submitReview}>DËRGO</Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default MyBookings;