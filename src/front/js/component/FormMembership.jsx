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
    price: "",
    time: "",
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
            membership.price,
            membership.time,
            membership.member_id
          )
        : await actions.add_membership(
            membership.type,
            membership.price,
            membership.time,
            membership.member_id
          );
      console.log(id);
      actions.getAllMemberships();
      actions.getAllMembers();
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
          price: "",
          time: "",
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
        price: initialMembership.price || "",
        time: initialMembership.time || "",
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
              <option value="">Selecciona una Membesía</option>
              <option value="Basica">Basica</option>
              <option value="Estandar">Estandar</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-members-input"
              id="price"
              value={membership.price}
              name="price"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-3">
            <input
              type="text"
              className="form-members-input"
              id="time"
              value={membership.time}
              name="time"
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
