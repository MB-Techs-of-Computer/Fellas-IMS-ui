import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideMenu from "./SideMenu";

function Layout() {
  return (
    <>
      <div className="md:h-16">
        <Header />
      </div>
      <div className="flex bg-gray-100 items-baseline">
        <div className="h-screen sticky top-0 hidden lg:flex">
          <SideMenu />
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
