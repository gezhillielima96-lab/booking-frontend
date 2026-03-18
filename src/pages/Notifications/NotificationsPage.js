import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Badge, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './Notifications.css';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  
  useEffect(() => {
    const fetchNotifications = async () => {
    try {
      const url = user.role === 'admin' 
        ? 'http://localhost:5000/api/admin/notifications' 
        : `http://localhost:5000/api/notifications/${user.id}`;
      const res = await axios.get(url);
      setNotifications(res.data);
      setLoading(false);
    } catch (err) { 
      console.error(err); 
      setLoading(false);
    }
  };

  fetchNotifications();

   }, []);

  const handleRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) { console.error("Gabim:", err); }
  };

  const clearAll = async () => {
    if (window.confirm("A dëshironi t'i fshini të gjitha njoftimet?")) {
      
       notifications.forEach(n => handleRead(n.id));
    }
  };

  const getStyleSettings = (msg) => {
    const m = msg ? msg.toUpperCase() : "";
    if (m.includes('ANULUA')) return { bg: '#fff0f1', icon: 'bi-x-circle-fill', color: '#ff5c6c', label: 'Anullim' };
    if (m.includes('VLERËSIM')) return { bg: '#fff9e6', icon: 'bi-star-fill', color: '#f0ad4e', label: 'Vlerësim' };
    if (m.includes('REZERVOI')) return { bg: '#f0fdf4', icon: 'bi-calendar-check-fill', color: '#4ccb7a', label: 'Rezervim' };
    if (m.includes('KYÇ') || m.includes('LOGUA')) return { bg: '#f0f7ff', icon: 'bi-shield-lock-fill', color: '#3182ce', label: 'Siguri' };
    if (m.includes('REGJISTRUA')) return { bg: '#faf5ff', icon: 'bi-person-plus-fill', color: '#805ad5', label: 'Anëtarësi' };
    return { bg: '#ffffff', icon: 'bi-info-circle-fill', color: '#a0aec0', label: 'Info' };
  };

  return (
    <Container className="py-5 notifications-page">
      <div className="header-section d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-0 main-title">Qendra e Njoftimeve</h2>
          <p className="text-muted small">Keni {notifications.length} njoftime të patrajtuara</p>
        </div>
        
      </div>

      <div className="notifications-list">
        {notifications.map((n, index) => {
          const style = getStyleSettings(n.mesazhi);
          const [emri, ...rest] = n.mesazhi.split(':');
          const mbetja = rest.join(':');

          return (
            <Card key={n.id} className="notif-card-custom mb-3 animate-in" style={{ '--delay': `${index * 0.1}s` }}>
              <Card.Body className="p-3">
                <Row className="align-items-center">
                  <Col xs="auto">
                    <div className="icon-wrapper" style={{ backgroundColor: style.bg, color: style.color }}>
                      <i className={`bi ${style.icon}`}></i>
                    </div>
                  </Col>
                  <Col>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <Badge className="type-badge" style={{ backgroundColor: style.color }}>{style.label}</Badge>
                      <span className="time-text">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="notif-text">
                      <strong className="author-name">{emri}:</strong>
                      <span className="message-body text-secondary ms-1">{mbetja}</span>
                    </div>
                  </Col>
                  <Col xs="auto">
                    <Button variant="link" className="text-decoration-none btn-check-mark" onClick={() => handleRead(n.id)}>
                      <i className="bi bi-check2-circle fs-4"></i>
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          );
        })}

        {!loading && notifications.length === 0 && (
          <div className="empty-state text-center py-5">
            <div className="empty-icon-box mb-3">
              <i className="bi bi-bell-slash text-muted display-4"></i>
            </div>
            <h5 className="text-muted">Gjithçka është në rregull!</h5>
            <p className="text-muted small">Nuk ka njoftime të reja për momentin.</p>
          </div>
        )}
      </div>
    </Container>
  );
}

export default Notifications;