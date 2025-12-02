import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import EmployeeHeader from "./EmployeeHeader";
import SideMenu from "./SideMenu";
import AuthContext from "../AuthContext";

function Layout() {
  const { userRole } = useContext(AuthContext);
  const isAdmin = userRole === "admin";

  return (
    <>
      <div className="md:h-16">
        {isAdmin ? <Header /> : <EmployeeHeader />}
      </div>
      <div className="flex bg-gray-100 items-baseline">
        {isAdmin && (
          <div className="h-screen sticky top-0 hidden lg:flex">
            <SideMenu />
          </div>
        )}
        <Outlet />
      </div>
    </>
  );
}

export default Layout;