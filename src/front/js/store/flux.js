const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      userMembers: [],
      members: [],
      id_member: [],
      memberships: [],
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
          console.log(data);
          return data;
        } catch (error) {
          console.log(error);
          throw error;
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
          }
        } catch (error) {
          console.log(error);
        }
      },
      //LOGOUT USER//
      logout: () => {
        localStorage.removeItem("token");
      },

      //ADD MEMBER
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
          actions.getAllMembers();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      //GET MEMBERS
      getAllMembers: async () => {
        const jwt = localStorage.getItem("token");
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/members`,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setStore({ members: data.members });
          } else {
            console.log(data.error || "Error al obtener miembros del usuario");
          }
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
            actions.getAllMembers();
            return true;
          }
        } catch (error) {
          console.log(error);
          return false;
        }
      },

      delete_member: async (id) => {
        const actions = getActions();
        const jwt = localStorage.getItem("token");
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/delete_member",
            {
              method: "DELETE",
              headers: {
                "Content-type": "application/json",
                authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                id,
              }),
            }
          );
          if (!response.ok) {
            return false;
          }
          const data = await response.json();
          actions.getAllMembers();
          return data;
        } catch (error) {
          console.log(error);
        }
      },

      //ADD SET MEMBER ID (id_member)

      add_id_member: (id) => {
        setStore({
          id_member: id,
        });
        console.log(id);
      },

      //ADD MEMBERSHIP
      add_membership: async (type, start_date, end_date) => {
        const jwt = localStorage.getItem("token");
        const store = getStore();
        const member_id = store.id_member;
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/create_membership",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwt}`,
              },

              body: JSON.stringify({
                type,
                start_date,
                end_date,
                member_id,
              }),
            }
          );
          if (!response.ok) console.log(response);
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      },
      //GET MEMBERSHIPS
      getAllMemberships: async () => {
        const jwt = localStorage.getItem("token");
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/memberships`,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setStore({ memberships: data.memberships });
          } else {
            console.log(data.error || "Error al obtener miembros del usuario");
          }
        } catch (error) {
          console.log(error);
        }
      },
    },
  };
};

export default getState;
