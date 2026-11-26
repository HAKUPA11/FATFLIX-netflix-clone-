import { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search_icon.svg";
import bell_icon from "../../assets/bell_icon.svg";
import profile_img from "../../assets/profile_img.png";
import caret_icon from "../../assets/caret_icon.svg";
import { useApp } from "../../context/AppContext";

const Navbar = () => {
  const {
    currentTab,
    setCurrentTab,
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    myList,
    notifications,
    openDetailModal,
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
    showToast,
    movies
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Scroll listener for sticky transparent-to-solid transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close popups on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTabClick = (tab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNotificationClick = (notif) => {
    setShowNotifications(false);
    const targetMovie = movies.find((m) => m.id === notif.movieId);
    if (targetMovie) {
      openDetailModal(targetMovie);
    }
  };

  const handleProfileSwitch = (name) => {
    setUser((prev) => ({ ...prev, name }));
    showToast(`Switched profile to ${name}`);
    setShowProfileMenu(false);
  };

  const handleAuthToggle = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      showToast("Signed out of Fatflix");
    } else {
      setIsLoggedIn(true);
      showToast("Signed back in");
    }
    setShowProfileMenu(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? "nav-dark" : ""}`}>
      <div className="navbar-left">
        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <span className={`bar ${mobileMenuOpen ? "open" : ""}`}></span>
          <span className={`bar ${mobileMenuOpen ? "open" : ""}`}></span>
          <span className={`bar ${mobileMenuOpen ? "open" : ""}`}></span>
        </button>

        <img
          src={logo}
          alt="Fatflix"
          className="navbar-logo"
          onClick={() => handleTabClick("home")}
        />

        <ul className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <li
            className={currentTab === "home" ? "active" : ""}
            onClick={() => handleTabClick("home")}
          >
            Home
          </li>
          <li
            className={currentTab === "tv" ? "active" : ""}
            onClick={() => handleTabClick("tv")}
          >
            TV Shows
          </li>
          <li
            className={currentTab === "movies" ? "active" : ""}
            onClick={() => handleTabClick("movies")}
          >
            Movies
          </li>
          <li
            className={currentTab === "popular" ? "active" : ""}
            onClick={() => handleTabClick("popular")}
          >
            New & Popular
          </li>
          <li
            className={`my-list-nav ${currentTab === "mylist" ? "active" : ""}`}
            onClick={() => handleTabClick("mylist")}
          >
            My List
            {myList.length > 0 && (
              <span className="nav-badge">{myList.length}</span>
            )}
          </li>
          <li
            className={currentTab === "languages" ? "active" : ""}
            onClick={() => handleTabClick("languages")}
          >
            Browse by Languages
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        {/* Interactive Search Box */}
        <div className={`search-box ${isSearchOpen ? "search-open" : ""}`}>
          <img
            src={search_icon}
            alt="Search"
            className="icons"
            onClick={() => {
              setIsSearchOpen((prev) => !prev);
              if (isSearchOpen) setSearchQuery("");
            }}
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Titles, people, genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="clear-search"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          )}
        </div>

        {/* Profile Pill / Kids shortcut */}
        <p
          className="kids-pill"
          onClick={() => {
            handleProfileSwitch(user.name === "Children" ? "Krishna" : "Children");
          }}
          title="Switch profile mode"
        >
          {user.name === "Children" ? "Exit Kids" : "Children"}
        </p>

        {/* Notification Bell with Badge and Dropdown */}
        <div className="notification-wrapper" ref={notifRef}>
          <div
            className="bell-icon-container"
            onClick={() => setShowNotifications((prev) => !prev)}
            title="Notifications"
          >
            <img src={bell_icon} alt="Notifications" className="icons" />
            <span className="bell-badge-dot"></span>
          </div>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h4>Notifications</h4>
                <span className="notif-count">{notifications.length} New</span>
              </div>
              <div className="notification-list">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="notification-item"
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="notif-icon">🔥</div>
                    <div className="notif-content">
                      <p className="notif-title">{notif.title}</p>
                      <p className="notif-desc">{notif.desc}</p>
                      <span className="notif-time">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile and Dropdown */}
        <div className="navbar-profile" ref={profileRef}>
          <div
            className="profile-btn"
            onClick={() => setShowProfileMenu((prev) => !prev)}
          >
            <img src={profile_img} alt="User Avatar" className="profile" />
            <img
              src={caret_icon}
              alt="Menu"
              className={`caret-icon ${showProfileMenu ? "rotated" : ""}`}
            />
          </div>

          {showProfileMenu && (
            <div className="dropdown">
              <div className="dropdown-profiles">
                <div
                  className={`profile-item ${
                    user.name === "Krishna" ? "active-profile" : ""
                  }`}
                  onClick={() => handleProfileSwitch("Krishna")}
                >
                  <img src={profile_img} alt="Krishna" />
                  <span>Krishna {user.name === "Krishna" && "(Active)"}</span>
                </div>
                <div
                  className={`profile-item ${
                    user.name === "Children" ? "active-profile" : ""
                  }`}
                  onClick={() => handleProfileSwitch("Children")}
                >
                  <div className="kids-avatar">👶</div>
                  <span>Children</span>
                </div>
                <div
                  className={`profile-item ${
                    user.name === "Guest" ? "active-profile" : ""
                  }`}
                  onClick={() => handleProfileSwitch("Guest")}
                >
                  <div className="guest-avatar">👤</div>
                  <span>Guest</span>
                </div>
              </div>

              <div className="dropdown-divider"></div>

              <div className="dropdown-links">
                <p
                  onClick={() => {
                    handleTabClick("mylist");
                    setShowProfileMenu(false);
                  }}
                >
                  My Watchlist ({myList.length})
                </p>
                <p
                  onClick={() => {
                    showToast("Plan: Ultra HD 4K (Active)");
                    setShowProfileMenu(false);
                  }}
                >
                  Account & Billing
                </p>
                <p
                  onClick={() => {
                    showToast("Fatflix Help Centre: 24/7 Support Available");
                    setShowProfileMenu(false);
                  }}
                >
                  Help Centre
                </p>
              </div>

              <div className="dropdown-divider"></div>

              <div className="dropdown-signout" onClick={handleAuthToggle}>
                {isLoggedIn ? "Sign Out of Fatflix" : "Sign In to Fatflix"}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
