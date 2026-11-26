import { useRef, useState } from 'react';
import './TitleCards.css';
import cards_data from '../../assets/cards/Cards_data';
import play_icon from '../../assets/play_icon.png';
import info_icon from '../../assets/info_icon.png';
import { useApp } from '../../context/AppContext';

const TitleCards = ({
  title = "Popular on Fatflix",
  category,
  movies: customMovies,
  isLarge = false,
  isTop10 = false
}) => {
  const { playMovie, openDetailModal, toggleMyList, isInMyList, showToast } = useApp();
  const cardsRef = useRef(null);
  const [likedCards, setLikedCards] = useState({});

  // Filter movies by category if specified, or use customMovies or default cards_data
  const displayMovies = customMovies
    ? customMovies
    : category
    ? cards_data.filter((movie) => movie.category === category)
    : cards_data;

  const handleScroll = (direction) => {
    if (cardsRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      cardsRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleLike = (e, movie) => {
    e.stopPropagation();
    setLikedCards((prev) => {
      const isLiked = !prev[movie.id];
      showToast(isLiked ? `Liked "${movie.name}"` : `Unliked "${movie.name}"`);
      return { ...prev, [movie.id]: isLiked };
    });
  };

  return (
    <div className={`title-cards-section ${isLarge ? 'section-large' : ''}`}>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <span className="explore-all" onClick={() => cardsRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}>
          Explore All &gt;
        </span>
      </div>

      <div className="carousel-wrapper">
        {/* Left Scroll Button */}
        <button
          className="slider-arrow arrow-left"
          onClick={() => handleScroll('left')}
          aria-label="Scroll left"
        >
          <span>‹</span>
        </button>

        {/* Horizontal Card List */}
        <div className="card-list" ref={cardsRef}>
          {displayMovies.map((movie, index) => {
            const inList = isInMyList(movie.id);
            const isLiked = likedCards[movie.id];

            return (
              <div
                className={`card ${isLarge ? 'card-large' : ''} ${isTop10 ? 'card-top10' : ''}`}
                key={movie.id || index}
                onClick={() => openDetailModal(movie)}
              >
                {/* Top 10 Number Indicator */}
                {isTop10 && (
                  <div className="top10-rank">
                    <span className="rank-number">{index + 1}</span>
                  </div>
                )}

                <div className="card-media">
                  <img
                    src={movie.image}
                    alt={movie.name}
                    className="card-image"
                    loading="lazy"
                  />
                  {movie.quality && (
                    <span className="quality-pill">{movie.quality.includes('4K') ? '4K' : 'HD'}</span>
                  )}
                </div>

                <div className="card-title-bar">
                  <p className="card-title-text">{movie.name}</p>
                </div>

                {/* Hover Quick Actions Overlay */}
                <div className="card-hover-overlay">
                  <div className="hover-buttons">
                    <button
                      className="circle-btn play-btn"
                      title="Play"
                      onClick={(e) => {
                        e.stopPropagation();
                        playMovie(movie);
                      }}
                    >
                      <img src={play_icon} alt="Play" />
                    </button>

                    <button
                      className={`circle-btn list-btn ${inList ? 'in-list' : ''}`}
                      title={inList ? "Remove from My List" : "Add to My List"}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMyList(movie);
                      }}
                    >
                      {inList ? '✓' : '+'}
                    </button>

                    <button
                      className={`circle-btn like-btn ${isLiked ? 'liked' : ''}`}
                      title="Like"
                      onClick={(e) => handleLike(e, movie)}
                    >
                      {isLiked ? '♥' : '♡'}
                    </button>

                    <button
                      className="circle-btn info-btn"
                      title="More Info"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetailModal(movie);
                      }}
                    >
                      <img src={info_icon} alt="Info" />
                    </button>
                  </div>

                  <div className="hover-meta">
                    <span className="match-score">{movie.rating || '97% Match'}</span>
                    <span className="age-rating">{movie.ageLimit || '16+'}</span>
                    <span className="duration">{movie.duration || '2h 10m'}</span>
                  </div>

                  <div className="hover-genres">
                    {movie.genres?.slice(0, 3).map((g, i) => (
                      <span key={i} className="genre-tag">
                        {g}{i < Math.min(movie.genres.length, 3) - 1 ? ' • ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        <button
          className="slider-arrow arrow-right"
          onClick={() => handleScroll('right')}
          aria-label="Scroll right"
        >
          <span>›</span>
        </button>
      </div>
    </div>
  );
};

export default TitleCards;
