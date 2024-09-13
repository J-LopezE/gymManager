import React from "react";
import Gym from "../../img/gym.png"; // Import the image

export const User = () => {
  const homeBackgroundStyle = {
    backgroundImage: `url(${Gym})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100%",
  };

  return (
    <div style={homeBackgroundStyle} className="text-center mt-5">
      <h1>Vista Usuarios</h1>
    </div>
  );
};
