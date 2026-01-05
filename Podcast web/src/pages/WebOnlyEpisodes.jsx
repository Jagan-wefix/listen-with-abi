import React from 'react'
import { Container } from 'react-bootstrap'
import Episodes from './Episodes'

const WebOnlyEpisodes = (props) => (
  <div className="spotify-section web-only-section">
    <Container>
      <Episodes {...props} />
    </Container>
  </div>
)

export default WebOnlyEpisodes;
