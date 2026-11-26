import { useState } from 'react';
import './Footer.css';
import facebook_icon from '../../assets/facebook_icon.png';
import instagram_icon from '../../assets/instagram_icon.png';
import twitter_icon from '../../assets/twitter_icon.png';
import youtube_icon from '../../assets/youtube_icon.png';
import { useApp } from '../../context/AppContext';

const Footer = () => {
  const { showToast } = useApp();
  const [serviceCode, setServiceCode] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const toggleServiceCode = () => {
    if (serviceCode) {
      setServiceCode(null);
    } else {
      const code = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
      setServiceCode(code);
      showToast(`Service Code generated: ${code}`);
    }
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    showToast(`Language set to ${e.target.value}`);
  };

  const handleLinkClick = (name) => {
    showToast(`Navigating to ${name}...`);
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Social media icons */}
        <div className="footer-social-icons">
          <img
            src={facebook_icon}
            alt="Facebook"
            onClick={() => showToast('Opening Fatflix Facebook')}
          />
          <img
            src={instagram_icon}
            alt="Instagram"
            onClick={() => showToast('Opening Fatflix Instagram')}
          />
          <img
            src={twitter_icon}
            alt="Twitter / X"
            onClick={() => showToast('Opening Fatflix X')}
          />
          <img
            src={youtube_icon}
            alt="YouTube"
            onClick={() => showToast('Opening Fatflix YouTube')}
          />
        </div>

        {/* 4 Column Links */}
        <div className="footer-links-grid">
          <ul>
            <li onClick={() => handleLinkClick('Audio Description')}>Audio Description</li>
            <li onClick={() => handleLinkClick('Investor Relations')}>Investor Relations</li>
            <li onClick={() => handleLinkClick('Legal Notices')}>Legal Notices</li>
            <li onClick={() => handleLinkClick('Fatflix Originals')}>Fatflix Originals</li>
          </ul>
          <ul>
            <li onClick={() => handleLinkClick('Help Centre')}>Help Centre</li>
            <li onClick={() => handleLinkClick('Jobs')}>Jobs</li>
            <li onClick={() => handleLinkClick('Cookie Preferences')}>Cookie Preferences</li>
            <li onClick={() => handleLinkClick('Ad Choices')}>Ad Choices</li>
          </ul>
          <ul>
            <li onClick={() => handleLinkClick('Gift Cards')}>Gift Cards</li>
            <li onClick={() => handleLinkClick('Terms of Use')}>Terms of Use</li>
            <li onClick={() => handleLinkClick('Corporate Information')}>Corporate Information</li>
            <li onClick={() => handleLinkClick('Speed Test')}>Speed Test</li>
          </ul>
          <ul>
            <li onClick={() => handleLinkClick('Media Centre')}>Media Centre</li>
            <li onClick={() => handleLinkClick('Privacy')}>Privacy</li>
            <li onClick={() => handleLinkClick('Contact Us')}>Contact Us</li>
            <li onClick={() => handleLinkClick('Legal Guarantee')}>Legal Guarantee</li>
          </ul>
        </div>

        {/* Language selector & Service Code */}
        <div className="footer-bottom-controls">
          <div className="lang-picker-wrapper">
            <span className="globe-icon">🌐</span>
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="lang-select"
            >
              <option value="English">English</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
              <option value="Spanish">Español (Spanish)</option>
              <option value="Japanese">日本語 (Japanese)</option>
            </select>
          </div>

          <button className="service-code-btn" onClick={toggleServiceCode}>
            {serviceCode ? `Service Code: ${serviceCode}` : 'Service Code'}
          </button>
        </div>

        <p className="copyright-text">
          © 1997-2026 Fatflix, Inc. · Built with React & Vite
        </p>
      </div>
    </footer>
  );
};

export default Footer;
