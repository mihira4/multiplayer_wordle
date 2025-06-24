import { useState } from "react";
import axios from "axios";
import "./Auth.css";
import { BASE_URL } from "../helper.js";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "./store/storetoken";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    emailid: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();
  const { storeTokeninLS } = useAuth();

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

      console.log(response.data);
      if (response.data.success) {
        storeTokeninLS(response.data.token);
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
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register as Entrepreneur</h2>

        {error && <p className="error-message">{error}</p>}

        <label>Username</label>
        <input type="text" name="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} />

        <label>Email</label>
        <input type="email" name="emailid" placeholder="Enter your email" value={formData.emailid} onChange={handleChange} />

        <label>Password</label>
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="redirect-text">
          Already have an account? <span onClick={() => navigate("/login/entrepreneur")}>Sign In</span>
        </p>
      </form>
    </div>
  );
};

export default Register;
