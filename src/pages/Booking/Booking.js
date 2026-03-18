import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Booking.css';

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  
  
  const { propertyId, roomId, price } = location.state || {};
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token'); 

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [nrPersonave, setNrPersonave] = useState(1);


 const handleBooking = async (e) => {
    e.preventDefault();
    
    
    if (!user || !user.id) {
        alert("Ju lutem logohuni për të kryer rezervimin!");
        return;
    }

    
    if (!propertyId || !roomId) {
        alert("Gabim: Të dhënat e pronës ose dhomës mungojnë.");
        return;
    }

    
    const bookingData = {
        user_id: user.id,
        property_id: propertyId,
        room_id: roomId,
        data_hyrjes: startDate ? (typeof startDate.toISOString === 'function' ? startDate.toISOString().split('T')[0] : startDate) : null,
        data_daljes: endDate ? (typeof endDate.toISOString === 'function' ? endDate.toISOString().split('T')[0] : endDate) : null,
        totali_pageses: price || 0,
        full_name: `${user?.emri || 'Klient'} ${user?.mbiemri || ''}`.trim()
    };

    try {
        const response = await axios.post('http://localhost:5000/api/process', bookingData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
            alert("Rezervimi u krye me sukses!");
            navigate('/my-bookings');
        }
    } catch (err) {
        console.error("Gabim gjatë rezervimit:", err);
       
        const errorMsg = err.response?.data?.message || "Rezervimi dështoi. Provoni përsëri.";
        alert(errorMsg);
    }
};



  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow border-0 p-4" style={{ borderRadius: '15px' }}>
            <h2 className="fw-bold mb-4">Plotësoni Rezervimin Tuaj</h2>
            <Form onSubmit={handleBooking}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Label className="fw-bold d-block">Data e Hyrjes</Form.Label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className="form-control"
                    placeholderText="Zgjidh datën"
                    required
                  />
                </Col>
                <Col md={6}>
                  <Form.Label className="fw-bold d-block">Data e Daljes</Form.Label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    className="form-control"
                    placeholderText="Zgjidh datën"
                    required
                  />
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Numri i Personave</Form.Label>
                <Form.Control 
                  type="number" 
                  min="1" 
                  value={nrPersonave}
                  onChange={(e) => setNrPersonave(e.target.value)}
                  required 
                />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" size="lg" className="fw-bold">
                  Konfirmo Rezervimin
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Booking;