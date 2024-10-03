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
    membership_id: "",
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
    payment_type: "",
    refered: "",
    start_date: "",
    end_date: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

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
      background: "rgba(0, 0, 0, 0.7)",
      color: "#fff",
    });
    try {
      let result;
      if (profile_img_url) {
        result = await uploadFile(profile_img_url);
      }
      const response = id
        ? await actions.editMember(
            id,
            member.membership_id,
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
            member.payment_type,
            member.refered,
            member.start_date,
            member.end_date,
            member.status
          )
        : await actions.add_member(
            member.membership_id,
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
            member.payment_type,
            member.refered,
            member.start_date,
            member.end_date,
            member.status
          );
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
        background: "rgba(0, 0, 0, 0.7)",
        color: "#fff",
      });
      if (!id) {
        setMember({
          membership_id: "",
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
          payment_type: "",
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
    actions.getAllMemberships();
    if (initialMember) {
      setMember({
        membership_id: initialMember.membership_id || "",
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
        payment_type: initialMember.payment_type || "",
        refered: initialMember.refered || "",
        start_date: initialMember.start_date || "",
        end_date: initialMember.end_date || "",
        status: initialMember.status || "",
      });
      setImagePreview(initialMember.profile_img_url || "");
    }
  }, []);

  return (
    <div className="form-members-container">
      <form className="form-members-form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <select
              className="form-members-input"
              id="membership_id"
              name="membership_id"
              value={member.membership_id}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Seleccionar Membresía
              </option>
              {store.memberships &&
                store.memberships.map((membership) => (
                  <option key={membership.id} value={membership.id}>
                    {membership.type}
                  </option>
                ))}
            </select>
          </div>
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
        </div>
        <div className="row">
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
          <div className="col-md-6 mb-3">
            <span className="form-members-label text-white">
              Fecha de Nacimiento
            </span>
            <input
              type="date"
              className="form-members-input"
              id="birthdate"
              value={member.birthdate}
              name="birthdate"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row">
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
          <div className="col-md-4 mb-3">
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
              required
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
        <div className="row mt-3">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-members-input"
              id="objectives"
              placeholder="Objetivos"
              value={member.objectives}
              name="objectives"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <select
              className="form-members-select"
              id="gender"
              name="gender"
              value={member.gender}
              onChange={handleChange}
            >
              <option value="">Seleccionar Género</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-members-select"
              id="payment_type"
              placeholder="Tipo de Pago"
              value={member.payment_type}
              name="payment_type"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-members-input"
              id="refered"
              placeholder="Referido por"
              value={member.refered}
              name="refered"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6 mb-3">
            <span className="form-members-label text-white">
              Fecha de Inicio
            </span>
            <input
              type="date"
              className="form-members-input"
              id="start_date"
              placeholder="Fecha de Inicio"
              value={member.start_date}
              name="start_date"
              onChange={handleChange}
              required
              min={today}
            />
          </div>
          <div className="col-md-6 mb-3">
            <span className="form-members-label text-white">Fecha de Fin</span>
            <input
              type="date"
              className="form-members-input"
              id="end_date"
              placeholder="Fecha de Fin"
              value={member.end_date}
              name="end_date"
              onChange={handleChange}
              required
              min={today}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6 mb-3">
            <select
              className="form-members-input"
              id="status"
              name="status"
              value={member.status}
              onChange={handleChange}
            >
              <option value="">Seleccionar Estado</option>
              <option value="Activa">Activa</option>
              <option value="Suspendida">Suspendida</option>
              <option value="Finalizada">Finalizada</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-members-input"
            />
          </div>
        </div>
        {imagePreview && (
          <div className="mb-3">
            <img
              src={imagePreview}
              alt="Vista previa"
              className="img-preview"
            />
          </div>
        )}
        <button type="submit" className="form-members-submit">
          {btnMember}
        </button>
      </form>
    </div>
  );
};
