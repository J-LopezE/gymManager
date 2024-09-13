import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import Gym from "../../img/gym.png"; // Import the image
import { CreateMembers } from "../component/CreateMembers.jsx";
import { EditMembers } from "../component/EditMembers.jsx";
import "../../styles/tables.css";
import Table from "react-bootstrap/Table";
import { jwtDecode } from "jwt-decode";
export const Members = () => {
  const homeBackgroundStyle = {
    backgroundImage: `url(${Gym})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100%",
  };
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const getTokenInfo = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      return decodedToken.sub.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/login");
    }
    const userId = getTokenInfo(); // Obtener ID del usuario

    if (userId) {
      actions.getUserMembers(userId); // Pasar el ID del usuario a la función
    }
  }, []);
  return (
    <div
      style={homeBackgroundStyle}
      className="text-center d-flex align-items-center justify-content-center"
    >
      <div className="members-container">
        <div className="create-members-container">
          <CreateMembers />
        </div>

        {/* Tabla */}
        <div className="table-container">
          <Table striped bordered hover variant="dark" className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Membresía</th>
                <th>Estado</th>
                <th colSpan={2}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {store.userMembers.map((member) => (
                <tr key={member.id}>
                  <td>{member.id + 1}</td>
                  <td>{member.name}</td>
                  <td>{member.last_name}</td>
                  <td>{member.membership || "N/A"}</td>
                  <td>{member.status || "N/A"}</td>
                  <td>
                    <button type="button" className="btn btn-danger me-5">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <EditMembers member={member} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};
