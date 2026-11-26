import { useState, useEffect, useRef } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import play_icon from '../../assets/play_icon.png';
import { useApp } from '../../context/AppContext';

const Player = () => {
  const { activeMovie, closePlayer, showToast } = useApp();
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(15);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [useEmbed, setUseEmbed] = useState(true);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = () => {
      setControlsVisible(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  if (!activeMovie) return null;

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    showToast(!isPlaying ? 'Playing' : 'Paused');
  };

  const handleSeek = (e) => {
    setProgress(e.target.value);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const skipTime = (seconds) => {
    setProgress((prev) => Math.max(0, Math.min(100, Number(prev) + (seconds > 0 ? 5 : -5))));
    showToast(seconds > 0 ? '+10s' : '-10s');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="player-container">
      {/* Back button */}
      <div
        className={`player-back-bar ${controlsVisible ? 'visible' : ''}`}
        onClick={closePlayer}
      >
        <img src={back_arrow_icon} alt="Back" className="player-back-icon" />
        <span className="player-title-text">{activeMovie.name}</span>
        <span className="player-meta-tag">{activeMovie.year} • {activeMovie.quality || '4K UHD'}</span>
      </div>

      {/* Main Video Area: Official YouTube Trailer Embed with auto fallback */}
      <div className="video-viewport">
        {useEmbed && activeMovie.trailerId ? (
          <iframe
            className="trailer-iframe"
            src={`https://www.youtube-nocookie.com/embed/${activeMovie.trailerId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&iv_load_policy=3`}
            title={activeMovie.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onError={() => setUseEmbed(false)}
          ></iframe>
        ) : (
          <div className="custom-player-fallback">
            <img
              src={activeMovie.image}
              alt={activeMovie.name}
              className="fallback-backdrop"
            />
            <div className="ambient-overlay"></div>
            <div className="ambient-play-center" onClick={togglePlay}>
              <div className="play-pulse-circle">
                <img src={play_icon} alt="Play" />
              </div>
              <p>Simulated 4K Stream: {activeMovie.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Control Bar (Available for custom controls or fallback) */}
      <div className={`player-controls-bar ${controlsVisible ? 'visible' : ''}`}>
        <div className="scrubber-container">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="player-scrubber"
          />
        </div>

        <div className="controls-row">
          <div className="controls-left">
            <button className="ctrl-btn" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? '❚❚' : '▶'}
            </button>
            <button className="ctrl-btn" onClick={() => skipTime(-10)} title="Rewind 10s">
              ↺ 10
            </button>
            <button className="ctrl-btn" onClick={() => skipTime(10)} title="Forward 10s">
              ↻ 10
            </button>
            <button className="ctrl-btn" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted ? '🔇' : '🔊'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(e.target.value);
                setIsMuted(false);
              }}
              className="volume-slider"
            />
            <span className="time-display">
              {Math.floor((progress * 134) / 100)}:24 / 2:14:00
            </span>
          </div>

          <div className="controls-right">
            <button
              className="ctrl-btn text-btn"
              onClick={() => setUseEmbed((prev) => !prev)}
              title="Toggle Embed vs Ambient Mode"
            >
              {useEmbed ? 'Ambient Player' : 'YouTube Trailer'}
            </button>
            <button className="ctrl-btn" onClick={toggleFullscreen} title="Fullscreen">
              ⛶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
