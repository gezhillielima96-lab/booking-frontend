import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Carousel } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";

function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { room, propertyName } = state || {};

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [metoda, setMetoda] = useState('card');

  const user = JSON.parse(localStorage.getItem('user'));

  // Ndajmë fotot për Slider
  const fotoArray = room?.fotot ? room.fotot.split(',') : [];

  // --- RREGULLIMI PER BERJEN GRI TE TE GJITHA DATAVE (Kodi yt origjinal) ---
  const reservedIntervals = room?.bookedDates?.map(range => {
    const s = new Date(range.data_hyrjes);
    const e = new Date(range.data_daljes);
    e.setDate(e.getDate() + 1); 
    return { start: s, end: e };
  }) || [];

  const llogaritTotalin = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate - startDate);
    const netet = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return netet * room.cmimi;
  };

  const handleBooking = async () => {
    if (!startDate || !endDate) return alert("Zgjidhni datat!");

    const formatDate = (date) => {
      const d = new Date(date);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().split('T')[0];
    };

    const payload = {
      user_id: user.id,
      room_id: room.id,
      data_hyrjes: formatDate(startDate),
      data_daljes: formatDate(endDate),
      totali_pageses: llogaritTotalin(),
      metoda_pageses: metoda
    };

    try {
      await axios.post('http://localhost:5000/api/process', payload);
      alert("Rezervimi u krye me sukses!");
      navigate('/my-bookings');
    } catch (err) {
      alert(err.response?.data?.message || "Gabim gjatë rezervimit.");
    }
  };

  if (!room) return <Container className="py-5"><h4>Asnjë dhomë nuk u zgjodh.</h4></Container>;

  return (
    <Container className="py-5">
      <Row className="g-4">
        {/* KOLONA E MAJTË: Logjika e Rezervimit dhe Pagesës (Kodi yt) */}
        <Col md={7}>
          <Card className="p-4 shadow-sm border-0 h-100">
            <h4 className="fw-bold mb-4">Detajet e Rezervimit</h4>
            
            <Form.Label className="fw-bold">Zgjidhni Datat</Form.Label>
            <div className="d-flex gap-2 mb-4">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                excludeDateIntervals={reservedIntervals}
                placeholderText="Hyrja"
                className="form-control"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || new Date()}
                excludeDateIntervals={reservedIntervals}
                placeholderText="Dalja"
                className="form-control"
              />
            </div>

            <h5 className="fw-bold mb-3">Mënyra e Pagesës</h5>
            <Form.Check type="radio" label="Karta" name="metoda" checked={metoda === 'card'} onChange={() => setMetoda('card')} />
            <Form.Check type="radio" label="Kesh" name="metoda" checked={metoda === 'kesh'} onChange={() => setMetoda('kesh')} className="mb-4" />

            {metoda === 'card' && (
              <div className="p-3 bg-light rounded mb-4">
                <Form.Control placeholder="Numri i Kartës" className="mb-2" />
                <Row><Col md={6}><Form.Control placeholder="MM/YY" className="mb-2"/></Col><Col md={6}><Form.Control placeholder="CVV"/></Col></Row>
              </div>
            )}

            <Button variant="primary" className="w-100 py-3 fw-bold mt-auto" onClick={handleBooking}>
              KONFIRMO REZERVIMIN (€{llogaritTotalin()})
            </Button>
          </Card>
        </Col>

        {/* KOLONA E DJATHTË: Përmbledhja me SLIDER (Dizajni i ri) */}
        <Col md={5}>
          <Card className="bg-dark text-white border-0 h-100 overflow-hidden shadow">
            {/* Slideri i fotove */}
            {fotoArray.length > 0 ? (
              <Carousel indicators={fotoArray.length > 1} interval={4000}>
                {fotoArray.map((path, idx) => (
                  <Carousel.Item key={idx}>
                    <img
                      className="d-block w-100"
                      src={`http://localhost:5000${path}`}
                      alt="Room view"
                      style={{ height: '300px', objectFit: 'cover', opacity: '0.8' }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <div className="bg-secondary" style={{ height: '300px' }}></div>
            )}

            <Card.Body className="p-4">
              <h5 className="text-warning fw-bold mb-3">Përmbledhja</h5>
              <div className="mb-2">
                <small className="text-uppercase text-light opacity-50">Prona</small>
                <p className="fs-5 mb-2">{propertyName}</p>
              </div>
              <div className="mb-2">
                <small className="text-uppercase text-light opacity-50">Tipi i dhomës</small>
                <p className="fs-5 mb-2">{room.tipi}</p>
              </div>
              <div className="mb-3">
                <small className="text-uppercase text-light opacity-50">Kapaciteti</small>
                <p className="mb-2">{room.kapaciteti} Persona</p>
              </div>
              
              <hr className="border-secondary" />
              
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="fw-bold mb-0">Total:</h4>
                <h3 className="text-warning fw-bold mb-0">€{llogaritTotalin()}</h3>
              </div>
              {startDate && endDate && (
                <p className="small text-light opacity-50 mt-1 text-end">
                  për {Math.round(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24))} netë
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Checkout;