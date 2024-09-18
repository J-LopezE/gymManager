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

  const getMembershipStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    end.setHours(23, 59, 59, 999);

    if (today >= start && today <= end) {
      return "Activo";
    } else {
      return "Inactivo";
    }
  };

  const getActiveMembersCount = () => {
    return store.members
      ? store.members.filter((member) =>
          member.memberships.some(
            (subscription) =>
              getMembershipStatus(
                subscription.start_date,
                subscription.end_date
              ) === "Activo"
          )
        ).length
      : 0;
  };

  const getInactiveMembersCount = () => {
    return store.members
      ? store.members.filter((member) =>
          member.memberships.every(
            (subscription) =>
              getMembershipStatus(
                subscription.start_date,
                subscription.end_date
              ) === "Inactivo"
          )
        ).length
      : 0;
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
                  <p className="card-text">{getActiveMembersCount()}</p>
                </div>
              </div>

              <div className="card text-white bg-dark mb-3 mt-5">
                <div className="card-body">
                  <h5 className="card-title">Miembros Inactivos</h5>
                  <p className="card-text">{getInactiveMembersCount()}</p>
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
                  <th scope="col">Membresías Próximas en Terminar</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {store.members && store.members.length > 0 ? (
                  store.members.map((member) => (
                    <tr key={member.id}>
                      <th scope="row">{member.id}</th>
                      <td>{member.name}</td>
                      <td>
                        {member.memberships.map((subscription) => (
                          <div key={subscription.id}>
                            {getMembershipStatus(
                              subscription.start_date,
                              subscription.end_date
                            )}
                          </div>
                        ))}
                      </td>
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
                    <td colSpan="4">No hay miembros.</td>
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
