import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import useTokenExpiration from "../../../hooks/useTokenExpiration.jsx";
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
  useTokenExpiration();
  const getTokenInfo = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.sub.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const deleteMember = (id) => {
    actions.delete_member(id);
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/login");
    }
    const userId = getTokenInfo(); // Obtener ID del usuario

    if (userId) {
      actions.getAllMembers();
    }
  }, []);
  return (
    <div
      style={homeBackgroundStyle}
      className="text-center d-flex align-items-center justify-content-center"
    >
      <div className="members-container">
        {/* Tabla */}
        <div className="table-container mx-auto">
          <div className="create-members-container d-flex float-end">
            <CreateMembers />
          </div>

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
              {store.members.map((member) => (
                <tr key={member.id}>
                  <td>{member.id + 1}</td>
                  <td>{member.name}</td>
                  <td>{member.last_name}</td>
                  <td>{member.membership || "N/A"}</td>
                  <td>{member.status || "N/A"}</td>
                  <td>
                    <button
                      type="button"
                      onClick={(e) => deleteMember(member.id)}
                      className="btn btn-danger me-5"
                    >
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
