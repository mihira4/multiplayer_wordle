import { useState } from "react";
import axios from "axios";
import "./Auth.css";
import { BASE_URL } from "../helper.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./store/storetoken";
// import Register from "./Register";
// import Register from "./Register";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ emailid: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const { storeTokeninLS } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.emailid || !formData.password) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        storeTokeninLS(response.data.token);
        navigate("/Home");
        navigate("/Home");
      } else {
        alert("Login not successful! Try again");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <p className="error-message">{error}</p>}

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


        <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>

        <p className="redirect-text">
          Don't have an account? <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
