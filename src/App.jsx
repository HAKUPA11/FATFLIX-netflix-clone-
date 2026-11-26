import { AppProvider, useApp } from './context/AppContext';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Player from './pages/Player/Player';
import MovieDetailModal from './components/MovieDetailModal/MovieDetailModal';

const AppContent = () => {
  const { isLoggedIn, activeMovie, detailMovie, toastMessage } = useApp();

  return (
    <div className="app-main">
      {/* Auth Gate */}
      {!isLoggedIn ? <Login /> : <Home />}

      {/* Detail Modal Overlay */}
      {detailMovie && <MovieDetailModal />}

      {/* Video Player Modal / View */}
      {activeMovie && <Player />}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="global-toast">
          <span className="toast-dot"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
