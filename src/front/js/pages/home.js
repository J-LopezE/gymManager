import React, { useContext } from "react";
import { Context } from "../store/appContext";
import Gym from "../../img/gym.png"; // Import the image

export const Home = () => {
  const { store, actions } = useContext(Context);

  const homeBackgroundStyle = {
    backgroundImage: `url(${Gym})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100%",
  };

  return <div style={homeBackgroundStyle} className="text-center mt-5"></div>;
};
