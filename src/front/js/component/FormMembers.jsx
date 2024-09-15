import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";
import { uploadFile } from "../../../firebase/config";
import "../../styles/formMembers.css";

export const FormMembers = ({ id, btnMember, member: initialMember }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [profile_img_url, setProfile_img_url] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [member, setMember] = useState({
    name: "",
    last_name: "",
    blood_type: "",
    gender: "",
    birthdate: "",
    address: "",
    phone: "",
    emergency_phone: "",
    stature: "",
    weight: "",
    objectives: "",
    payement_type: "",
    refered: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setMember({ ...member, [e.target.name]: e.target.value });
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfile_img_url(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Cargando...",
      text: id
        ? "Por favor, espere mientras se edita al miembro."
        : "Por favor, espere mientras se crea al miembro.",
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
    });
    try {
      let result;
      if (profile_img_url) {
        result = await uploadFile(profile_img_url);
      }
      const response = id
        ? await actions.editMember(
            id,
            member.name,
            member.last_name,
            result,
            member.blood_type,
            member.gender,
            member.birthdate,
            member.address,
            member.phone,
            member.emergency_phone,
            member.stature,
            member.weight,
            member.objectives,
            member.payement_type,
            member.refered
          )
        : await actions.add_member(
            member.name,
            member.last_name,
            result,
            member.blood_type,
            member.gender,
            member.birthdate,
            member.address,
            member.phone,
            member.emergency_phone,
            member.stature,
            member.weight,
            member.objectives,
            member.payement_type,
            member.refered
          );

      actions.getAllMembers();
      Swal.fire({
        position: "center",
        icon: "success",
        title: id ? "Miembro Editado" : "Miembro creado correctamente",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: "custom-container",
          popup: "custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "custom-confirm-button",
        },
      }).then(() => {
        onClose();
      });
      if (!id) {
        setMember({
          name: "",
          last_name: "",
          blood_type: "",
          gender: "",
          birthdate: "",
          address: "",
          phone: "",
          emergency_phone: "",
          stature: "",
          weight: "",
          objectives: "",
          payement_type: "",
          refered: "",
        });
        setImagePreview("");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Hubo un problema: ${error.message}`,
        customClass: {
          container: "swal2-container",
          title: "swal2-title",
          content: "swal2-content",
        },
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
    if (initialMember) {
      setMember({
        name: initialMember.name || "",
        last_name: initialMember.last_name || "",
        blood_type: initialMember.blood_type || "",
        gender: initialMember.gender || "",
        birthdate: initialMember.birthdate || "",
        address: initialMember.address || "",
        phone: initialMember.phone || "",
        emergency_phone: initialMember.emergency_phone || "",
        stature: initialMember.stature || "",
        weight: initialMember.weight || "",
        objectives: initialMember.objectives || "",
        payement_type: initialMember.payement_type || "",
        refered: initialMember.refered || "",
      });
      setImagePreview(initialMember.profile_img_url || "");
    }
  }, [initialMember, navigate]);

  return (
    <div className="form-members-container">
      <form className="form-members-form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-members-input"
              id="name"
              placeholder="Nombre"
              value={member.name}
              name="name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-members-input"
              id="last_name"
              placeholder="Apellido"
              value={member.last_name}
              name="last_name"
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-3">
            <input
              type="date"
              className="form-members-input"
              id="birthdate"
              value={member.birthdate}
              name="birthdate"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="tel"
              className="form-members-input"
              id="phone"
              placeholder="Teléfono"
              value={member.phone}
              name="phone"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="text"
              className="form-members-input"
              id="emergency_phone"
              placeholder="Contacto de Emergencia"
              value={member.emergency_phone}
              name="emergency_phone"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-12 mb-6">
            <input
              type="text"
              className="form-members-input"
              id="address"
              placeholder="Dirección"
              value={member.address}
              name="address"
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-4 mb-3">
            <input
              type="number"
              className="form-members-input"
              id="stature"
              placeholder="Estatura (cm)"
              value={member.stature}
              name="stature"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="number"
              className="form-members-input"
              id="weight"
              placeholder="Peso (kg)"
              value={member.weight}
              name="weight"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="text"
              className="form-members-input"
              id="blood_type"
              placeholder="Tipo de Sangre"
              value={member.blood_type}
              name="blood_type"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-md-6 mb-3">
            <select
              className="form-members-select"
              id="gender"
              name="gender"
              value={member.gender}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un Género</option>
              <option value="female">Femenino</option>
              <option value="male">Masculino</option>
              <option value="other">Otro</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <select
              className="form-members-select"
              id="payement_type"
              name="payement_type"
              value={member.payement_type}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un Método de Pago</option>
              <option value="cash">Efectivo</option>
              <option value="creditCard">Tarjeta de Crédito</option>
              <option value="debitCard">Tarjeta de Débito</option>
              <option value="bankTransfer">Transferencia Bancaria</option>
            </select>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6 mb-3">
            <textarea
              className="form-members-textarea"
              id="objectives"
              rows="3"
              placeholder="Objetivos"
              value={member.objectives}
              name="objectives"
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="col-md-6 mb-2">
            <div className="d-flex flex-column">
              <input
                type="text"
                className="form-members-input"
                id="refered"
                placeholder="Nombre del Referido"
                value={member.refered}
                name="refered"
                onChange={handleChange}
              />
              <input
                id="profile_img_url"
                type="file"
                className="form-members-file mb-2"
                onChange={handleFileChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="image-preview"
                />
              )}
            </div>
          </div>
        </div>
        <div className="">
          <button type="submit" className="form-members-submit">
            {btnMember}
          </button>
        </div>
      </form>
    </div>
  );
};
