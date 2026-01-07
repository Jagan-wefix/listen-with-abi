import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { useAudioPlayer } from './hooks/useAudioPlayer';
import Header from './components/Header';
import AudioPlayer from './components/AudioPlayer';

// Lazy-load pages for faster initial load
const Homepage = lazy(() => import('./pages/Homepage'))
const WebOnlyEpisodes = lazy(() => import('./pages/WebOnlyEpisodes'))
const SpotifyFire = lazy(() => import('./pages/SpotifyFire'))
const About = lazy(() => import('./pages/About'))
const Thoughts = lazy(() => import('./pages/Thoughts'))
const AdminAuth = lazy(() => import('./pages/AdminAuth'))
const AdminUpload = lazy(() => import('./components/AdminUpload'))

function App() {
  const audioPlayer = useAudioPlayer();

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Suspense fallback={<div style={{padding: 40, textAlign: 'center'}}>Loading…</div>}>
            <Routes>
              <Route path="/" element={<Homepage audioPlayer={audioPlayer} />} />
              <Route path="/episodes" element={<WebOnlyEpisodes audioPlayer={audioPlayer} />} />
              <Route path="/spotify-fire" element={<SpotifyFire audioPlayer={audioPlayer} />} />
              <Route path="/web-only-episodes" element={<WebOnlyEpisodes audioPlayer={audioPlayer} />} />
              <Route path="/about" element={<About />} />
              <Route path="/thoughts" element={<Thoughts />} />
              <Route path="/admin-auth" element={<AdminAuth />} />
              <Route path="/admin" element={<AdminUpload />} />
            </Routes>
          </Suspense>
        </main>
        <AudioPlayer {...audioPlayer} />
      </div>
    </Router>
  );
}

export default App;