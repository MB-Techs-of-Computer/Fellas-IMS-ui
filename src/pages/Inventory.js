import React, { useContext } from "react";
import ResponsiveInventory from "../components/ResponsiveInventory";
import AuthContext from "../AuthContext";
import EmployeeHeader from "../components/EmployeeHeader";

function Inventory() {
  const { isAdmin } = useContext(AuthContext);

  return (
    <>
      {/* Employee ise özel header göster */}
      {!isAdmin && <EmployeeHeader />}
      
      {/* Inventory content */}
      <ResponsiveInventory />
    </>
  );
}

export default Inventory;