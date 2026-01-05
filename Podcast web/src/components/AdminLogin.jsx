import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [adminId, setAdminId] = useState('');
  const [pin, setPin] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Dummy credentials
    const validAdminId = 'admin';
    const validPin = '1234';
    const validToken = 'token123';

    // Simulate database check
    setTimeout(() => {
      if (adminId === validAdminId && pin === validPin && token === validToken) {
        navigate('/admin-panel');
      } else {
        setError('Invalid credentials. Please check your ADMIN ID, PIN, and AUTHORIZATION TOKEN.');
      }
      setLoading(false);
    }, 1000); // Simulate delay
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Admin Access</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>ADMIN ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    required
                    placeholder="Enter ADMIN ID"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>PIN</Form.Label>
                  <Form.Control
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    required
                    placeholder="Enter PIN"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>AUTHORIZATION TOKEN</Form.Label>
                  <Form.Control
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    placeholder="Enter AUTHORIZATION TOKEN"
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Access Admin Panel'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;