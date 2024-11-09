import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer_content">
        <p className="footer_text">© 2024 e-LimitedToys. All rights reserved.</p>
        <div className="footer_socials">
          <a href="https://facebook.com" className="footer_link">Facebook</a>
          <a href="https://twitter.com" className="footer_link">Twitter</a>
          <a href="https://instagram.com" className="footer_link">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
