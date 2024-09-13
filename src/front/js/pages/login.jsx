import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/login.css";
import Gym from "../../img/gym.png";

export const Login = () => {
  const { store, actions } = useContext(Context);
  const [user_name, setuUerName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const homeBackgroundStyle = {
    backgroundImage: `url(${Gym})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100%",
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    const isLoggedIn = await actions.login(user_name, password);
    if (isLoggedIn) {
      navigate("/");
    }
  };

  return (
    <div style={homeBackgroundStyle} className="text-center">
      <div className="container  login-home">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="formulario-login p-4">
              <form onSubmit={handleSubmitLogin}>
                <div className="form form-grup">
                  <div className="card-body">
                    <h1 className="text-center mb-4">Iniciar Sesión</h1>
                    <div className="form-grup mb-3">
                      <input
                        id="user_name"
                        className="user_name form-control form-control-lg"
                        placeholder="Usuario"
                        type="user_name"
                        autoComplete="Usuario"
                        autoFocus
                        value={user_name}
                        onChange={(e) => setuUerName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-grup mb-4">
                      <input
                        type="password"
                        className="pass form-control form-control-lg"
                        id="inputPassword"
                        value={password}
                        placeholder="Contraseña"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="div-button form-grup d-flex justify-content-center mb-4">
                      <button className="btn btn-primary" type="submit">
                        Ingresar
                        <i className="fa-solid fa-right-to-bracket ms-2"></i>
                      </button>
                    </div>
                    <div className="registro text-center">
                      ¿No tienes Cuenta?{" "}
                      <Link to={"/register"}>Regístrate</Link>
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
