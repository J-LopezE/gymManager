import React from "react";
import Gym from "../../img/gym.png"; // Import the image
import "../../styles/subscription.css";
export const Subscription = () => {
  const homeBackgroundStyle = {
    backgroundImage: `url(${Gym})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100%",
  };

  return (
    <div style={homeBackgroundStyle} className="text-center">
      <h1>Vista Membresias</h1>
    </div>
  );
};
