import React from 'react'
import '../Styles/FixedImage.css'

export default function FixedImagePage() {
  return (
    <div className="page-container">
      {/* Background Image with Overlay Content */}
      <div className="background-wrapper">
        <div className="background-image"></div>
        <div className="content-on-image">
          <h1>Welcome to Our NGO</h1>
          <p>Join us in making a difference. Become a member and contribute to creating a positive impact in society.</p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="scrollable-section">
        <h2>Why Join Us?</h2>
        <p>Becoming a member provides opportunities for personal growth, networking, and contributing to meaningful causes.</p>

        <div className="grid-container">
          <div className="grid-item">
            <h3>Networking</h3>
            <p>Connect with professionals, activists, and like-minded individuals.</p>
          </div>
          <div className="grid-item">
            <h3>Skill Development</h3>
            <p>Enhance your leadership, communication, and management skills.</p>
          </div>
          <div className="grid-item">
            <h3>Community Impact</h3>
            <p>Directly contribute to societal improvements and policy changes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


