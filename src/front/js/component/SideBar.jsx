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

  const Logout = () => {
    actions.logout();
    navigate("/login");
  };

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
            <i className="fas fa-users"></i> Miembros
          </button>
        </li>
        <li>
          <button
            className="sidebar-button m-2 mt-3"
            onClick={() => navigate("/subscription")}
          >
            <i className="fas fa-clipboard-list"></i> Membresías
          </button>
        </li>
        <li>
          <button
            className="sidebar-button m-2 mt-3"
            onClick={() => navigate("/users")}
          >
            <i className="fas fa-user-plus"></i> Usuarios
          </button>
        </li>
      </ul>
      <div className={user ? "d-flex user-section" : "d-none"}>
        <button className="user-button">
          <img
            src={user ? user.profile_img_url : DefaultUserImage}
            alt="User"
            className="user-image"
          />
          <span className="user-name text-light">
            {user ? user.user_name : "Jhon Doe"}
          </span>
        </button>
        <button className="rounded p-2 m-3" onClick={() => Logout()}>
          cerrar sesion
        </button>
      </div>
    </div>
  );
};

export default SideBar;
