import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Gym from "../../img/gym.png"; // Import the image
import { CreateMembers } from "../component/CreateMembers.jsx";
import { EditMembers } from "../component/EditMembers.jsx";
import "../../styles/tables.css";
import Table from "react-bootstrap/Table";

export const Members = () => {
  const homeBackgroundStyle = {
    backgroundImage: `url(${Gym})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100%",
  };
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/login");
    }
  });
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
              <tr>
                <td>1</td>
                <td>Jorge</td>
                <td>López</td>
                <td>Premium</td>
                <td>Activo</td>
                <td colSpan={2}>
                  <button type="button" class="btn btn-danger me-5">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <EditMembers />
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                <td>Inactivo</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>3</td>
                <td colSpan={2}>Larry the Bird</td>
                <td>@twitter</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};
