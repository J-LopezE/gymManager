import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { uploadFile } from "../../../firebase/config";
import "../../styles/login.css";
import Gym from "../../img/gym.png";
import Swal from "sweetalert2";

export const Register = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [profile_img_url, setProfile_img_url] = useState(null);
  const [user, setUser] = useState({
    user_name: "",
    password: "",
    rol: "",
    number: "",
  });

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
    console.log(user);
  }

  const homeBackgroundStyle = {
    backgroundImage: `url(${Gym})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100%",
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    const loadingAlert = Swal.fire({
      title: "Creando usuario...",
      text: "Estamos creando tu cuenta. Por favor, espera...",
      icon: "info",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      let result = null;
      if (profile_img_url) {
        result = await uploadFile(profile_img_url);
        console.log(result);
      }

      const response = await actions.register(
        user.user_name,
        user.password,
        result,
        user.rol,
        user.number
      );

      if (response) {
        // Cierra la alerta de carga y muestra una alerta de éxito
        await loadingAlert.close();
        Swal.fire({
          title: "Usuario creado",
          text: "Tu cuenta ha sido creada con éxito. Puedes iniciar sesión ahora.",
          icon: "success",
          confirmButtonText: "Aceptar",
        }).then(() => {
          navigate("/login");
        });
      } else {
        // Cierra la alerta de carga y muestra una alerta de error
        await loadingAlert.close();
        Swal.fire({
          title: "Error",
          text: "No se pudo crear la cuenta. Intenta de nuevo.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      // Cierra la alerta de carga y muestra una alerta de error en caso de excepción
      await loadingAlert.close();
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error inesperado. Intenta de nuevo.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      console.error("Error en handleSubmitRegister:", error);
    }
  };

  return (
    <div style={homeBackgroundStyle} className="text-center">
      <div className="container login-home">
        <div className="row">
          <div className="col-12">
            <div className="formulario-login p-4">
              <form onSubmit={handleSubmitRegister}>
                <div className="form form-grup">
                  <div className="card-body">
                    <h1 className="text-center mb-4 mt-4">Registro</h1>
                    <div className="form-grup mb-3">
                      <input
                        id="user_name"
                        className="form-control form-control-lg"
                        name="user_name"
                        autoComplete="Usuario"
                        placeholder="Usuario"
                        autoFocus
                        value={user.user_name}
                        onChange={(e) => handleChange(e)}
                        required
                      />
                    </div>
                    <div className="form-grup mb-4 mt-4">
                      <input
                        type="password"
                        placeholder="Contraseña"
                        className="pass form-control form-control-lg"
                        id="inputPassword"
                        name="password"
                        value={user.password}
                        onChange={(e) => handleChange(e)}
                        required
                      />
                    </div>
                    <div className="form-grup mb-3">
                      <input
                        id="Número de Empleado"
                        className="form-control form-control-lg"
                        name="number"
                        autoComplete="number"
                        placeholder="Número de Empleado"
                        autoFocus
                        value={user.number}
                        onChange={(e) => handleChange(e)}
                        required
                      />
                    </div>
                    <div className="form-grup mb-4 mt-4">
                      <div className="form-grup">
                        <select
                          id="rol"
                          className="form-select form-select-lg"
                          value={user.rol}
                          name="rol"
                          onChange={(e) => handleChange(e)}
                          required
                        >
                          <option value="">Selecciona tu rol</option>
                          {store.rol.map((rol, index) => (
                            <option key={index} value={rol}>
                              {rol}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-grup mb-4 mt-4">
                      <div className="form-grup">
                        <input
                          id="profile_img_url"
                          type="file"
                          className="form-control p-2"
                          onChange={(e) =>
                            setProfile_img_url(e.target.files[0])
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="div-button mb-4 mt-4">
                      <button className="btn btn-primary" type="submit">
                        Registrarse
                      </button>
                    </div>
                    <div className="registro text-center">
                      ¿Ya tienes Cuenta?{" "}
                      <Link to={"/login"}>Inicia Sesión</Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
