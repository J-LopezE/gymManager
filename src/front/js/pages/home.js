import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import useTokenExpiration from "../../../hooks/useTokenExpiration.jsx";
import Gym from "../../img/gym.png"; // Import the image

export const Home = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useTokenExpiration();

  const homeBackgroundStyle = {
    backgroundImage: `url(${Gym})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100%",
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/login");
      return;
    }
  }, []);

  return <div style={homeBackgroundStyle} className="text-center"></div>;
};
