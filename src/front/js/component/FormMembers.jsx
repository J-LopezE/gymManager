import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";
import { uploadFile } from "../../../firebase/config";

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
    console.log(member);
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
    <div className="container">
      <form className="container mt-5 form-container" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            placeholder="Nombre"
            value={member.name}
            name="name"
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="apellido" className="form-label">
            Apellido
          </label>
          <input
            type="text"
            className="form-control"
            id="apellido"
            placeholder="Apellido"
            value={member.last_name}
            name="last_name"
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <div className="form-grup mb-4 mt-4">
          <div className="form-grup">
            <input
              id="profile_img_url"
              type="file"
              className="form-control p-2"
              onChange={(e) => setProfile_img_url(e.target.files[0])}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="direccion" className="form-label">
            Dirección
          </label>
          <input
            type="text"
            className="form-control"
            id="direccion"
            placeholder="Dirección"
            value={member.address}
            name="address"
            onChange={(e) => handleChange(e)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">
            Teléfono
          </label>
          <input
            type="tel"
            className="form-control"
            id="telefono"
            placeholder="Teléfono"
            value={member.phone}
            name="phone"
            onChange={(e) => handleChange(e)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="contactoEmergencia" className="form-label">
            Contacto de Emergencia
          </label>
          <input
            type="text"
            className="form-control"
            id="contactoEmergencia"
            placeholder="Contacto de Emergencia"
            value={member.emergency_phone}
            name="emergency_phone"
            onChange={(e) => handleChange(e)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="estatura" className="form-label">
            Estatura (cm)
          </label>
          <input
            type="number"
            className="form-control"
            id="estatura"
            placeholder="Estatura"
            value={member.stature}
            name="stature"
            onChange={(e) => handleChange(e)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="peso" className="form-label">
            Peso (kg)
          </label>
          <input
            type="number"
            className="form-control"
            id="peso"
            placeholder="Peso"
            value={member.weight}
            name="weight"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="objetivos" className="form-label">
            Objetivos
          </label>
          <textarea
            className="form-control"
            id="objetivos"
            rows="3"
            placeholder="Objetivos"
            value={member.objectives}
            name="objectives"
            onChange={(e) => handleChange(e)}
            required
          ></textarea>
        </div>

        <select
          className="form-select"
          id="genero"
          onChange={(e) => handleChange(e)}
          name="gender"
          value={member.gender}
          required
        >
          <option value="">Selecciona un Genero</option>
          <option value="female">Femenino</option>
          <option value="male">Masculino</option>
          <option value="other">Otro</option>
        </select>

        <div className="mb-3">
          <label htmlFor="fechaNacimiento" className="form-label">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            className="form-control"
            id="fechaNacimiento"
            value={member.birthdate}
            name="birthdate"
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="metodoPago" className="form-label">
            Método de Pago
          </label>
          <select
            className="form-select"
            id="metodoPago"
            onChange={(e) => handleChange(e)}
            name="payement_type"
            value={member.payement_type}
            required
          >
            <option value="">Selecciona un método de pago</option>
            <option value="cash">Efectivo</option>
            <option value="creditCard">Tarjeta de Crédito</option>
            <option value="debitCard">Tarjeta de Débito</option>
            <option value="bankTransfer">Transferencia Bancaria</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="tipoSangre" className="form-label">
            Tipo de Sangre
          </label>
          <input
            type="text"
            className="form-control"
            id="tipoSangre"
            placeholder="Tipo de Sangre"
            value={member.blood_type}
            name="blood_type"
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="referido" className="form-label">
            Referido Por
          </label>
          <input
            type="text"
            className="form-control"
            id="referido"
            placeholder="Nombre del referido"
            value={member.refered}
            name="refered"
            onChange={(e) => handleChange(e)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {btnMember}
        </button>
      </form>
    </div>
  );
};
