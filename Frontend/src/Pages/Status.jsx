import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Status.css";

const Status = () => {
  const [status, setStatus] = useState("");
  const email = localStorage.getItem("email"); // Get logged-in user's email
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/status/${email}/`);
        setStatus(response.data.status);
      } catch (error) {
        setStatus("Error fetching status");
      }
    };

    if (email) fetchStatus();
  }, [email]);

  const handleLogout = () => {
    localStorage.removeItem("email"); // Remove email from storage
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="status-container">
      <h2>Membership Status</h2>
      {email ? (
        <p className="status-text">Your status: <span className="status-highlight">{status}</span></p>
      ) : (
        <p className="status-text">Please login to check your status</p>
      )}
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Status;
