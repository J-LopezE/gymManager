import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import { useContext } from "react";
import { Context } from "../store/appContext";
import Gym from "../../img/gym.png"; // Import the image

const Dashboard = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const homeBackgroundStyle = {
    backgroundImage: `url(${Gym})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100%",
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/login");
      return;
    }
  }, []);

  return (
    <div style={homeBackgroundStyle} className="text-center">
      <div className="dashboard">
        <div className="container">
          <div className="top-section">
            <div className="card mt-5">
              <h3>Miembros Activos</h3>
              <p>20</p>
            </div>
            <div className="card mt-5">
              <h3>Miembros Inactivos</h3>
              <p>2</p>
            </div>
          </div>
          <div className="bottom-section mt-5">
            <h3>Membresías próximas a vencer</h3>
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Miembro 1
                <span className="badge bg-danger">Próxima a vencer</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Miembro 2
                <span className="badge bg-danger">Próxima a vencer</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Miembro 3
                <span className="badge bg-danger">Próxima a vencer</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Miembro 4
                <span className="badge bg-danger">Próxima a vencer</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
