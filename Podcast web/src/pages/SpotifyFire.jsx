import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SpotifyEpisodes from '../components/SpotifyEpisodes';

const SpotifyFire = ({ audioPlayer }) => {
  return (
    <div className="spotify-fire-page">
      <Container>
        <Row>
          <Col>
            <div className="page-header">
              <h1 className="page-title">Spotify Fire</h1>
              <p className="page-subtitle">Spotify exclusive episodes and embeds</p>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            {/* Pass a large latestCount so the full list shows by default */}
            <SpotifyEpisodes rssUrl="https://anchor.fm/s/133292dc/podcast/rss" latestCount={9999} audioPlayer={audioPlayer} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SpotifyFire;
