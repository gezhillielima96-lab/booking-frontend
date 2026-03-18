import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import API from '../../api/axios';

function AddProperty() {
    const [formData, setFormData] = useState({
        emri_prones: '',
        pershkrimi: '',
        lokacioni: '',
        kategoria: 1,
        cmimi: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        
        try {
            const res = await API.post('/properties/add', formData);
            setMessage(res.data.message);
            
            setFormData({ emri_prones: '', pershkrimi: '', lokacioni: '', kategoria: 1, cmimi: '' });
        } catch (err) {
            setError(err.response?.data?.message || "Gabim gjatë lidhjes me serverin.");
        }
    };

    return (
        <Container className="py-5">
            <Card className="p-4 shadow-lg border-0">
                <h3 className="mb-4 fw-bold text-primary">Shto Pronë të Re</h3>
                
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Emri i Pronës</Form.Label>
                        <Form.Control 
                            type="text"
                            name="emri_prones" 
                            placeholder="Psh: Hotel Tirana"
                            value={formData.emri_prones} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Lokacioni</Form.Label>
                        <Form.Control 
                            type="text"
                            name="lokacioni" 
                            placeholder="Psh: Tiranë, Shqipëri"
                            value={formData.lokacioni} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Çmimi për natë (€)</Form.Label>
                        <Form.Control 
                            type="number"
                            name="cmimi" 
                            placeholder="Psh: 50"
                            value={formData.cmimi} 
                            onChange={handleChange} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Përshkrimi</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3}
                            name="pershkrimi" 
                            placeholder="Shkruaj diçka për pronën..."
                            value={formData.pershkrimi} 
                            onChange={handleChange} 
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary" className="w-100 fw-bold py-2">
                        Ruaj Pronën në Sistem
                    </Button>
                </Form>
            </Card>
        </Container>
    );
}

export default AddProperty;