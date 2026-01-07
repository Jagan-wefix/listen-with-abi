import { Container, Row, Col, Card } from 'react-bootstrap';
import { Mail, Award, Calendar, Users, Download, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom'
import { podcastInfo } from '../data/podcastData';

const About = () => {
  return (
    <div className="about-page">
      <Container>
        {/* Hero Section */}
        <Row className="about-hero">
          <Col lg={12}>
            <div className="about-content">
              <h1 className="about-title">About Listen with Abi — Self Improvement Podcast</h1>
              <p className="about-description" style={{color: 'black'}}>
                Listen with Abi is a self‑improvement podcast dedicated to helping you build better habits,
                find clarity, and grow into your best self. Each episode delivers practical strategies,
                real stories, and simple daily practices you can apply right away. Hosted by {podcastInfo.host},
                the show blends evidence‑based techniques with compassionate coaching to support sustainable change.
              </p>
              
              <div className="host-info">
                <h3>Meet Your Host</h3>
                <h4 >{podcastInfo.host}</h4>
                <p style={{color: 'black'}}>
                  Hello, I’m Abi. I’m a lifelong learner with a strong interest in personal growth, resilience, and mindful living. My work focuses on supporting individuals through habit development, career transitions, and wellbeing practices by offering practical, thoughtful guidance. I strive to create meaningful conversations that encourage clarity, balance, and steady progress.
                </p>
                
                <div className="contact-info">
                  <div className="contact-item">
                    <Mail size={18} />
                    <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${podcastInfo.email}`} target="_blank" rel="noopener noreferrer">{podcastInfo.email}</a>
                  </div>
                  <div className="contact-item">
                    <Instagram size={18} />
                    <a href={podcastInfo.instaID} target="_blank" rel="noopener noreferrer">{"listen_with_abi"}</a>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Mission Statement */}
        <Row className="mission-section">
          <Col>
            <Card className="mission-card">
              <Card.Body>
                <h2 className="section-title text-center">Our Mission</h2>
                <p className="mission-text" style={{color: 'black'}}>
                  Our mission is to make sustainable personal growth accessible. We translate research-backed
                  tools into short, practical episodes that help you improve focus, boost wellbeing, and
                  create routines that last — without overwhelm.
                </p>
                
                <Row className="topics-covered">
                  <Col md={6}>
                    <h4>Topics We Cover</h4>
                    <ul className="topics-list">
                      <li>Habit formation & productivity</li>
                      <li>Mindfulness & emotional well‑being</li>    
                      <li>Communication & relationships</li>
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h4 >What Makes Us Different</h4>
                    <ul className="topics-list">
                      <li>Actionable, bite‑sized practices</li>
                      <li>Evidence‑based tools explained simply</li>
                      <li>Community challenges and follow‑ups</li>
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <footer className="about-footer mt-5 text-center">
          <Link to="/admin-auth" className="admin-link" style={{color: '#0F172A'}}>Admin</Link>
        </footer>
      </Container>
    </div>
  );
};

export default About;