import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import useTokenExpiration from "../../../hooks/useTokenExpiration.jsx";
import Gym from "../../img/gym.png"; // Import the image
import "../../styles/subscription.css";
import Table from "react-bootstrap/Table";
import "../../styles/tables.css";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

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

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/login");
    }
    const userId = getTokenInfo();

    if (userId) {
      actions.getAllMemberships();
    }
  }, []);

  return (
    <div
      style={homeBackgroundStyle}
      className="text-center d-flex align-items-center justify-content-center"
    >
      <div className="members-container">
        <div className="table-container mx-auto">
          <div className="create-members-container d-flex float-end"></div>

          <Table striped bordered hover variant="dark" className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tipo</th>
                <th>Fecha Inicio</th>
                <th>Fecha Final</th>
                <th colSpan={2}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {store.memberships.map((membership) => (
                <tr key={membership.id}>
                  <td>{membership.id + 1}</td>
                  <td>{membership.type}</td>
                  <td>{membership.start_date}</td>
                  <td>{membership.end_date}</td>

                  <td>
                    <button
                      type="button"
                      onClick={(e) => deleteMember(member.id)}
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
