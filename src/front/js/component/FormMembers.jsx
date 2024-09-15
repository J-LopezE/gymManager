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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      Swal.fire({
        title: "Cargando...",
        text: "Por favor, espere mientras se edita al miembro.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        let result;
        if (profile_img_url) {
          result = await uploadFile(profile_img_url);
          console.log(result);
        }
        const response = await actions.editMember(
          id,
          member.name,
          member.last_name,
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
        if (response) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Miembro Editado",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al editar al miembro.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Hubo un problema al editar al miembro: ${error.message}`,
        });
      }
    } else {
      console.log("creando");
      setLoading(true);

      Swal.fire({
        title: "Cargando...",
        text: "Por favor, espere mientras se crea al miembro.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        let result;
        if (profile_img_url) {
          result = await uploadFile(profile_img_url);
          console.log(result);
        }
        const response = await actions.add_member(
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
        console.log(response);
        actions.getAllMembers();
        if (response) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Miembro creado correctamente",
            showConfirmButton: false,
            timer: 1500,
          });
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
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al crear al miembro.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
        });
      } finally {
        setLoading(false);
      }
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
        weight: initialMember.weight || "",
        objectives: initialMember.objectives || "",
        payement_type: initialMember.payement_type || "",
        refered: initialMember.refered || "",
      });
    }
  }, [initialMember]);

  return (
    <div className="form-members-container">
      <form className="form-members-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre" className="form-members-label">
            Nombre
          </label>
          <input
            type="text"
            className="form-members-input"
            id="nombre"
            placeholder="Nombre"
            value={member.name}
            name="name"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="apellido" className="form-members-label">
            Apellido
          </label>
          <input
            type="text"
            className="form-members-input"
            id="apellido"
            placeholder="Apellido"
            value={member.last_name}
            name="last_name"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="profile_img_url" className="form-members-label">
            Imagen de Perfil
          </label>
          <input
            id="profile_img_url"
            type="file"
            className="form-members-file"
            onChange={(e) => setProfile_img_url(e.target.files[0])}
          />
        </div>
        <div>
          <label htmlFor="direccion" className="form-members-label">
            Dirección
          </label>
          <input
            type="text"
            className="form-members-input"
            id="direccion"
            placeholder="Dirección"
            value={member.address}
            name="address"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="telefono" className="form-members-label">
            Teléfono
          </label>
          <input
            type="tel"
            className="form-members-input"
            id="telefono"
            placeholder="Teléfono"
            value={member.phone}
            name="phone"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="contactoEmergencia" className="form-members-label">
            Contacto de Emergencia
          </label>
          <input
            type="text"
            className="form-members-input"
            id="contactoEmergencia"
            placeholder="Contacto de Emergencia"
            value={member.emergency_phone}
            name="emergency_phone"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="estatura" className="form-members-label">
            Estatura (cm)
          </label>
          <input
            type="number"
            className="form-members-input"
            id="estatura"
            placeholder="Estatura (cm)"
            value={member.stature}
            name="stature"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="peso" className="form-members-label">
            Peso (kg)
          </label>
          <input
            type="number"
            className="form-members-input"
            id="peso"
            placeholder="Peso (kg)"
            value={member.weight}
            name="weight"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="objetivos" className="form-members-label">
            Objetivos
          </label>
          <textarea
            className="form-members-textarea"
            id="objetivos"
            rows="3"
            placeholder="Objetivos"
            value={member.objectives}
            name="objectives"
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="genero" className="form-members-label">
            Género
          </label>
          <select
            className="form-members-select"
            id="genero"
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
        <div>
          <label htmlFor="fechaNacimiento" className="form-members-label">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            className="form-members-input"
            id="fechaNacimiento"
            value={member.birthdate}
            name="birthdate"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="metodoPago" className="form-members-label">
            Método de Pago
          </label>
          <select
            className="form-members-select"
            id="metodoPago"
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
        <div>
          <label htmlFor="tipoSangre" className="form-members-label">
            Tipo de Sangre
          </label>
          <input
            type="text"
            className="form-members-input"
            id="tipoSangre"
            placeholder="Tipo de Sangre"
            value={member.blood_type}
            name="blood_type"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="referido" className="form-members-label">
            Nombre del Referido
          </label>
          <input
            type="text"
            className="form-members-input"
            id="referido"
            placeholder="Nombre del Referido"
            value={member.refered}
            name="refered"
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="form-members-submit">
          {btnMember}
        </button>
      </form>
    </div>
  );
};
