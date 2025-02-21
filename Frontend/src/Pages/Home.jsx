import "../Styles/Home.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Slide1 from "../assets/Slide1.jpg";
import Slide2 from "../assets/Slide2.png";
import Slide3 from "../assets/Slide3.jpg";
import DemoImage from "../assets/demo.png";

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
    console.log("Attempting login with:", loginData);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", loginData);
      if (response.status === 200) {
        toast.success("Login Successful!");
        navigate("/status");
      } else {
        toast.error("Login failed, please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data);
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
      console.error("Payment error:", error.response?.data || error.message);
      toast.error("Payment failed. Try again.");
    }
  };

  return (
    <div className="home">
      <ToastContainer position="top-right" autoClose={3000} />

      <header className="hero">
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide}
              alt={`Slide ${index + 1}`}
              className={index === currentSlide ? "active" : ""}
            />
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

      <section className="get-involved">
        <h2>Get Involved</h2>
        <button className="member-btn" onClick={() => setShowForm(true)}>
          Become a Member
        </button>

        {showForm && (
          <div className="popup">
            <div className="popup-content">
              <span className="close" onClick={() => setShowForm(false)}>
                &times;
              </span>
              {isLogin ? (
                <>
                  <h3>Login</h3>
                  <form onSubmit={handleLogin}>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={handleLoginChange}
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      onChange={handleLoginChange}
                      required
                    />
                    <button type="submit">Login</button>
                  </form>
                  <p onClick={() => setIsLogin(false)}>
                    Don't have an account? Register here
                  </p>
                </>
              ) : (
                <>
                  <h3>Become a Member</h3>
                  <form onSubmit={handleRegister} className="scrollable-form">
                    <input
                      type="text"
                      name="first_name"
                      placeholder="First Name"
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Last Name"
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone"
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="father_name"
                      placeholder="Father's Name"
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="date"
                      name="birth_date"
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="qualification"
                      placeholder="Qualification"
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="file"
                      name="passport_photo"
                      accept="image/*"
                      onChange={handleChange}
                      required
                    />
                    <button type="submit">Submit</button>
                  </form>
                  <p onClick={() => setIsLogin(true)}>
                    Already have an account? Login here
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </section>

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
