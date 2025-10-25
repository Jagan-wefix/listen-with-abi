import { Container, Row, Col, Card } from 'react-bootstrap';
import { Mail, AtSign, Award, Calendar, Users, Download, Instagram } from 'lucide-react';
import { podcastInfo } from '../data/podcastData';

const About = () => {
  return (
    <div className="about-page">
      <Container>
        {/* Hero Section */}
        <Row className="about-hero">
          <Col lg={6}>
            <div className="host-image-container">
              <img 
                src="sdfgh"
                className="host-image"
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="about-content">
              <h1 className="about-title">About Listen with Abi — Self Improvement Podcast</h1>
              <p className="about-description">
                Listen with Abi is a self‑improvement podcast dedicated to helping you build better habits,
                find clarity, and grow into your best self. Each episode delivers practical strategies,
                real stories, and simple daily practices you can apply right away. Hosted by {podcastInfo.host},
                the show blends evidence‑based techniques with compassionate coaching to support sustainable change.
              </p>
              
              <div className="host-info">
                <h3>Meet Your Host</h3>
                <h4>{podcastInfo.host}</h4>
                <p>
                  Abi is a lifelong learner focused on personal growth, resilience, and mindful living.
                  With experience guiding individuals through habit change, career transitions, and wellbeing practices,
                  Abi brings warm, actionable conversations that motivate and empower listeners to take the next step.
                </p>
                
                <div className="contact-info">
                  <div className="contact-item">
                    <Mail size={18} />
                    <span>{podcastInfo.email}</span>
                  </div>
                  <div className="contact-item">
                    <AtSign size={18} />
                    <span>{podcastInfo.twitter}</span>
                  </div>
                  <div className="contact-item">
                    <Instagram size={18} />
                    <span>{podcastInfo.instaID}</span>
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
                <p className="mission-text">
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
                    <h4>What Makes Us Different</h4>
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

        {/* Statistics & Achievements */}
        <Row className="achievements-section">
          <Col>
            <h2 className="section-title text-center">Podcast Statistics</h2>
            <p className="section-subtitle text-center">
              Progress measured in impact and community growth
            </p>
          </Col>
        </Row>
        
        <Row>
          <Col lg={3} md={6} className="mb-4">
            <Card className="achievement-card">
              <Card.Body className="text-center">
                <Calendar size={40} className="achievement-icon" />
                <h3>3+ Years</h3>
                <p>Sharing practical growth tools</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <Card className="achievement-card">
              <Card.Body className="text-center">
                <Download size={40} className="achievement-icon" />
                <h3>{podcastInfo.totalDownloads}</h3>
                <p>Total Downloads</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <Card className="achievement-card">
              <Card.Body className="text-center">
                <Users size={40} className="achievement-icon" />
                <h3>{podcastInfo.avgListeners}</h3>
                <p>Average Listeners</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <Card className="achievement-card">
              <Card.Body className="text-center">
                <Award size={40} className="achievement-icon" />
                <h3>{podcastInfo.rating}/5</h3>
                <p>Average Rating</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>   
      </Container>
    </div>
  );
};

export default About;