import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/sideBar.css";
import Logo from "../../img/logo.png";
import DefaultUserImage from "../../img/user.jpg";

const SideBar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const user = store.me;
  const jwt = localStorage.getItem("token");

  const Logout = () => {
    actions.logout();
    navigate("/login");
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <img className="logo" src={Logo} alt="Logo" />
        <ul className="sidebar-menu">
          <li className="mb-4">
            <button className="sidebar-button" onClick={() => navigate("/")}>
              <i className="fas fa-tachometer-alt "></i>
              <span className="sidebar-tooltip">Dashboard</span>
            </button>
          </li>
          <li className="mb-4">
            <button
              className="sidebar-button"
              onClick={() => navigate("/members")}
            >
              <i className="fas fa-users"></i>
              <span className="sidebar-tooltip">Miembros</span>
            </button>
          </li>
          <li className="mb-4">
            <button
              className="sidebar-button"
              onClick={() => navigate("/membership")}
            >
              <i className="fas fa-clipboard-list"></i>
              <span className="sidebar-tooltip">Membresías</span>
            </button>
          </li>
          <li className="mb-4">
            <button
              className="sidebar-button"
              onClick={() => navigate("/users")}
            >
              <i className="fas fa-user-plus"></i>
              <span className="sidebar-tooltip">Usuarios</span>
            </button>
          </li>
        </ul>
        <div className={!jwt ? "d-none" : "user-section"}>
          <button className="user-button">
            <img
              src={user ? user.profile_img_url : DefaultUserImage}
              alt="User"
              className="user-image"
            />
            <span className="user-name">
              {user ? user.user_name : "Jhon Doe"}
            </span>
          </button>
          <button className="btn-session" onClick={() => Logout()}>
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
