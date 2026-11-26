import { createContext, useContext, useState, useEffect } from 'react';
import cards_data from '../assets/cards/Cards_data';
import profile_img from '../assets/profile_img.png';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation tabs: 'home' | 'tv' | 'movies' | 'popular' | 'mylist' | 'languages'
  const [currentTab, setCurrentTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // My List (persisted in localStorage)
  const [myList, setMyList] = useState(() => {
    try {
      const saved = localStorage.getItem('fatflix_mylist');
      return saved ? JSON.parse(saved) : ['m2', 'm15', 'm4', 'm19'];
    } catch {
      return ['m2', 'm15', 'm4', 'm19'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fatflix_mylist', JSON.stringify(myList));
    } catch (e) {
      console.error('Failed to save myList to localStorage', e);
    }
  }, [myList]);

  // Player state
  const [activeMovie, setActiveMovie] = useState(null);

  // Movie Details Modal state
  const [detailMovie, setDetailMovie] = useState(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Watchlist methods
  const toggleMyList = (movie) => {
    const movieId = typeof movie === 'string' ? movie : movie.id;
    const movieObj = typeof movie === 'object' ? movie : cards_data.find(m => m.id === movieId);
    const movieName = movieObj?.name || 'Movie';

    if (myList.includes(movieId)) {
      setMyList(prev => prev.filter(id => id !== movieId));
      showToast(`Removed "${movieName}" from My List`);
    } else {
      setMyList(prev => [...prev, movieId]);
      showToast(`Added "${movieName}" to My List`);
    }
  };

  const isInMyList = (movieId) => myList.includes(movieId);

  // Auth & Profile state
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState({
    name: 'Krishna',
    email: 'krishna@fatflix.com',
    avatar: profile_img,
    plan: 'Premium Ultra HD 4K'
  });

  // Recent notifications
  const notifications = [
    {
      id: 1,
      title: 'New Season Announcement',
      desc: 'Stranger Things Season 5 is coming soon. Watch the first look trailer.',
      time: '1 hour ago',
      movieId: 'm15'
    },
    {
      id: 2,
      title: 'Trending in your region',
      desc: 'Squid Game is #1 in India Today.',
      time: '3 hours ago',
      movieId: 'm2'
    },
    {
      id: 3,
      title: 'Top Pick for Krishna',
      desc: 'Because you watched Jawan, explore Leo and The Ghost.',
      time: 'Yesterday',
      movieId: 'm13'
    }
  ];

  const playMovie = (movie) => {
    if (!movie) return;
    setActiveMovie(movie);
  };

  const closePlayer = () => {
    setActiveMovie(null);
  };

  const openDetailModal = (movie) => {
    if (!movie) return;
    setDetailMovie(movie);
  };

  const closeDetailModal = () => {
    setDetailMovie(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        myList,
        toggleMyList,
        isInMyList,
        activeMovie,
        playMovie,
        closePlayer,
        detailMovie,
        openDetailModal,
        closeDetailModal,
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        notifications,
        toastMessage,
        showToast,
        movies: cards_data
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
