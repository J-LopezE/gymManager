import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/sideBar.css";
import Logo from "../../img/logo.png";
import DefaultUserImage from "../../img/user.jpg";

const SideBar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar text-center mt-5">
      <img
        className="m-4"
        src={Logo}
        alt="Logo"
        style={{ width: "180px", height: "auto" }}
      />
      <ul>
        <li>
          <button
            className="sidebar-button m-2 mt-3"
            onClick={() => navigate("/")}
          >
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </button>
        </li>
        <li>
          <button
            className="sidebar-button m-2 mt-3"
            onClick={() => navigate("/members")}
          >
            <i className="fas fa-users"></i> Lista de Miembros
          </button>
        </li>
        <li>
          <button
            className="sidebar-button m-2 mt-3"
            onClick={() => navigate("/services")}
          >
            <i className="fas fa-clipboard-list"></i> Membresías
          </button>
        </li>
        <li>
          <button
            className="sidebar-button m-2 mt-3"
            onClick={() => navigate("/contact")}
          >
            <i className="fas fa-user-plus"></i> Agregar Usuarios
          </button>
        </li>
      </ul>
      <div className="user-section">
        <button className="user-button">
          <img src={DefaultUserImage} alt="User" className="user-image" />
          <span className="user-name text-light">John Doe</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
