const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      rol: ["Administrador", "Empleado"],
    },
    actions: {
      register: async (user_name, password, profile_img_url, rol, number) => {
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/signup",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_name,
                password,
                profile_img_url,
                rol,
                number,
              }),
            }
          );
          if (!response.ok) {
            return false;
          }
          const data = response.json();
          return data;
        } catch (error) {
          console.log(error);
        }
      },
      //LOGIN USER//
      login: async (user_name, password) => {
        const actions = getActions();
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/signin",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ user_name, password }),
            }
          );
          if (!response.ok) {
            return false;
          }
          const data = await response.json();
          localStorage.setItem("token", data.token);
          actions.getMe();
          return true;
        } catch (error) {
          console.log(error);
        }
      },
      //GET ME//
      getMe: async () => {
        const jwt = localStorage.getItem("token");
        try {
          const response = await fetch(process.env.BACKEND_URL + "/api/me", {
            method: "GET",
            headers: {
              authorization: `Bearer ${jwt}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setStore({ me: data });
            console.log(data);
          }
        } catch (error) {
          console.log(error);
        }
      },
      //LOGOUT USER//
      logout: () => {
        localStorage.removeItem("token");
      },
    },
  };
};

export default getState;
