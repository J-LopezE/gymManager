import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
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
    actions.getAllMembers();
  }, []);

  // Filtra miembros activos
  const getActiveMembers = () => {
    return store.members
      ? store.members.filter((member) => member.status === "activo")
      : [];
  };

  // Filtra miembros inactivos
  const getInactiveMembers = () => {
    return store.members
      ? store.members.filter((member) => member.status === "inactivo")
      : [];
  };

  return (
    <div style={homeBackgroundStyle} className="text-center">
      <div className="dashboard">
        <div className="container">
          {/* Sección de Tarjetas de Estadísticas */}
          <div className="statistics-section mb-4">
            <div className="card-container">
              <div className="card text-white bg-dark mb-3 mt-5">
                <div className="card-body">
                  <h5 className="card-title">Miembros Activos</h5>
                  <p className="card-text">{getActiveMembers().length}</p>
                  <ul className="list-unstyled">
                    {getActiveMembers().length > 0 ? (
                      getActiveMembers().map((member, index) => (
                        <li key={member.id + index}>
                          {member.id}. {member.name}
                        </li>
                      ))
                    ) : (
                      <li>No hay miembros activos.</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="card text-white bg-dark mb-3 mt-5">
                <div className="card-body">
                  <h5 className="card-title">Miembros Inactivos</h5>
                  <p className="card-text">{getInactiveMembers().length}</p>
                  <ul className="list-unstyled">
                    {getInactiveMembers().length > 0 ? (
                      getInactiveMembers().map((member, index) => (
                        <li key={member.id + index}>
                          {index.id}. {member.name}
                        </li>
                      ))
                    ) : (
                      <li>No hay miembros inactivos.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="table-container-dashboard">
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Miembros</th>
                  <th scope="col">Membresías Proximas en Terminar</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {store.members && store.members.length > 0 ? (
                  store.members.map((member, index) => (
                    <tr key={member.id + index}>
                      <th scope="row">{member.id}</th>
                      <td>{member.name}</td>
                      <td>{member.status}</td>
                      <td>
                        <button className="btn btn-danger btn-sm mx-1">
                          <i className="fas fa-trash-alt"></i>
                        </button>
                        <button className="btn btn-primary btn-sm mx-1">
                          <i className="fas fa-edit"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No hay membresías próximas a vencer.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
