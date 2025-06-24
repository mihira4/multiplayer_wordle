// "use client"
// import logo_wordleverse from "../assets/logo_wordleV.png";
// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import "./LoginPage.css";
// import { BASE_URL } from "../../helper";
// import { useAuth } from "../store/storetoken.jsx";


// export default function LoginPage() {
//   const [formData, setFormData] = useState({ emailid: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const navigate = useNavigate();
//   const { storeTokeninLS } = useAuth();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.emailid || !formData.password) {
//       setError("All fields are required!");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const response = await axios.post(`${BASE_URL}/auth/login`, formData, {
//         headers: { "Content-Type": "application/json" },
//       });

//       if (response.data.success) {
//         storeTokeninLS(response.data.token);
//         navigate("/Home");
//       } else {
//         alert("Login not successful! Try again");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
      
//          <div className="logo-wrapper">
//     <img src={logo_wordleverse} alt="Logo" className="logo-img" />
//   </div>
// <div className="login-card">
//         <div className="login-header">

//           <p className="login-subtitle">Sign in to play with friends</p>
//         </div>

//         <div className="login-content">
//           <form onSubmit={handleSubmit} className="login-form">
//             {error && <p className="error-message">{error}</p>}

//             <div className="form-group">
//               <label htmlFor="emailid" className="form-label">Email</label>
//               <input
//                 id="emailid"
//                 name="emailid"
//                 type="email"
//                 placeholder="Enter your email"
//                 className="form-input"
//                 value={formData.emailid}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="password" className="form-label">Password</label>
//               <div className="password-wrapper">
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   className="form-input"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                 />
//                 <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </span>
//               </div>
//             </div>

//             <button type="submit" className="login-button" disabled={loading}>
//               {loading ? "Logging in..." : "Sign In"}
//             </button>
//           </form>

//           <div className="forgot-password">
//             <a href="/forgot-password" className="forgot-link">
//               Forgot your password?
//             </a>
//           </div>

//           <div className="divider">
//             <span className="divider-line"></span>
//             <span className="divider-text">or</span>
//             <span className="divider-line"></span>
//           </div>

//           <div className="signup-link">
//             {/* <span className="signup-text">Don't have an account? </span> */}
//             <p className="redirect-text">
//             Don't have an account?  <span className="signup-anchor" onClick={() => navigate("/register")}>
//       Sign Up
//     </span>
//           </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import logo_wordleverse from "../assets/logo_wordleV.png";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./LoginPage.css";
import { BASE_URL } from "../../helper";
import { useAuth } from "../store/storetoken.jsx";

export default function LoginPage() {
  const [formData, setFormData] = useState({ emailid: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { storeTokeninLS } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    <div className="login-container">
      {/* Logo above card */}
      <div className="logo-wrapper">
        <img src={logo_wordleverse} alt="Logo" className="logo-img" />
      </div>

      <div className="login-card">
        

        <div className="login-content">
          <form onSubmit={handleSubmit} className="login-form">
            {error && <p className="error-message">{error}</p>}

            <div className="form-group">
              <label htmlFor="emailid" className="form-label">Email</label>
              <input
                id="emailid"
                name="emailid"
                type="email"
                placeholder="Enter your email"
                className="form-input"
                value={formData.emailid}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>

          <div className="forgot-password">
            <a href="/forgot-password" className="forgot-link">
              Forgot your password?
            </a>
          </div>

          <div className="divider">
            <span className="divider-line"></span>
            <span className="divider-text">or</span>
            <span className="divider-line"></span>
          </div>

          <div className="signup-link">
            <p className="redirect-text">
              Don't have an account?{" "}
              <span className="signup-anchor" onClick={() => navigate("/register")}>
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
