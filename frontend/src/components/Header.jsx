import React from "react";
import logo from "../assets/logo_wordleV.png"; // adjust path as needed
import "./Header.css"; // optional CSS file

const Header = () => {
  return (
    <header className="app-header">
      <img src={logo} alt="Wordle Logo" className="header-logo" />
    </header>
  );
};

export default Header;
