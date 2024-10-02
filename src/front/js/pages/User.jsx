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

export const Users = () => {
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

  const getuserStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    end.setHours(23, 59, 59, 999);

    console.log(today);
    console.log(start);
    console.log(end);

    if (today >= start && today <= end) {
      return "Activo";
    } else {
      return "Inactivo";
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
    actions.getMe();
    actions.getUsers();
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
                <th>Rol</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {store.users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.user_name}</td>
                  <td>{user.rol}</td>
                  <td>
                    <button
                      type="button"
                      onClick={(e) => deleteuser(user.id)}
                      className="btn btn-danger me-5"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
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
