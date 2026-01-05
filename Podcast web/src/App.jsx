import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { useAudioPlayer } from './hooks/useAudioPlayer';
import Header from './components/Header';
import AudioPlayer from './components/AudioPlayer';
import Homepage from './pages/Homepage';
import Episodes from './pages/Episodes';
import SpotifyFire from './pages/SpotifyFire';
import WebOnlyEpisodes from './pages/WebOnlyEpisodes';
import About from './pages/About';
import Thoughts from './pages/Thoughts';
import AdminUpload from './components/AdminUpload';

function App() {
  const audioPlayer = useAudioPlayer();

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Homepage audioPlayer={audioPlayer} />} />
            <Route path="/episodes" element={<WebOnlyEpisodes audioPlayer={audioPlayer} />} />
            <Route path="/spotify-fire" element={<SpotifyFire audioPlayer={audioPlayer} />} />
            <Route path="/web-only-episodes" element={<WebOnlyEpisodes audioPlayer={audioPlayer} />} />
            <Route path="/about" element={<About />} />
            <Route path="/thoughts" element={<Thoughts />} />
            <Route path="/admin" element={<AdminUpload />} />
          </Routes>
        </main>
        <AudioPlayer {...audioPlayer} />
      </div>
    </Router>
  );
}

export default App;