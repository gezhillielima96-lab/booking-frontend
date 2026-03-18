import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './PropertyCard.css';

function PropertyCard({ id, emri, vendndodhja, cmimi, foto }) {
  
  const fullImageUrl = foto ? `http://localhost:5000${foto}` : null;

  return (
    <Card className="shadow-sm border-0 h-100 property-hover-card">
      <Link to={`/property-details/${id}`}>
        {fullImageUrl ? (
          <Card.Img 
            variant="top" 
            src={fullImageUrl} 
            className="property-card-img" 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Imazhi+nuk+gjendet'; }}
          />
        ) : (
          <div className="property-img-placeholder d-flex align-items-center justify-content-center bg-light" style={{height: '200px'}}>
            <i className="bi bi-house-door fs-1 text-secondary"></i>
            <span className="ms-2 text-secondary">Pa Foto</span>
          </div>
        )}
      </Link>
      
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold fs-5 mb-1 text-truncate">{emri}</Card.Title>
        <Card.Text className="text-muted mb-3 small">
          <i className="bi bi-geo-alt-fill me-1 text-danger"></i> {vendndodhja}
        </Card.Text>
        
        <div className="mt-auto d-flex justify-content-between align-items-center">
          
          
          {cmimi && (
            <div>
              <span className="fw-bold text-primary fs-5">
                {cmimi === "Me marrëveshje" ? cmimi : `€${cmimi}`}
              </span>
              {cmimi !== "Me marrëveshje" && <small className="text-muted">/natë</small>}
            </div>
          )}
        
          <Button 
            as={Link} 
            to={`/property-details/${id}`} 
            variant="outline-primary" 
            size="sm" 
            className="rounded-pill px-3 ms-auto" 
          >
            Detajet
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default PropertyCard;