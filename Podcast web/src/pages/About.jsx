import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Mail, MapPin, Award, Calendar, Users, Download } from 'lucide-react';
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
                src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Alex Johnson"
                className="host-image"
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="about-content">
              <h1 className="about-title">About TechTalk Podcast</h1>
              <p className="about-description">
                Welcome to TechTalk Podcast, your premier destination for exploring 
                the latest trends, innovations, and breakthroughs in the world of 
                technology. Hosted by industry veteran {podcastInfo.host}, we bring 
                you in-depth conversations with tech leaders, startup founders, and 
                innovation pioneers.
              </p>
              
              <div className="host-info">
                <h3>Meet Your Host</h3>
                <h4>{podcastInfo.host}</h4>
                <p>
                  With over 15 years of experience in the tech industry, Alex has 
                  worked with Fortune 500 companies, successful startups, and 
                  emerging technology ventures. His passion for technology and 
                  storytelling comes together in TechTalk Podcast to bring you 
                  the most relevant and insightful tech content.
                </p>
                
                <div className="contact-info">
                  <div className="contact-item">
                    <Mail size={18} />
                    <span>{podcastInfo.email}</span>
                  </div>
                  <div className="contact-item">
                    <MapPin size={18} />
                    <span>San Francisco, CA</span>
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
                  At TechTalk Podcast, we believe that technology should be accessible 
                  and understandable to everyone. Our mission is to bridge the gap 
                  between complex technological concepts and practical applications, 
                  helping our audience stay informed about the digital transformation 
                  happening around us.
                </p>
                
                <Row className="topics-covered">
                  <Col md={6}>
                    <h4>Topics We Cover</h4>
                    <ul className="topics-list">
                      <li>Artificial Intelligence & Machine Learning</li>
                      <li>Blockchain & Cryptocurrency</li>
                      <li>Cybersecurity & Privacy</li>
                      <li>Cloud Computing & DevOps</li>
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h4>What Makes Us Different</h4>
                    <ul className="topics-list">
                      <li>Deep technical insights made accessible</li>
                      <li>Interviews with industry thought leaders</li>
                      <li>Practical applications and real-world examples</li>
                      <li>Community-driven content and discussions</li>
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
              Our journey in numbers and achievements
            </p>
          </Col>
        </Row>
        
        <Row>
          <Col lg={3} md={6} className="mb-4">
            <Card className="achievement-card">
              <Card.Body className="text-center">
                <Calendar size={40} className="achievement-icon" />
                <h3>3+ Years</h3>
                <p>Broadcasting</p>
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

        {/* Awards & Recognition */}
        <Row className="recognition-section">
          <Col>
            <Card className="recognition-card">
              <Card.Body>
                <h2 className="section-title text-center">Awards & Recognition</h2>
                <Row>
                  <Col md={4} className="text-center mb-3">
                    <div className="award-item">
                      <Award size={48} className="award-icon" />
                      <h4>Best Tech Podcast 2023</h4>
                      <p>Technology Media Awards</p>
                    </div>
                  </Col>
                  <Col md={4} className="text-center mb-3">
                    <div className="award-item">
                      <Award size={48} className="award-icon" />
                      <h4>Top 10 Business Podcasts</h4>
                      <p>Business Insider</p>
                    </div>
                  </Col>
                  <Col md={4} className="text-center mb-3">
                    <div className="award-item">
                      <Award size={48} className="award-icon" />
                      <h4>Innovation in Media</h4>
                      <p>Digital Content Awards</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;