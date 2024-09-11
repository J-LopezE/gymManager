import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";

export const FormMembers = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
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

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setMember((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  return (
    <div className="container">
      <h2 className="mb-4">Formulario de Inscripción</h2>
      <form className="container mt-5 form-container">
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
          <label htmlFor="imc" className="form-label">
            IMC
          </label>
          <input
            type="text"
            className="form-control"
            id="imc"
            placeholder="IMC"
            readOnly
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

        <div className="mb-3">
          <label className="form-label">Género</label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="generoM"
              value={member.gender}
              name="gender"
              checked={member.gender === "Masculino"}
              onChange={(e) => handleChange(e)}
              required
            />
            <label className="form-check-label" htmlFor="generoM">
              Masculino
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="generoF"
              value={member.gender}
              name="gender"
              checked={member.gender === "Femenino"}
              onChange={(e) => handleChange(e)}
              required
            />
            <label className="form-check-label" htmlFor="generoF">
              Femenino
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="generoO"
              value={member.gender}
              name="gender"
              checked={member.gender === "Otro"}
              onChange={(e) => handleChange(e)}
              required
            />
            <label className="form-check-label" htmlFor="generoO">
              Otro
            </label>
          </div>
        </div>

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
          <label htmlFor="tipoMembresia" className="form-label">
            Tipo de Membresía
          </label>
          <select className="form-select" id="tipoMembresia">
            <option selected>Selecciona un tipo de membresía</option>
            <option value="basic">Básica</option>
            <option value="premium">Premium</option>
            <option value="vip">VIP</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="fechaInicioMembresia" className="form-label">
            Fecha de Inicio de Membresía
          </label>
          <input
            type="date"
            className="form-control"
            id="fechaInicioMembresia"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="fechaExpiracion" className="form-label">
            Fecha de Expiración
          </label>
          <input type="date" className="form-control" id="fechaExpiracion" />
        </div>

        <div className="mb-3">
          <label htmlFor="metodoPago" className="form-label">
            Método de Pago
          </label>
          <select className="form-select" id="metodoPago">
            <option selected>Selecciona un método de pago</option>
            <option value="creditCard">Tarjeta de Crédito</option>
            <option value="debitCard">Tarjeta de Débito</option>
            <option value="paypal">PayPal</option>
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
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Enviar
        </button>
      </form>
    </div>
  );
};
