import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";
// import "../../styles/formMembers.css";

export const FormMembership = ({
  id,
  btnMembership,
  membership: initialMembership,
}) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [membership, setMembership] = useState({
    type: "",
    start_date: "",
    end_date: "",
    member_id: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setMembership({ ...membership, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Cargando...",
      text: id
        ? "Por favor, espere mientras se edita la membresía."
        : "Por favor, espere mientras se crea la membresía.",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        container: "custom-container",
        popup: "custom-popup",
        title: "custom-title",
        content: "custom-content",
        confirmButton: "custom-confirm-button",
      },
      background: "rgba(0, 0, 0, 0.7)",
      color: "#fff",
    });
    try {
      const response = id
        ? await actions.editMembership(
            id,
            membership.type,
            membership.start_date,
            membership.end_date,
            membership.member_id
          )
        : await actions.add_membership(
            membership.type,
            membership.start_date,
            membership.end_date,
            membership.member_id
          );

      //   actions.getAllMemberships();
      Swal.fire({
        position: "center",
        icon: "success",
        title: id ? "Membresía Editada" : "Membresía creada correctamente",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: "custom-container",
          popup: "custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "custom-confirm-button",
        },
        background: "rgba(0, 0, 0, 0.7)",
        color: "#fff",
      }).then(() => {});
      if (!id) {
        setMembership({
          type: "",
          start_date: "",
          end_date: "",
          member_id: "",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Hubo un problema: ${error.message}`,
        customClass: {
          container: "custom-container",
          popup: "custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "custom-confirm-button",
        },
        background: "rgba(0, 0, 0, 0.7)",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/login");
      return;
    }
    if (initialMembership) {
      setMembership({
        type: initialMembership.type || "",
        start_date: initialMembership.start_date || "",
        end_date: initialMembership.end_date || "",
        member_id: initialMembership.member_id || "",
      });
    }
  }, [initialMembership, navigate]);

  return (
    <div className="form-members-container">
      <form className="form-members-form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <select
              className="form-members-select"
              id="type"
              name="type"
              value={membership.type}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un tipo</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="date"
              className="form-members-input"
              id="start_date"
              value={membership.start_date}
              name="start_date"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-3">
            <input
              type="date"
              className="form-members-input"
              id="end_date"
              value={membership.end_date}
              name="end_date"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="">
          <button type="submit" className="form-members-submit">
            {btnMembership}
          </button>
        </div>
      </form>
    </div>
  );
};