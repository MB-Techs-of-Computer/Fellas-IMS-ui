import React from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Inventory from "./pages/Inventory";
import NoPageFound from "./pages/NoPageFound";
import AuthContext from "./AuthContext";
import ProtectedWrapper from "./ProtectedWrapper";
import { useEffect, useState } from "react";
import Store from "./pages/Store";
import Sales from "./pages/Sales";
import PurchaseDetails from "./pages/PurchaseDetails";

const App = () => {
  const [user, setUser] = useState("");
  const [role, setRole] = useState("");
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const myLoginUser = localStorage.getItem("user");
    const myUserRole = localStorage.getItem("role");

    if (myLoginUser) {
      setUser(myLoginUser);
      setRole(myUserRole || "employee");
    }
    setLoader(false);
  }, []);

  const signin = (newUser, newRole, callback) => {
  setUser(newUser);
  setRole(newRole);

  localStorage.setItem("user", newUser);
  localStorage.setItem("role", newRole);

  callback();
};


  const signout = () => {
    setUser("");
    setRole("");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
  };

  const isAdmin = role === "admin";

  let value = { user, signin, signout, role, isAdmin };

  if (loader) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>LOADING...</h1>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {isAdmin && (
            <Route
              path="/"
              element={
                <ProtectedWrapper>
                  <Layout />
                </ProtectedWrapper>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/purchase-details" element={<PurchaseDetails />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/manage-store" element={<Store />} />
            </Route>
          )}

          {!isAdmin && (
            <Route
              path="/"
              element={
                <ProtectedWrapper>
                  <Inventory />
                </ProtectedWrapper>
              }
            />
          )}

          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;