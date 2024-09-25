import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import useTokenExpiration from "../../../hooks/useTokenExpiration.jsx";
import Gym from "../../img/gym.png";
import { EditMembership } from "../component/EditMembership.jsx";
import "../../styles/subscription.css";
import Table from "react-bootstrap/Table";
import "../../styles/tables.css";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { CreateMemberships } from "../component/CreateMembership.jsx";

export const Membership = () => {
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

  const deleteMembership = (id) => {
    Swal.fire({
      title: "Advertencia",
      text: "¿Desea eliminar la membresía?",
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
        actions.delete_membership(id);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Membresía eliminada correctamente",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            container: "custom-container",
          },
          background: "rgba(0, 0, 0, 0.7)",
          color: "#fff",
        });
        actions.getAllMemberships();
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
    actions.getAllMemberships();
  }, []);

  return (
    <div
      style={homeBackgroundStyle}
      className="text-center d-flex align-items-center justify-content-center"
    >
      <div className="members-container">
        <div className="table-container mx-auto">
          <div className="create-members-container d-flex float-end">
            <CreateMemberships />
          </div>
          <div className="create-members-container d-flex float-end"></div>

          <Table striped bordered hover variant="dark" className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Miembro</th>
                <th>Tipo</th>
                <th>Fecha Inicio</th>
                <th>Fecha Final</th>
                <th colSpan={2}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {store.memberships.map((membership) => (
                <tr key={membership.id}>
                  <td>{membership.id}</td>
                  <td>
                    <a href="">{membership.member_id}</a>
                  </td>
                  <td>{membership.type}</td>
                  <td>{membership.start_date}</td>
                  <td>{membership.end_date}</td>

                  <td>
                    <button
                      type="button"
                      onClick={(e) => deleteMembership(membership.id)}
                      className="btn btn-danger me-5"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <EditMembership membership={membership} />
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
