"use client";

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "./Header.jsx";
import "./register-page.css";
import { BASE_URL } from "../../helper";
import { useAuth } from "../store/storetoken";
import { initializeSocket, updateSocketToken, getSocket } from "../store/socket.jsx";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    emailid: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { storeTokeninLS } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.emailid || !formData.password) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        storeTokeninLS(response.data.token);
        
        if (!getSocket()) {
          initializeSocket(token); // Initialize the socket for the first time
        } else {
          updateSocketToken(token); // Update the token if socket already exists
        } 

        navigate("/Home");
      } else {
        alert("Registration failed! Try again");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Header /> 
      <div className="register-card">
        <div className="register-header">
          
          <p className="register-description">Create your account to start playing</p>
        </div>

        <div className="register-content">
          <form onSubmit={handleSubmit} className="register-form">
            {error && <p className="error-message">{error}</p>}

            <div className="input-group">
              <label htmlFor="username" className="input-label">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="emailid" className="input-label">Email</label>
              <input
                id="emailid"
                name="emailid"
                type="email"
                placeholder="Enter your email"
                value={formData.emailid}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">Password</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <div className="register-links">
            <p className="link-text">
              Already have an account?{" "}
              <span className="register-link" onClick={() => navigate("/")}>
                Sign in
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
