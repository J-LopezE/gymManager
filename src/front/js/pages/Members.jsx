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
import Swal from "sweetalert2";
import { CreateMemberships } from "../component/CreateMembership.jsx";

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
    Swal.fire({
      title: "Advertencia",
      text: "¿Desea eliminar al miembro?",
      position: "center",
      icon: "error",
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Si",
      customClass: {
        container: "custom-container",
      },
      background: "rgba(0, 0, 0, 0.7)",
      color: "#fff",
    }).then((click) => {
      if (click.isConfirmed) {
        actions.delete_member(id);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Miembro eliminado correctamente",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            container: "custom-container",
          },
          background: "rgba(0, 0, 0, 0.7)",
          color: "#fff",
        });
      } else {
        return;
      }
    });
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/login");
    }
    const userId = getTokenInfo();

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
                  <td>{member.id}</td>
                  <td>{member.name}</td>
                  <td>{member.last_name}</td>
                  <td>
                    {member.memberships.length ? (
                      member.memberships.map((suscription) => (
                        <>
                          <p>Tipo: {suscription.type}</p>
                          <p>Inicio: {suscription.start_date}</p>
                          <p>Fin: {suscription.start_date}</p>
                        </>
                      ))
                    ) : (
                      <CreateMemberships member={member} />
                    )}
                  </td>
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
