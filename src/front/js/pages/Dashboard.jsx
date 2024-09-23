import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import { Context } from "../store/appContext";
import Gym from "../../img/gym.png"; // Imagen de fondo

const Dashboard = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Estado de carga
  const [warnings, setWarnings] = useState([]); // Estado para almacenar advertencias de miembros

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
    actions.getAllMembers().finally(() => setLoading(false));
  }, [actions.getAllMembers, navigate]);

  // Función para calcular el estado de una membresía
  const getMembershipStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return today >= start && today <= end ? "Activo" : "Inactivo";
  };

  // Función para calcular el progreso restante de la membresía (al revés)
  const calculateMembershipProgress = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Duración total en milisegundos
    const totalDuration = end - start;

    // Tiempo restante en milisegundos
    const timeRemaining = end - today;

    // Calcula el porcentaje restante de la membresía
    const progress = (timeRemaining / totalDuration) * 100;

    // Asegura que el valor esté entre 0 y 100
    return Math.min(Math.max(progress, 0), 100);
  };

  // Función para definir el color de la barra de progreso según el progreso restante
  const getProgressBarColor = (progress) => {
    if (progress > 50) return "bg-success"; // Verde si queda más del 50% del tiempo
    if (progress > 25) return "bg-warning"; // Amarillo si queda entre 50% y 25%
    return "bg-danger"; // Rojo si queda menos del 25% del tiempo
  };

  // Función para obtener la fecha más cercana de expiración de las membresías de un miembro
  const getClosestMembershipEndDate = (memberships) => {
    const activeMemberships = memberships.filter((subscription) => {
      return (
        getMembershipStatus(subscription.start_date, subscription.end_date) ===
        "Activo"
      );
    });

    const closestMembership = activeMemberships.reduce((closest, current) => {
      const currentEnd = new Date(current.end_date);
      return !closest || currentEnd < new Date(closest.end_date)
        ? current
        : closest;
    }, null);

    return closestMembership ? new Date(closestMembership.end_date) : null;
  };

  // Función para verificar si faltan 5 días o menos para la caducidad
  const checkMembershipExpiry = () => {
    const today = new Date();
    const newWarnings = [];

    store.members.forEach((member) => {
      member.memberships.forEach((subscription) => {
        const endDate = new Date(subscription.end_date);
        const timeDifference = endDate - today;
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Diferencia en días

        if (daysRemaining > 0 && daysRemaining <= 5) {
          newWarnings.push({
            memberName: member.name,
            daysRemaining,
          });
        }
      });
    });

    setWarnings(newWarnings);
  };

  useEffect(() => {
    // Ejecutar la verificación cuando el componente cargue y cada vez que cambien los miembros
    if (!loading) {
      checkMembershipExpiry();
    }
  }, [loading, store.members]);

  // Función para ordenar los miembros por fecha de caducidad más cercana
  const sortedMembers = store.members
    ? [...store.members].sort((a, b) => {
        const closestEndA = getClosestMembershipEndDate(a.memberships);
        const closestEndB = getClosestMembershipEndDate(b.memberships);

        if (!closestEndA) return 1;
        if (!closestEndB) return -1;

        return closestEndA - closestEndB;
      })
    : [];

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
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <>
              {/* Sección de advertencias */}
              {warnings.length > 0 && (
                <div className="alert alert-warning">
                  <strong>Advertencias:</strong>
                  {warnings.map((warning, index) => (
                    <p key={index}>
                      La membresía de <strong>{warning.memberName}</strong>{" "}
                      caduca en <strong>{warning.daysRemaining}</strong> días.
                    </p>
                  ))}
                </div>
              )}

              {/* Sección de estadísticas */}
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

              {/* Tabla con la barra de estado */}
              <div className="table-container-dashboard">
                <table className="table table-dark table-striped">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Miembros</th>
                      <th scope="col">Progreso de la Membresía</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedMembers.length > 0 ? (
                      sortedMembers.map((member) => (
                        <tr key={member.id}>
                          <th scope="row">{member.id}</th>
                          <td>
                            {member.name} {member.last_name}
                          </td>
                          <td>
                            {member.memberships.map((subscription) => {
                              const progress = calculateMembershipProgress(
                                subscription.start_date,
                                subscription.end_date
                              );
                              const progressBarColor =
                                getProgressBarColor(progress);

                              return (
                                <div key={subscription.id}>
                                  <div className="progress">
                                    <div
                                      className={`progress-bar ${progressBarColor}`}
                                      role="progressbar"
                                      style={{ width: `${progress}%` }}
                                      aria-valuenow={progress}
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                    >
                                      {`${Math.floor(progress)}%`}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
