import "../Styles/Mission.css";
import missionImage from "../assets/Mission2.jpg"
import React from "react";
import { useNavigate } from "react-router-dom";

const Mission = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate("/*")
    }
  return (
    <section className="mission-section">
      <div className="mission-content">
        <h2 className="mission-title">Our Mission</h2>
        <p className="mission-text">
          Our mission is to create a positive impact in society by helping those in need. We strive to bring change through education, support, and community engagement. Together, we can build a better future.
        </p>
      </div>
      <div className="mission-image">
        <img src={missionImage} alt="Mission" />
      </div>
      <button className="" onClick={goBack}>Go Back </button>
    </section>
  );
};

export default Mission;