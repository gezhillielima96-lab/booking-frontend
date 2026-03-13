import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './Booking.css';

function Booking() {
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [nrPersonave, setNrPersonave] = useState(1);
  const [emri, setEmri] = useState("");
  const [mbiemri, setMbiemri] = useState("");

  const handleBooking = (e) => {
    e.preventDefault();
   
    console.log("Rezervimi i ri:", { emri, mbiemri, startDate, endDate, nrPersonave });
    alert("Rezervimi u dërgua (Logjika e backend-it do të shtohet së shpejti)");
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow border-0 p-4" style={{ borderRadius: '15px' }}>
            <h2 className="fw-bold mb-4">Plotësoni Rezervimin Tuaj</h2>
            <Form onSubmit={handleBooking}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-bold">Emri</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Shkruani emrin" 
                    value={emri}
                    onChange={(e) => setEmri(e.target.value)}
                    required 
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-bold">Mbiemri</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Shkruani mbiemrin" 
                    value={mbiemri}
                    onChange={(e) => setMbiemri(e.target.value)}
                    required 
                  />
                </Col>
              </Row>

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