import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import "../Styles/MemberDocuments.css";

const MemberDocuments = () => {
  const [member, setMember] = useState(null);
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  // Refs for printing
  const idCardRef = useRef(null);
  const letterRef = useRef(null);

  useEffect(() => {
    if (!email) {
      toast.warning("Please log in to access your documents.");
      navigate("/login");
      return;
    }

    const fetchMemberDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/member/${email}/`);
        setMember(response.data);
      } catch (error) {
        toast.error("Error fetching member details.");
      }
    };

    fetchMemberDetails();
  }, [email, navigate]);

  // Print ID Card
  const handlePrintIDCard = useReactToPrint({
    content: () => idCardRef.current ? idCardRef.current : null,
  });

  // Print Joining Letter
  const handlePrintJoiningLetter = useReactToPrint({
    content: () => letterRef.current ? letterRef.current : null,
  });

  return (
    <div className="member-documents">
      <h2>Member Documents</h2>

      {member ? (
        <>
          {/* ID Card Section */}
          <div className="print-container">
            <div ref={idCardRef} className="id-card">
              <h3>Membership ID Card</h3>
              <p><strong>Name:</strong> {member.name}</p>
              <p><strong>Email:</strong> {member.email}</p>
              <p><strong>Membership ID:</strong> {member.id}</p>
              <p><strong>Joining Date:</strong> {member.joining_date}</p>
            </div>
            <button onClick={handlePrintIDCard} className="print-button">Download ID Card</button>
          </div>

          {/* Joining Letter Section */}
          <div className="print-container">
            <div ref={letterRef} className="joining-letter">
              <h3>Joining Letter</h3>
              <p>Date: {new Date().toLocaleDateString()}</p>
              <p>Dear {member.name},</p>
              <p>
                We are pleased to welcome you as a member of our NGO. Your membership ID is <strong>{member.id}</strong>.
                We appreciate your support and look forward to working with you towards our mission.
              </p>
              <p>Sincerely,</p>
              <p><strong>NGO Name</strong></p>
            </div>
            <button onClick={handlePrintJoiningLetter} className="print-button">Download Joining Letter</button>
          </div>
        </>
      ) : (
        <p>Loading member details...</p>
      )}
    </div>
  );
};

export default MemberDocuments;
