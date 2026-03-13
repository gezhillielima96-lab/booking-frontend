import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import './Profile.css';

function Profile() {
    const [user, setUser] = useState({
        id: '',
        emri: '',
        mbiemri: '',
        email: '',
        nr_tel: '',
        data_lindjes: '' 
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
             
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const token = localStorage.getItem('token');

                if (!storedUser || !storedUser.id) {
                    console.error("ID e përdoruesit nuk u gjet!");
                    setLoading(false);
                    return;
                }

                const res = await axios.get(`http://localhost:5000/api/auth/me?id=${storedUser.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUser(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Gabim në ngarkimin e profilit:", err);
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            
           
            const res = await axios.put('http://localhost:5000/api/auth/update', user, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage({ type: 'success', text: "Profili u përditësua me sukses!" });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'danger', text: "Gabim gjatë përditësimit. Provoni përsëri." });
        }
    };

    const logout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    if (loading) return <div className="text-center mt-5">Duke u ngarkuar të dhënat...</div>;

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    {message.text && <Alert variant={message.type}>{message.text}</Alert>}
                    <Card className="profile-card-custom shadow border-0">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold mt-3">Profili Im</h2>
                            </div>
                            
                            <Form onSubmit={handleUpdate}>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Label className="small fw-bold">Emri</Form.Label>
                                        <Form.Control 
                                            name="emri"
                                            value={user.emri || ''} 
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Label className="small fw-bold">Mbiemri</Form.Label>
                                        <Form.Control 
                                            name="mbiemri"
                                            value={user.mbiemri || ''} 
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Email (Nuk ndryshohet)</Form.Label>
                                    <Form.Control value={user.email || ''} disabled className="bg-light" />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Numri i Telefonit</Form.Label>
                                    <Form.Control 
                                        name="nr_tel"
                                        value={user.nr_tel || ''} 
                                        onChange={handleInputChange}
                                        placeholder="06X XX XX XXX"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold">Datëlindja</Form.Label>
                                    <Form.Control 
                                        type="date"
                                        name="data_lindjes"
                                        value={user.data_lindjes ? user.data_lindjes.split('T')[0] : ''} 
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>

                                <div className="d-grid gap-2">
                                    <Button variant="primary" type="submit" className="fw-bold py-2">
                                        Ruaj Ndryshimet
                                    </Button>
                                    <Button variant="outline-danger" onClick={logout} className="fw-bold py-2 mt-2">
                                        Shkyçu (Logout)
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;