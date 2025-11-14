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
  const [userRole, setUserRole] = useState("");
  const [loader, setLoader] = useState(true);

  // Component mount olduğunda localStorage'dan oku
  useEffect(() => {
    const myLoginUser = localStorage.getItem("user");
    const myUserRole = localStorage.getItem("userRole");

    if (myLoginUser) {
      setUser(myLoginUser);
      setUserRole(myUserRole || "employee");
    }
    setLoader(false); // Her durumda loader'ı kapat
  }, []); // ← Boş array, sadece ilk render'da çalışır

  const signin = (newUser, callback) => {
    setUser(newUser);
    const role = localStorage.getItem("userRole") || "employee";
    setUserRole(role);
    callback();
  };

  const signout = () => {
    setUser("");
    setUserRole("");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
  };

  const isAdmin = userRole === "admin";

  let value = { user, signin, signout, userRole, isAdmin };

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

          {/* ADMIN ROUTES - Full Layout ile */}
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

          {/* EMPLOYEE ROUTES - Sadece Inventory, Layout YOK */}
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