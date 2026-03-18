import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import './Profile.css';

function Profile() {
    const [user, setUser] = useState({
        id: '', emri: '', mbiemri: '', email: '', nr_tel: '', data_lindjes: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser?.id) return;

            const res = await axios.get(`http://localhost:5000/api/auth/me?id=${storedUser.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data) {
                setUser({
                    ...res.data,
                    data_lindjes: res.data.data_lindjes ? res.data.data_lindjes.split('T')[0] : ''
                });
            }
        } catch (err) {
            console.error("Gabim.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProfile(); }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: 'info', text: "Duke ruajtur..." });
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/auth/update', user, {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.setItem('user', JSON.stringify(user));
            setMessage({ type: 'success', text: "U përditësua me sukses!" });
        } catch (err) {
            setMessage({ type: 'danger', text: "Gabim." });
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    if (loading) return <div className="loader-full"><Spinner animation="grow" variant="primary" /></div>;

    return (
        <div className="glass-background">
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Card className="glass-card border-0">
                            <Card.Header className="glass-header d-flex justify-content-between align-items-center">
                                <div>
                                    <h2 className="m-0 fw-bold text-white">Profili Im</h2>
                                    <span className="text-white-50 small text-uppercase tracking-wider">Llogaria Personale</span>
                                </div>
                                <Button variant="link" className="logout-glass-btn" onClick={handleLogout}>
                                    <i className="bi bi-box-arrow-right me-2"></i>DIL
                                </Button>
                            </Card.Header>
                            
                            <Card.Body className="p-4 p-md-5 bg-white-glass">
                                {message.text && <Alert variant={message.type} className="glass-alert">{message.text}</Alert>}

                                <Form onSubmit={handleUpdate}>
                                    <div className="form-group-wrapper">
                                        <h6 className="form-subtitle">IDENTITETI</h6>
                                        <Row>
                                            <Col md={6} className="mb-4">
                                                <Form.Label className="glass-label">Emri</Form.Label>
                                                <Form.Control className="glass-input" name="emri" value={user.emri} onChange={handleInputChange} />
                                            </Col>
                                            <Col md={6} className="mb-4">
                                                <Form.Label className="glass-label">Mbiemri</Form.Label>
                                                <Form.Control className="glass-input" name="mbiemri" value={user.mbiemri} onChange={handleInputChange} />
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="form-group-wrapper mt-2">
                                        <h6 className="form-subtitle">KONTAKTI</h6>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="glass-label">Email</Form.Label>
                                            <Form.Control className="glass-input locked" value={user.email} disabled />
                                        </Form.Group>

                                        <Row>
                                            <Col md={6} className="mb-4">
                                                <Form.Label className="glass-label">Nr. Telefoni</Form.Label>
                                                <Form.Control className="glass-input" name="nr_tel" value={user.nr_tel} onChange={handleInputChange} placeholder="nr.tel" />
                                            </Col>
                                            <Col md={6} className="mb-4">
                                                <Form.Label className="glass-label">Datëlindja</Form.Label>
                                                <Form.Control className="glass-input" name="data_lindjes" type="date" value={user.data_lindjes} onChange={handleInputChange} />
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="mt-4 pt-3 border-top d-flex justify-content-end">
                                        <Button variant="primary" type="submit" className="glass-submit-btn px-5">
                                            RUAJ NDRYSHIMET
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Profile;