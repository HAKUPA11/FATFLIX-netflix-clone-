import { useState } from 'react';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import TitleCards from '../../components/TitleCards/TitleCards';
import hero_banner from '../../assets/hero_banner.jpg';
import hero_banner2 from '../../assets/hero_banner2.jpg';
import hero_title from '../../assets/hero_title.png';
import play_icon from '../../assets/play_icon.png';
import info_icon from '../../assets/info_icon.png';
import { useApp } from '../../context/AppContext';

const HERO_MOVIES = [
  {
    id: 'hero-protector',
    name: 'The Protector',
    banner: hero_banner,
    titleLogo: hero_title,
    type: 'tv',
    rating: '98% Match',
    year: '2024',
    ageLimit: '18+',
    duration: '4 Seasons',
    quality: '4K Ultra HD',
    genres: ['Fantasy', 'Action', 'Sci-Fi'],
    description:
      'An ordinary young man in Istanbul discovers he is connected to an ancient secret order and must protect the city from immortal enemies using mystical relics.',
    cast: ['Çagatay Ulusoy', 'Ayça Aysin Turan', 'Hazar Ergüçlü'],
    trailerId: '8d_BsqbUa0U'
  },
  {
    id: 'm15',
    name: 'Stranger Things',
    banner: hero_banner2,
    titleLogo: null,
    type: 'tv',
    rating: '99% Match',
    year: '2024',
    ageLimit: '16+',
    duration: '4 Seasons',
    quality: '4K Ultra HD',
    genres: ['Sci-Fi', 'Horror', 'Drama'],
    description:
      'When a young boy vanishes into thin air, a small Indiana town uncovers a mystery involving secret experiments, terrifying supernatural forces, and a strange little girl with telekinetic powers.',
    cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'David Harbour', 'Winona Ryder'],
    trailerId: 'b9EkMc79ZSU'
  }
];

const Home = () => {
  const {
    currentTab,
    searchQuery,
    setSearchQuery,
    myList,
    movies,
    playMovie,
    openDetailModal,
    toggleMyList,
    isInMyList,
    showToast
  } = useApp();

  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const heroMovie = HERO_MOVIES[activeHeroIndex];
  const inMyList = isInMyList(heroMovie.id);

  // Search filtering logic
  const filteredSearchMovies = searchQuery
    ? movies.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.genres?.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
          m.cast?.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  // Watchlist movies
  const watchlistMovies = movies.filter((m) => myList.includes(m.id));

  // Category splits
  const tvShows = movies.filter((m) => m.type === 'tv');
  const featureMovies = movies.filter((m) => m.type === 'movie');
  const top10Movies = movies.slice(0, 10);
  const actionMovies = movies.filter((m) => m.genres?.includes('Action'));
  const dramaMovies = movies.filter((m) => m.genres?.includes('Drama') || m.genres?.includes('Crime'));
  const sciFiMovies = movies.filter((m) => m.genres?.includes('Sci-Fi') || m.genres?.includes('Fantasy'));
  const comedyAnimation = movies.filter(
    (m) => m.genres?.includes('Comedy') || m.genres?.includes('Animation')
  );

  return (
    <div className="home">
      <Navbar />

      {/* Render Live Search Grid when searching */}
      {searchQuery.trim().length > 0 ? (
        <div className="search-results-page">
          <div className="search-header">
            <h2>
              Search Results for: <span className="query-highlight">"{searchQuery}"</span>
            </h2>
            <p className="results-count">Found {filteredSearchMovies.length} matching titles</p>
          </div>

          {filteredSearchMovies.length > 0 ? (
            <div className="search-grid">
              {filteredSearchMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="search-card"
                  onClick={() => openDetailModal(movie)}
                >
                  <div className="search-card-media">
                    <img src={movie.image} alt={movie.name} />
                    <span className="search-card-quality">{movie.quality?.includes('4K') ? '4K' : 'HD'}</span>
                  </div>
                  <div className="search-card-body">
                    <h4>{movie.name}</h4>
                    <div className="search-card-meta">
                      <span className="search-match">{movie.rating}</span>
                      <span className="search-year">{movie.year}</span>
                      <span className="search-age">{movie.ageLimit}</span>
                    </div>
                    <p className="search-genres">{movie.genres?.join(' • ')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-search-results">
              <div className="empty-icon">🔍</div>
              <h3>No titles found matching "{searchQuery}"</h3>
              <p>Try searching for different keywords, actors, or genres like "Action", "Sci-Fi", or "Korean".</p>
              <button className="clear-btn" onClick={() => setSearchQuery('')}>
                Clear Search
              </button>
            </div>
          )}
        </div>
      ) : currentTab === 'mylist' ? (
        /* Dedicated My List View */
        <div className="my-list-page">
          <div className="my-list-header">
            <h1>My Watchlist</h1>
            <p className="list-subtitle">
              {watchlistMovies.length} {watchlistMovies.length === 1 ? 'title' : 'titles'} saved to watch
            </p>
          </div>

          {watchlistMovies.length > 0 ? (
            <div className="my-list-grid">
              {watchlistMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="list-card"
                  onClick={() => openDetailModal(movie)}
                >
                  <div className="list-card-media">
                    <img src={movie.image} alt={movie.name} />
                    <button
                      className="remove-list-btn"
                      title="Remove from My List"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMyList(movie);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="list-card-info">
                    <h4>{movie.name}</h4>
                    <div className="list-meta">
                      <span className="list-match">{movie.rating}</span>
                      <span className="list-duration">{movie.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-watchlist">
              <div className="empty-bookmark-icon">📑</div>
              <h3>Your Watchlist is empty</h3>
              <p>Explore titles and click the "+ Add to My List" button to save shows and movies you want to watch later.</p>
            </div>
          )}
        </div>
      ) : (
        /* Main Streaming Home / TV / Movies / Popular / Languages */
        <>
          {/* Hero Banner Section */}
          <div className="hero">
            <img src={heroMovie.banner} alt={heroMovie.name} className="banner-img" />
            <div className="hero-gradient-overlay"></div>

            <div className="hero-caption">
              {heroMovie.titleLogo ? (
                <img src={heroMovie.titleLogo} alt={heroMovie.name} className="caption-img" />
              ) : (
                <h1 className="hero-title-text">{heroMovie.name}</h1>
              )}

              <div className="hero-meta-badges">
                <span className="hero-badge match">{heroMovie.rating}</span>
                <span className="hero-badge age">{heroMovie.ageLimit}</span>
                <span className="hero-badge duration">{heroMovie.duration}</span>
                <span className="hero-badge uhd">{heroMovie.quality}</span>
              </div>

              <p className="hero-desc">{heroMovie.description}</p>

              <div className="hero-btns">
                <button
                  className="btn"
                  onClick={() => playMovie(heroMovie)}
                >
                  <img src={play_icon} alt="Play" />
                  Play
                </button>

                <button
                  className="btn dark-btn"
                  onClick={() => openDetailModal(heroMovie)}
                >
                  <img src={info_icon} alt="More Info" />
                  More Info
                </button>

                <button
                  className={`btn dark-btn list-hero-btn ${inMyList ? 'in-list' : ''}`}
                  onClick={() => toggleMyList(heroMovie)}
                >
                  {inMyList ? '✓ In My List' : '+ My List'}
                </button>
              </div>
            </div>

            {/* Maturity Badge and Banner Switcher in Bottom Right */}
            <div className="hero-right-controls">
              <button
                className="sound-toggle-btn"
                onClick={() => {
                  setIsMuted((prev) => !prev);
                  showToast(!isMuted ? 'Muted preview' : 'Unmuted preview');
                }}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
              <span className="maturity-tag">{heroMovie.ageLimit}</span>
              <button
                className="banner-switch-btn"
                onClick={() =>
                  setActiveHeroIndex((prev) => (prev + 1) % HERO_MOVIES.length)
                }
                title="Switch Spotlight Banner"
              >
                ↻ Next Spotlight
              </button>
            </div>
          </div>

          {/* Categorized Rows of TitleCards */}
          <div className="more-cards-container">
            {currentTab === 'home' && (
              <>
                <TitleCards title="Popular on Fatflix" category="popular" />
                <TitleCards title="Top 10 in India Today" movies={top10Movies} isTop10={true} />
                <TitleCards title="Blockbuster Action & Thrillers" movies={actionMovies} />
                <TitleCards title="Critically Acclaimed TV Dramas" movies={dramaMovies} />
                <TitleCards title="Sci-Fi & Mind-Bending Worlds" movies={sciFiMovies} />
                <TitleCards title="Animation & Comedies" movies={comedyAnimation} />
                <TitleCards title="Trending Now" category="trending" />
              </>
            )}

            {currentTab === 'tv' && (
              <>
                <TitleCards title="Trending TV Shows" movies={tvShows} />
                <TitleCards title="Top 10 TV Shows Today" movies={tvShows.slice(0, 10)} isTop10={true} />
                <TitleCards title="Gripping Crime & Mystery TV" movies={tvShows.filter((m) => m.genres?.includes('Crime') || m.genres?.includes('Mystery'))} />
                <TitleCards title="Sci-Fi & Supernatural TV" movies={tvShows.filter((m) => m.genres?.includes('Sci-Fi') || m.genres?.includes('Fantasy'))} />
              </>
            )}

            {currentTab === 'movies' && (
              <>
                <TitleCards title="Blockbuster Movies" movies={featureMovies} />
                <TitleCards title="Top 10 Movies Today" movies={featureMovies.slice(0, 10)} isTop10={true} />
                <TitleCards title="Action-Packed Adventures" movies={featureMovies.filter((m) => m.genres?.includes('Action'))} />
                <TitleCards title="Award-Winning Dramas" movies={featureMovies.filter((m) => m.genres?.includes('Drama'))} />
              </>
            )}

            {currentTab === 'popular' && (
              <>
                <TitleCards title="Top 10 in India Today" movies={top10Movies} isTop10={true} />
                <TitleCards title="Trending Releases" category="trending" />
                <TitleCards title="Worth the Wait: New Additions" category="popular" />
                <TitleCards title="Critically Acclaimed Hits" movies={dramaMovies} />
              </>
            )}

            {currentTab === 'languages' && (
              <>
                <TitleCards title="Indian Cinema: Hindi, Tamil, Telugu" movies={movies.filter((m) => ['Jawan', 'Leo', 'The Ghost', 'The Railway MEN', 'Sacred Games', 'Adipurush', 'Mission Raniganj', 'Sukhee'].includes(m.name))} />
                <TitleCards title="English Blockbusters" movies={movies.filter((m) => ['Stranger Things', 'Wednesday', 'Breaking Bad', 'Lucifer', 'Interstellar', 'The Witcher', 'Black Mirror', 'Young Sheldon'].includes(m.name))} />
                <TitleCards title="International Hits: Korean & Spanish" movies={movies.filter((m) => ['Squid Game', 'Squid Challenge', 'All of Us Are Dead', 'Money Heist', 'Dark'].includes(m.name))} />
              </>
            )}
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Home;
