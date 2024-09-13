const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      userMembers: [],
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

      //ADD Member
      add_member: async (
        name,
        last_name,
        profile_img_url,
        blood_type,
        gender,
        birthdate,
        address,
        phone,
        emergency_phone,
        stature,
        weight,
        objectives,
        payement_type,
        refered
      ) => {
        const jwt = localStorage.getItem("token");
        const store = getStore();
        const actions = getActions();
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/create_member",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                name,
                last_name,
                profile_img_url,
                blood_type,
                gender,
                birthdate,
                address,
                phone,
                emergency_phone,
                stature,
                weight,
                objectives,
                payement_type,
                refered,
              }),
            }
          );
          if (!response.ok) {
            console.log(response);
          }
          const data = await response.json();
          console.log(data);
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      //GET USER MEMBER
      getUserMembers: async (id) => {
        const jwt = localStorage.getItem("token");
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/${id}/members`,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setStore({ userMembers: data.members });
          } else {
            console.log(data.error || "Error al obtener miembros del usuario");
          }
        } catch (error) {
          console.log(error);
        }
      },

      // EDIT MEMBER
      editMember: async (
        id,
        name,
        last_name,
        profile_img_url,
        blood_type,
        gender,
        birthdate,
        address,
        phone,
        emergency_phone,
        stature,
        weight,
        objectives,
        payement_type,
        refered
      ) => {
        const actions = getActions();
        const jwt = localStorage.getItem("token");

        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/edit_member",
            {
              method: "PUT",
              body: JSON.stringify({
                id,
                name,
                last_name,
                profile_img_url,
                blood_type,
                gender,
                birthdate,
                address,
                phone,
                emergency_phone,
                stature,
                weight,
                objectives,
                payement_type,
                refered,
              }),
              headers: {
                "Content-type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          console.log(data);
          if (response.ok) {
            actions.getUserMembers();
            return true;
          }
        } catch (error) {
          console.log(error);
          return false;
        }
      },
    },
  };
};

export default getState;
