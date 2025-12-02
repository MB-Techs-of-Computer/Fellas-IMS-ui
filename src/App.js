import React from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Inventory from "./pages/Inventory";
import Dashboard from "./pages/Dashboard";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const myLoginUser = localStorage.getItem("user");
    const myUserRole = localStorage.getItem("userRole");

    if (myLoginUser) {
      setUser(myLoginUser);
      setUserRole(myUserRole);
    }
    
    setLoading(false);
  }, []);

  const signin = (id, role) => {
    setUser(id);
    setUserRole(role);
    localStorage.setItem("user", id);
    localStorage.setItem("userRole", role);
  };

  const signout = () => {
    localStorage.clear();
    setUser("");
    setUserRole("");
  };

  const isAdmin = userRole === "admin";

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontSize: "24px",
        fontWeight: "bold"
      }}>
        Yükleniyor...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, userRole, signin, signout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedWrapper>
                <Layout />
              </ProtectedWrapper>
            }
          >
            <Route index element={<Inventory />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="dashboard" element={isAdmin ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="purchase-details" element={isAdmin ? <PurchaseDetails /> : <Navigate to="/" />} />
            <Route path="sales" element={isAdmin ? <Sales /> : <Navigate to="/" />} />
            <Route path="manage-store" element={isAdmin ? <Store /> : <Navigate to="/" />} />
          </Route>

          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;