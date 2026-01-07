import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Previously a dummy login. Redirect users to the real admin login page.
const AdminLogin = () => {
  const navigate = useNavigate();
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Admin Access</h2>
              <p>Please use the secure admin login to access the admin panel.</p>
              <div className="d-grid">
                <Button variant="primary" onClick={() => navigate('/admin-auth')}>Go to Admin Login</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;