import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import { Context } from "../store/appContext";
import Gym from "../../img/gym.png"; // Import the image

const Dashboard = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const homeBackgroundStyle = {
    backgroundImage: `url(${Gym})`, // Corregido con backticks
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
    actions.getAllMemberships();
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
          {/* Tabla de Miembros Activos */}
          <div className="mb-4 mt-5">
            <h5 className="text-white">Miembros Activos</h5>
            <div className="table-container-dashboard">
              <table className="table table-dark table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Miembros</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {getActiveMembers().length > 0 ? (
                    getActiveMembers().map((member, index) => (
                      <tr key={member.id}>
                        <th scope="row">{index + 1}</th>
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
                      <td colSpan="4">No hay miembros activos.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabla de Miembros Inactivos */}
          <div className="mb-4 mt-5">
            <h5 className="text-white">Miembros Inactivos</h5>
            <div className="table-container-dashboard">
              <table className="table table-dark table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Miembros</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {getInactiveMembers().length > 0 ? (
                    getInactiveMembers().map((member, index) => (
                      <tr key={member.id}>
                        <th scope="row">{index + 1}</th>
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
                      <td colSpan="4">No hay miembros inactivos.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabla General */}
          <div className="table-container-dashboard">
            <h5 className="text-white">Todos los Miembros</h5>
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Miembros</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {store.members && store.members.length > 0 ? (
                  store.members.map((member, index) => (
                    <tr key={member.id}>
                      <th scope="row">{index + 1}</th>
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
