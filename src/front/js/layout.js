import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";

import Dashboard from "./component/Dashboard.jsx";
=======
import { Subscription } from "./pages/Subscription.jsx";
import { Members } from "./pages/Members.jsx";
import { User } from "./pages/User.jsx";

import injectContext from "./store/appContext";
import SideBar from "./component/SideBar.jsx";
import { Login } from "./pages/login.jsx";
import { Register } from "./pages/register.jsx";

const Layout = () => {
  const basename = process.env.BASENAME || "";

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "")
    return <BackendURL />;

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <SideBar />
          <Routes>
            <Route element={<Home />} path="/" />

            <Route element={<Dashboard />} path="/dashboard" />


            <Route element={<Members />} path="/members" />
            <Route element={<Subscription />} path="/subscription" />
            <Route element={<User />} path="/users" />
            <Route element={<Login />} path="/login" />
            <Route element={<Register />} path="/register" />
            <Route element={<h1>Not found!</h1>} />

          </Routes>
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
