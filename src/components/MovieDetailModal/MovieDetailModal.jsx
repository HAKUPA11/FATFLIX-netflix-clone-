import { useState } from 'react';
import './MovieDetailModal.css';
import play_icon from '../../assets/play_icon.png';
import { useApp } from '../../context/AppContext';

const MovieDetailModal = () => {
  const {
    detailMovie,
    closeDetailModal,
    playMovie,
    toggleMyList,
    isInMyList,
    movies,
    openDetailModal,
    showToast
  } = useApp();

  const [userRating, setUserRating] = useState(0);

  if (!detailMovie) return null;

  const inList = isInMyList(detailMovie.id);

  // Recommendations: movies with matching genre or category, excluding current
  const relatedMovies = movies
    .filter((m) => m.id !== detailMovie.id)
    .filter(
      (m) =>
        m.category === detailMovie.category ||
        m.genres?.some((g) => detailMovie.genres?.includes(g))
    )
    .slice(0, 6);

  const handleRate = (star) => {
    setUserRating(star);
    showToast(`Rated "${detailMovie.name}" ${star} / 5 stars`);
  };

  return (
    <div className="modal-backdrop" onClick={closeDetailModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={closeDetailModal}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Modal Header Banner */}
        <div className="modal-hero">
          <img
            src={detailMovie.image}
            alt={detailMovie.name}
            className="modal-hero-img"
          />
          <div className="modal-hero-gradient"></div>

          <div className="modal-hero-caption">
            <h1 className="modal-title">{detailMovie.name}</h1>

            <div className="modal-actions">
              <button
                className="modal-btn play-btn"
                onClick={() => {
                  closeDetailModal();
                  playMovie(detailMovie);
                }}
              >
                <img src={play_icon} alt="Play" />
                <span>Play Trailer</span>
              </button>

              <button
                className={`modal-btn list-btn ${inList ? 'in-list' : ''}`}
                onClick={() => toggleMyList(detailMovie)}
              >
                <span>{inList ? '✓ In My List' : '+ Add to My List'}</span>
              </button>

              {/* Star Rating */}
              <div className="modal-rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= userRating ? 'filled' : ''}`}
                    onClick={() => handleRate(star)}
                    title={`Rate ${star} stars`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="modal-body-left">
            <div className="meta-badges">
              <span className="badge-match">{detailMovie.rating || '98% Match'}</span>
              <span className="badge-year">{detailMovie.year || '2024'}</span>
              <span className="badge-age">{detailMovie.ageLimit || '16+'}</span>
              <span className="badge-duration">{detailMovie.duration || '2h 10m'}</span>
              <span className="badge-hd">{detailMovie.quality || '4K Ultra HD'}</span>
            </div>

            <p className="modal-description">{detailMovie.description}</p>
          </div>

          <div className="modal-body-right">
            <div className="meta-row">
              <span className="meta-label">Cast: </span>
              <span className="meta-val">
                {detailMovie.cast ? detailMovie.cast.join(', ') : 'Various Artists'}
              </span>
            </div>

            <div className="meta-row">
              <span className="meta-label">Genres: </span>
              <span className="meta-val">
                {detailMovie.genres ? detailMovie.genres.join(', ') : 'Action, Drama'}
              </span>
            </div>

            <div className="meta-row">
              <span className="meta-label">IMDb Score: </span>
              <span className="meta-val highlight-score">
                ★ {detailMovie.imdb || '8.2'} / 10
              </span>
            </div>

            <div className="meta-row">
              <span className="meta-label">Audio & Subtitles: </span>
              <span className="meta-val">English, Hindi, Spanish [Original 5.1]</span>
            </div>
          </div>
        </div>

        {/* More Like This Section */}
        {relatedMovies.length > 0 && (
          <div className="modal-recommendations">
            <h3 className="recommendations-title">More Like This</h3>
            <div className="recommendations-grid">
              {relatedMovies.map((item) => (
                <div
                  key={item.id}
                  className="rec-card"
                  onClick={() => openDetailModal(item)}
                >
                  <div className="rec-img-wrapper">
                    <img src={item.image} alt={item.name} />
                    <span className="rec-duration">{item.duration}</span>
                  </div>
                  <div className="rec-info">
                    <div className="rec-top-row">
                      <span className="rec-match">{item.rating}</span>
                      <span className="rec-age">{item.ageLimit}</span>
                    </div>
                    <h4 className="rec-title">{item.name}</h4>
                    <p className="rec-desc">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailModal;
