import "../Styles/Home.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FixedImage from "../Components/FixedImage";
import { FaHandsHelping, FaHandHoldingHeart, FaDonate } from 'react-icons/fa';

import Slide1 from "../assets/Slide1.jpg";
import Slide2 from "../assets/Slide2.png";
import Slide3 from "../assets/Slide3.jpg";
import DemoImage from "../assets/demo.png";
import Mission2 from "../assets/Mission2.jpg"

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLogin, setIsLogin] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    father_name: "",
    birth_date: "",
    address: "",
    qualification: "",
    passport_photo: null,
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const slides = [Slide1, Slide2, Slide3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleChange = (e) => {
    if (e.target.name === "passport_photo") {
      setFormData({ ...formData, passport_photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const mission = () => {
    navigate("/mission")
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate birth_date format (should be YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.birth_date)) {
      toast.error("Birth date format should be YYYY-MM-DD.");
      return;
    }

    const formDataToSend = new FormData();
    for (let key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/register/", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Registration Successful!");
      setIsLogin(true);
      setShowForm(false);
    } catch (error) {
      console.error("Registration Error:", error.response?.data);
      if (error.response?.data?.email) {
        toast.error("Email already exists. Try a different one.");
      } else {
        toast.error("Registration failed. Please check all fields.");
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", loginData);
      if (response.status === 200) {
        toast.success("Login Successful!");
        localStorage.setItem("email", loginData.email);
        navigate("/status");
      } else {
        toast.error("Login failed, please try again.");
      }
    } catch (error) {
      toast.error("Invalid credentials. Please try again.");
    }
  };

  const handleDonation = async () => {
    if (!donationAmount) {
      toast.error("Please enter an amount.");
      return;
    }
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/donate/", {
        amount: donationAmount,
      });

      if (response.data.payment_url) {
        toast.info("Redirecting to payment...");
        window.location.href = response.data.payment_url;
      } else {
        toast.error("Payment URL not received. Please try again.");
      }
    } catch (error) {
      toast.error("Payment failed. Try again.");
    }
  };

  return (
    <div className="home" style={{ zIndex: 5 }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="hero">
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <img key={index} src={slide} alt={`Slide ${index + 1}`} className={index === currentSlide ? "active" : ""} />
          ))}
        </div>
        <div className="hero-content">
          <h1>Empowering Communities, Changing Lives</h1>
          <p>Join us in making the world a better place.</p>
          <button className="cta-button" onClick={() => setShowDonation(true)}>
            Donate Now
          </button>
        </div>
      </header>

      {showDonation && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={() => setShowDonation(false)}>
              &times;
            </span>
            <h3>Donate Now</h3>
            <input
              type="number"
              placeholder="Enter amount"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              required
            />
            <button onClick={handleDonation}>Donate</button>
          </div>
        </div>
      )}
      
      {/* Mission Sections */}
      <section className="mission-section" style={{ zIndex: 5 }}>
        <div className="image-container">
          <img src={Mission2} alt="Our Mission" />
        </div>
        <div className="content-container">
          <span className="section-title">What We Do</span>
          <h3 className="section-heading">We are on a mission</h3>
          <span className="section-description">
            Volutpat odio facilisis mauris sit amet. Purus gravida quis blandit turpis cursus in. Tortor aliquam nulla facilisi cras.
          </span>
          <p className="section-text">
            Egestas fringilla phasellus faucibus scelerisque eleifend. Tempus egestas sed sed risus pretium quam vulputate dignissim. Enim praesent elementum facilisis leo vel fringilla. Enim ut elementum sagittis donec adipiscing tristique risus nec.
          </p>
          <button className="read-more" onClick={mission}>Read More</button>
        </div>
      </section>
      
      {/* Process Sections */}
      <section className="info-section" style={{ zIndex: 5 }}>
      <span className="section-title">How We Work</span>
      <h2 className="section-heading">About Our NGO Information</h2>
      <p className="section-text">
        Tempus iaculis urna id volutpat lacus laoreet non curabitur. Suspendisse in est ante in consectetur a erat nam at lectus urna duis convallis.
      </p>
      <div className="info-container">
        <div className="info-card">
          <span className="icon"><FaHandsHelping /></span>
          <h3>Volunteer</h3>
          <p>Volutpat maecenas volutpat lorem dumy erat velit. Blandit massa enim nec dui nunc mattis enim ut tellus. Imperdiet proin</p>
        </div>
        <div className="info-card">
          <span className="icon"><FaHandHoldingHeart /></span>
          <h3>Fundraise</h3>
          <p>Volutpat maecenas volutpat lorem dumy erat velit. Blandit massa enim nec dui nunc mattis enim ut tellus. Imperdiet proin</p>
        </div>
        <div className="info-card">
          <span className="icon"><FaDonate /></span>
          <h3>Donation</h3>
          <p>Volutpat maecenas volutpat lorem dumy erat velit. Blandit massa enim nec dui nunc mattis enim ut tellus. Imperdiet proin</p>
        </div>
      </div>
    </section>

      <FixedImage/>

      <section className="get-involved">
  <h2>Get Involved</h2>
  <span>
    Becoming a member of a Non-Governmental Organization (NGO) offers numerous personal and professional benefits. Here's why you should consider joining:
  </span>

  <div className="benefits-container">
    <div className="benefit-card">
      <h3>Networking Opportunities</h3>
      <p>Membership provides access to a diverse network of professionals, activists, and community leaders, fostering collaborations and partnerships.</p>
    </div>
    <div className="benefit-card">
      <h3>Personal Fulfillment</h3>
      <p>Contributing to meaningful causes brings a sense of accomplishment and purpose, enhancing personal satisfaction.</p>
    </div>
    <div className="benefit-card">
      <h3>Skill Development</h3>
      <p>Engaging in NGO activities hones various skills, including project management, leadership, and communication.</p>
    </div>
    <div className="benefit-card">
      <h3>Professional Growth</h3>
      <p>Active involvement can lead to career advancement opportunities within the organization or the broader non-profit sector.</p>
    </div>
    <div className="benefit-card">
      <h3>Access to Resources</h3>
      <p>Members often receive exclusive access to research materials, training sessions, and workshops, enhancing their knowledge base.</p>
    </div>
    <div className="benefit-card">
      <h3>Advocacy and Influence</h3>
      <p>Membership offers a platform to advocate for issues you are passionate about, influencing policy and societal change.</p>
    </div>
    <div className="benefit-card">
      <h3>Community Engagement</h3>
      <p>Being part of an NGO connects you with like-minded individuals, fostering a sense of community and shared purpose.</p>
    </div>
    {/* <div className="benefit-card">
      <h3>Learning Opportunities</h3>
      <p>Exposure to diverse challenges and solutions promotes continuous learning and personal development.</p>
    </div> */}
    <div className="benefit-card">
      <h3>Recognition and Credibility</h3>
      <p>Active members are often recognized for their contributions, enhancing their credibility in the sector.</p>
    </div>
    <div className="benefit-card">
      <h3>Contribution to Social Impact</h3>
      <p>Your involvement directly contributes to positive societal changes, addressing pressing issues and improving lives.</p>
    </div>
  </div>


        <button className="member-btn" onClick={() => setShowForm(true)}>Become a Member</button>

        {showForm && (
          <div className="popup">
            <div className="popup-content">
              <span className="close" onClick={() => setShowForm(false)}>&times;</span>
              {isLogin ? (
                <>
                  <h3>Login</h3>
                  <form onSubmit={handleLogin}>
                    <input type="email" name="email" placeholder="Email" onChange={handleLoginChange} required />
                    <input type="password" name="password" placeholder="Password" onChange={handleLoginChange} required />
                    <button type="submit">Login</button>
                  </form>
                  <p onClick={() => setIsLogin(false)}>Don't have an account? Register here</p>
                </>
              ) : (
                <>
                  <h3>Become a Member</h3>
                  <form className="scrollable-form">
                    <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} required />
                    <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                    <input type="text" name="father_name" placeholder="Father's Name" onChange={handleChange} required />
                    <input type="date" name="birth_date" onChange={handleChange} required />
                    <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
                    <input type="text" name="qualification" placeholder="Qualification" onChange={handleChange} required />
                    <input type="file" name="passport_photo" accept="image/*" onChange={handleChange} required />
                    <button type="submit">Submit</button>
                  </form>
                  <p onClick={() => setIsLogin(true)}>Already have an account? Login here</p>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Extra Contant */}
      <section className="extra-content">
        <h2>About Our Work</h2>
        <p>
          We are dedicated to making a difference in the community. Our team works on multiple social initiatives to uplift underprivileged groups.
        </p>
        <img src={DemoImage} alt="Demo Work" className="demo-image" />
      </section>

      
    </div>
  );
};

export default Home;
