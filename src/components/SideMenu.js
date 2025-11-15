import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../AuthContext";
import { getCurrentUser, isAdmin as checkIsAdmin } from "../utils/api";

function SideMenu() {
  const authContext = useContext(AuthContext);
  
  // getCurrentUser helper'ını kullan
  const user = getCurrentUser();
  const userName = user ? `${user.firstName} ${user.lastName}` : "User";
  const userEmail = user?.email || "";
  const userImage = user?.imageUrl || "https://via.placeholder.com/150";
  const isAdmin = checkIsAdmin();

  return (
    <div className="h-full flex-col justify-between bg-white hidden lg:flex">
      <div className="px-4 py-6">
        <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-1">
          {/* Dashboard - Sadece Admin */}
          {isAdmin && (
            <Link
              to="/"
              className="flex items-center gap-2 rounded-lg hover:bg-gray-100 px-4 py-2 text-gray-700"
            >
              <img
                alt="dashboard-icon"
                src={require("../assets/dashboard-icon.png")}
              />
              <span className="text-sm font-medium"> Dashboard </span>
            </Link>
          )}

          {/* Inventory - Herkes Görebilir */}
          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              <Link to="/inventory">
                <div className="flex items-center gap-2">
                  <img
                    alt="inventory-icon"
                    src={require("../assets/inventory-icon.png")}
                  />
                  <span className="text-sm font-medium"> Inventory </span>
                </div>
              </Link>
            </summary>
          </details>

          {/* Purchase Details - Sadece Admin */}
          {isAdmin && (
            <Link
              to="/purchase-details"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <img
                alt="purchase-icon"
                src={require("../assets/supplier-icon.png")}
              />
              <span className="text-sm font-medium"> Purchase Details</span>
            </Link>
          )}

          {/* Sales - Sadece Admin */}
          {isAdmin && (
            <Link
              to="/sales"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <img
                alt="sale-icon"
                src={require("../assets/supplier-icon.png")}
              />
              <span className="text-sm font-medium"> Sales</span>
            </Link>
          )}

          {/* Manage Store - Sadece Admin */}
          {isAdmin && (
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <Link to="/manage-store">
                  <div className="flex items-center gap-2">
                    <img
                      alt="store-icon"
                      src={require("../assets/order-icon.png")}
                    />
                    <span className="text-sm font-medium"> Manage Store </span>
                  </div>
                </Link>
              </summary>
            </details>
          )}
        </nav>
      </div>

      {/* User Profile - Herkes Görür */}
      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
        <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
          <img
            alt="Profile"
            src={userImage}
            className="h-10 w-10 rounded-full object-cover"
          />

          <div>
            <p className="text-xs">
              <strong className="block font-medium">{userName}</strong>
              <span> {userEmail} </span>
            </p>
            {/* Role Badge */}
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
              {isAdmin ? "Admin" : "Çalışan"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;