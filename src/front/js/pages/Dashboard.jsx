import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import { Context } from "../store/appContext";
import Gym from "../../img/gym.png"; // Import the image
import useTokenExpiration from "../../../hooks/useTokenExpiration.jsx";

import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

const Dashboard = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  useTokenExpiration();

  const homeBackgroundStyle = {
    backgroundImage: `url(${Gym})`, // Corregido con backticks
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100%",
    width: "100%",
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/login");
      return;
    }
    actions.getMe();
    actions.getAllMembers();
    actions.getAllMemberships();
  }, []);

  const isMembershipActive = (endDate) => {
    const currentDate = new Date();
    const memberEndDate = new Date(endDate);
    return memberEndDate > currentDate; // Devuelve true si la membresía está activa
  };

  const getActiveMembers = () => {
    return store.members
      ? store.members.filter((member) => isMembershipActive(member.end_date))
      : [];
  };

  const getExpiredMembers = () => {
    return store.members
      ? store.members.filter((member) => !isMembershipActive(member.end_date))
      : [];
  };

  const getRemainingDays = (endDate) => {
    const currentDate = new Date();
    const memberEndDate = new Date(endDate);
    const timeDifference = memberEndDate - currentDate;
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  };

  return (
    <div style={homeBackgroundStyle} className="text-center">
      <div className="dashboard">
        <div className="container">
          <div className="row container-graficas m-3 p-3">
            <div className="col col-md-4 container m-auto">
              <h1 className="text-white">Miembros</h1>
              <Doughnut
                data={{
                  labels: store.memberships.map(
                    (membership) => membership.type
                  ),
                  datasets: [
                    {
                      data: store.memberships.map(
                        (membership) => membership.members.length
                      ),
                      backgroundColor: [
                        "rgba(43,63,229,0.8)",
                        "rgba(250,192,19,0.8)",
                        "rgba(253,135,135,0.8)",
                      ],
                    },
                  ],
                }}
              />
            </div>
            <div className="col col-md-4 container m-auto">
              <h1 className="text-white">Estado</h1>
              <Doughnut
                data={{
                  labels: ["Activa", "Vencida"],
                  datasets: [
                    {
                      data: [
                        getActiveMembers().length,
                        getExpiredMembers().length,
                      ],
                      backgroundColor: [
                        "rgba(43,63,229,0.8)",
                        "rgba(253,135,135,0.8)",
                      ],
                    },
                  ],
                }}
              />
            </div>
          </div>

          {/* Tabla de Miembros Activos */}
          <div className="mb-4 mt-5">
            <h5 className="text-white">Membresías Activas</h5>
            <div className="table-container-dashboard">
              <table className="table table-dark table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nombres y Apellidos</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Inicio</th>
                    <th scope="col">Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {getActiveMembers().length > 0 ? (
                    getActiveMembers().map((member, index) => {
                      const daysRemaining = getRemainingDays(member.end_date);
                      return (
                        <tr key={`${member.id}-${index}`}>
                          <th scope="row">{index + 1}</th>
                          <td>
                            {member.name} {member.last_name}
                          </td>
                          <td>Activa</td>
                          <td>{member.start_date}</td>
                          <td>
                            {member.end_date}
                            {daysRemaining <= 5 && daysRemaining > 0 && (
                              <span> (quedan {daysRemaining} días)</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5">No hay membresías activas.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabla de membresías Vencidos */}
          <div className="mb-4 mt-5">
            <h5 className="text-white">Membresías Vencidas</h5>
            <div className="table-container-dashboard">
              <table className="table table-dark table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nombres y Apellidos</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Inicio</th>
                    <th scope="col">Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {getExpiredMembers().length > 0 ? (
                    getExpiredMembers().map((member, index) => {
                      return (
                        <tr key={`${member.id}-${index}`}>
                          <th scope="row">{index + 1}</th>
                          <td>
                            {member.name} {member.last_name}
                          </td>
                          <td className="text-muted">Vencida</td>
                          <td>{member.start_date}</td>
                          <td
                            className={
                              new Date(member.end_date) > new Date()
                                ? ""
                                : "text-danger"
                            }
                          >
                            {member.end_date}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5">No hay membresías vencidas.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabla General */}
          <div className="table-container-dashboard">
            <h5 className="text-white">Todas las Membresías</h5>
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nombres y Apellidos</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Inicio</th>
                  <th scope="col">Fin</th>
                </tr>
              </thead>
              <tbody>
                {store.members && store.members.length > 0 ? (
                  store.members.map((member, index) => {
                    const isActive = isMembershipActive(member.end_date);
                    return (
                      <tr key={`${member.id}-${index}`}>
                        <th scope="row">{index + 1}</th>
                        <td>
                          {member.name} {member.last_name}
                        </td>
                        <td className={isActive ? "" : "text-muted"}>
                          {isActive ? "Activa" : "Vencida"}
                        </td>
                        <td>{member.start_date}</td>
                        <td
                          className={
                            new Date(member.end_date) > new Date()
                              ? ""
                              : "text-danger"
                          }
                        >
                          {member.end_date}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5">No hay membresías.</td>
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
