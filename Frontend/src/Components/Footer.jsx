import React from "react";
import "../Styles/Footer.css";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section">
          <h3>About Us</h3>
          <p>We are a non-profit organization dedicated to uplifting communities through education, healthcare, and social services.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/donate">Donate</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@ngo.org</p>
          <p>Phone: +123 456 7890</p>
          <p>Location: 123 Charity Street, City, Country</p>
        </div>

        {/* Social Media */}
        <div className="footer-section">
      <h3>Follow Us</h3>
      <div className="social-icons">
        <Link to="https://facebook.com" target="_blank">
          <FaFacebookF className="social-icon" />
        </Link>
        <Link to="https://twitter.com" target="_blank">
          <FaTwitter className="social-icon" />
        </Link>
        <Link to="https://instagram.com" target="_blank">
          <FaInstagram className="social-icon" />
        </Link>
        <Link to="https://linkedin.com" target="_blank">
          <FaLinkedinIn className="social-icon" />
        </Link>
      </div>
    </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} NGO Name. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;