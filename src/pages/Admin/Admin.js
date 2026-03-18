import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Spinner, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

function Admin() {
  const [data, setData] = useState([]); 
  const [properties, setProperties] = useState([]); 
  const [rooms, setRooms] = useState([]); 
  const [selectedProperty, setSelectedProperty] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [showAddProp, setShowAddProp] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showEditProp, setShowEditProp] = useState(false);
  const [showEditRoom, setShowEditRoom] = useState(false);
  const [newProp, setNewProp] = useState({ emri_prones: '', lokacioni: '', image: null });
  const [newRoom, setNewRoom] = useState({ property_id: '', tipi: '', cmimi: '', kapaciteti: '', images: [] }); 
  const [editPropData, setEditPropData] = useState({ id: '', emri_prones: '', lokacioni: '', image: null });
  const [editRoomData, setEditRoomData] = useState({ id: '', property_id: '', tipi: '', cmimi: '', kapaciteti: '', images: [] }); 

  const fetchData = async () => {
    try {
      const resAll = await axios.get('http://localhost:5000/api/admin-all');
      setData(resAll.data);
      const resProps = await axios.get('http://localhost:5000/api/all');
      setProperties(resProps.data);
    } catch (err) { 
        console.error(err); 
    } finally { 
        setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSelectProperty = async (prop) => {
    setSelectedProperty(prop);
    try {
      const res = await axios.get(`http://localhost:5000/api/properties/${prop.id}`);
      setRooms(res.data.rooms || []);
    } catch (err) { alert("Gabim në marrjen e dhomave!"); }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm("A jeni i sigurt që dëshironi të fshini këtë pronë? Do të fshihen edhe dhomat e saj!")) {
        try {
            await axios.delete(`http://localhost:5000/api/properties/${id}`);
            alert("Prona u fshi!");
            fetchData();
            setSelectedProperty(null);
        } catch (err) { alert("Gabim gjatë fshirjes!"); }
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm("Fshini këtë dhomë?")) {
        try {
            await axios.delete(`http://localhost:5000/api/rooms/${id}`);
            alert("Dhoma u fshi!");
            if(selectedProperty) handleSelectProperty(selectedProperty);
        } catch (err) { alert("Gabim gjatë fshirjes!"); }
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm("Anuloni/Fshini këtë rezervim?")) {
        try {
            await axios.delete(`http://localhost:5000/api/bookings/${id}`);
            fetchData();
        } catch (err) { alert("Gabim!"); }
    }
  };

  const handleAddProperty = async () => {
    const formData = new FormData();
    formData.append('emri_prones', newProp.emri_prones);
    formData.append('lokacioni', newProp.lokacioni);
    if (newProp.image) formData.append('image', newProp.image);

    try {
      await axios.post('http://localhost:5000/api/add', formData);
      setShowAddProp(false);
      fetchData();
      alert("Prona u shtua!");
    } catch (err) { alert("Gabim gjatë shtimit!"); }
  };

  const handleAddRoom = async () => {
    const formData = new FormData();
    formData.append('property_id', newRoom.property_id);
    formData.append('tipi', newRoom.tipi);
    formData.append('cmimi', newRoom.cmimi);
    formData.append('kapaciteti', newRoom.kapaciteti);
    if (newRoom.images) {
        Array.from(newRoom.images).forEach(file => { formData.append('images', file); });
    }
    try {
      await axios.post('http://localhost:5000/api/rooms/add', formData);
      setShowAddRoom(false);
      if(selectedProperty) handleSelectProperty(selectedProperty);
      alert("Dhoma u shtua!");
    } catch (err) { alert("Gabim gjatë shtimit!"); }
  };

  const handleUpdateProperty = async () => {
    const formData = new FormData();
    formData.append('emri_prones', editPropData.emri_prones);
    formData.append('lokacioni', editPropData.lokacioni);
    if (editPropData.image) formData.append('image', editPropData.image);
    try {
      await axios.put(`http://localhost:5000/api/properties/${editPropData.id}`, formData);
      setShowEditProp(false);
      fetchData();
      alert("Prona u ndryshua!");
    } catch (err) { alert("Gabim!"); }
  };

  const handleUpdateRoom = async () => {
    const formData = new FormData();
    formData.append('property_id', editRoomData.property_id);
    formData.append('tipi', editRoomData.tipi);
    formData.append('cmimi', editRoomData.cmimi);
    formData.append('kapaciteti', editRoomData.kapaciteti);
    if (editRoomData.images) {
        Array.from(editRoomData.images).forEach(file => { formData.append('images', file); });
    }
    try {
      await axios.put(`http://localhost:5000/api/rooms/${editRoomData.id}`, formData);
      setShowEditRoom(false);
      if(selectedProperty) handleSelectProperty(selectedProperty);
      alert("Dhoma u ndryshua!");
    } catch (err) { alert("Gabim!"); }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between mb-4">
        <h2 className="fw-bold">Admin Panel</h2>
        <div>
          <Button variant="success" className="me-2" onClick={() => setShowAddProp(true)}>+ Shto Pronë</Button>
          <Button variant="primary" onClick={() => setShowAddRoom(true)}>+ Shto Dhomë</Button>
        </div>
      </div>

      <h4 className="fw-bold text-secondary mb-3">Rezervimet</h4>
      <Table striped bordered hover responsive className="mb-5 shadow-sm bg-white text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>Klienti</th>
            <th>Prona</th>
            <th>Dhoma</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Total</th>
            <th>Statusi</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={`booking-${item.id}-${index}`}>
              <td>{item.emri} {item.mbiemri}</td>
              <td>{item.emri_prones}</td>
              <td><strong>{item.dhoma}</strong></td>
              <td>{item.data_hyrjes ? new Date(item.data_hyrjes).toLocaleDateString('sq-AL') : '-'}</td>
              <td>{item.data_daljes ? new Date(item.data_daljes).toLocaleDateString('sq-AL') : '-'}</td>
              <td className="fw-bold">€{item.totali_pageses}</td>
              <td><Badge bg={item.payment_status === 'success' ? 'success' : 'warning'}>{item.payment_status?.toUpperCase() || 'PENDING'}</Badge></td>
              <td><Button variant="outline-danger" size="sm" onClick={() => handleDeleteBooking(item.id)}>Anulo</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4 className="fw-bold text-secondary mb-3">Hotelet</h4>
      <Table hover bordered responsive className="shadow-sm bg-white mb-5">
        <thead className="table-secondary">
          <tr><th>Foto</th><th>Emri</th><th>Lokacioni</th><th>Veprime</th></tr>
        </thead>
        <tbody>
          {properties.map((p, index) => (
            <tr key={`prop-${p.id}-${index}`} onClick={() => handleSelectProperty(p)} style={{ cursor: 'pointer' }}>
              <td><img src={p.foto ? `http://localhost:5000${p.foto}` : 'https://via.placeholder.com/50'} alt="hotel" style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}/></td>
              <td>{p.emri_prones}</td>
              <td>{p.lokacioni}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={(e) => { e.stopPropagation(); setEditPropData(p); setShowEditProp(true); }}>Ndrysho</Button>
                <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteProperty(p.id); }}>Fshij</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedProperty && (
        <div className="mt-5 p-4 border rounded bg-light shadow-sm">
          <h4 className="fw-bold text-primary mb-3">Dhomat e: {selectedProperty.emri_prones}</h4>
          <Table striped bordered hover className="bg-white">
            <thead>
              <tr><th>Foto</th><th>Tipi</th><th>Kapaciteti</th><th>Çmimi</th><th>Veprime</th></tr>
            </thead>
            <tbody>
              {rooms.map((r, index) => {
                const firstImg = r.fotot ? r.fotot.split(',')[0] : null;
                return (
                  <tr key={`room-${r.id}-${index}`}>
                    <td><img src={firstImg ? `http://localhost:5000${firstImg}` : 'https://via.placeholder.com/50'} alt="room" style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}/></td>
                    <td>{r.tipi}</td>
                    <td>{r.kapaciteti} Persona</td>
                    <td>€{r.cmimi}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => { setEditRoomData({...r, images: []}); setShowEditRoom(true); }}>Ndrysho</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteRoom(r.id)}>Fshij</Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      )}

      {/* MODALET */}
      <Modal show={showAddProp} onHide={() => setShowAddProp(false)} centered>
        <Modal.Header closeButton className="bg-success text-white"><strong>Shto Pronë të Re</strong></Modal.Header>
        <Modal.Body>
          <Form.Label>Emri i Pronës</Form.Label>
          <Form.Control className="mb-2" onChange={e => setNewProp({...newProp, emri_prones: e.target.value})} />
          <Form.Label>Vendi (Lokacioni)</Form.Label>
          <Form.Control className="mb-2" onChange={e => setNewProp({...newProp, lokacioni: e.target.value})} />
          <Form.Label className="mt-2">Foto</Form.Label>
          <Form.Control type="file" onChange={e => setNewProp({...newProp, image: e.target.files[0]})} />
        </Modal.Body>
        <Modal.Footer><Button variant="success" onClick={handleAddProperty}>Ruaj</Button></Modal.Footer>
      </Modal>

      <Modal show={showEditProp} onHide={() => setShowEditProp(false)} centered>
        <Modal.Header closeButton className="bg-warning"><strong>Ndrysho Pronën</strong></Modal.Header>
        <Modal.Body>
          <Form.Label>Emri i ri</Form.Label>
          <Form.Control className="mb-2" value={editPropData.emri_prones} onChange={e => setEditPropData({...editPropData, emri_prones: e.target.value})} />
          <Form.Label>Vendi i ri</Form.Label>
          <Form.Control className="mb-2" value={editPropData.lokacioni} onChange={e => setEditPropData({...editPropData, lokacioni: e.target.value})} />
          <Form.Label className="mt-2">Foto</Form.Label>
          <Form.Control type="file" onChange={e => setEditPropData({...editPropData, image: e.target.files[0]})} />
        </Modal.Body>
        <Modal.Footer><Button variant="warning" onClick={handleUpdateProperty}>Ruaj</Button></Modal.Footer>
      </Modal>

      <Modal show={showAddRoom} onHide={() => setShowAddRoom(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white"><strong>Shto Dhomë</strong></Modal.Header>
        <Modal.Body>
          <Form.Label>Zgjidh Hotelin</Form.Label>
          <Form.Select className="mb-2" onChange={e => setNewRoom({...newRoom, property_id: e.target.value})}>
            <option value="">Zgjidh...</option>
            {properties.map(p => <option key={p.id} value={p.id}>{p.emri_prones}</option>)}
          </Form.Select>
          <Form.Label>Tipi</Form.Label>
          <Form.Control className="mb-2" onChange={e => setNewRoom({...newRoom, tipi: e.target.value})} />
          <Form.Label>Kapaciteti</Form.Label>
          <Form.Control className="mb-2" type="number" onChange={e => setNewRoom({...newRoom, kapaciteti: e.target.value})} />
          <Form.Label>Çmimi</Form.Label>
          <Form.Control className="mb-3" type="number" onChange={e => setNewRoom({...newRoom, cmimi: e.target.value})} />
          <Form.Label>Foto</Form.Label>
          <Form.Control type="file" multiple onChange={e => setNewRoom({...newRoom, images: e.target.files})} />
        </Modal.Body>
        <Modal.Footer><Button variant="primary" onClick={handleAddRoom}>Ruaj</Button></Modal.Footer>
      </Modal>

      <Modal show={showEditRoom} onHide={() => setShowEditRoom(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white"><strong>Ndrysho Dhomën</strong></Modal.Header>
        <Modal.Body>
          <Form.Label>Emri</Form.Label>
          <Form.Control className="mb-2" value={editRoomData.tipi} onChange={e => setEditRoomData({...editRoomData, tipi: e.target.value})} />
          <Form.Label>Kapaciteti</Form.Label>
          <Form.Control className="mb-2" type="number" value={editRoomData.kapaciteti} onChange={e => setEditRoomData({...editRoomData, kapaciteti: e.target.value})} />
          <Form.Label>Çmimi</Form.Label>
          <Form.Control className="mb-3" type="number" value={editRoomData.cmimi} onChange={e => setEditRoomData({...editRoomData, cmimi: e.target.value})} />
          <Form.Label>Foto</Form.Label>
          <Form.Control type="file" multiple onChange={e => setEditRoomData({...editRoomData, images: e.target.files})} />
        </Modal.Body>
        <Modal.Footer><Button variant="primary" onClick={handleUpdateRoom}>Ruaj</Button></Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Admin;