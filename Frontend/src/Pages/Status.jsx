import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../Styles/Status.css";
import MemberDocuments from "./MemberDocuments";

const Status = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("email"); // Get logged-in user's email
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      toast.warning("Please log in to view your status.");
      navigate("/login"); // Redirect to login page if not authenticated
      return;
    }

    const fetchStatus = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/status/${email}/`);
        setStatus(response.data.status);
      } catch (error) {
        toast.error("Error fetching status. Please try again.");
        setStatus("Error fetching status");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [email, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("email"); // Remove email from storage
    toast.success("Logged out successfully.");
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="status-container">
      <h2>Membership Status</h2>
      {loading ? (
        <p className="status-text">Loading...</p>
      ) : (
        <>
          {status ? (
            <p className="status-text">
              Your status: <span className="status-highlight">{status}</span>
            </p>
          ) : (
            <p className="status-text">No status available.</p>
          )}
        </>
      )}

       <MemberDocuments />

      <button className="logout-button" onClick={handleLogout}>Logout</button>

    </div>
  );
};

export default Status;
