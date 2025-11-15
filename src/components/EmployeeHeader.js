import React, { useContext } from "react";
import AuthContext from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../utils/api";

function EmployeeHeader() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  
  // getCurrentUser helper'ını kullan
  const user = getCurrentUser();
  const userName = user ? `${user.firstName} ${user.lastName}` : "User";
  const userEmail = user?.email || "";
  const userImage = user?.imageUrl || "https://via.placeholder.com/150";

  const handleLogout = () => {
    logout(); // Token'ı temizler ve login'e yönlendirir
    authContext.signout();
    // navigate gereksiz, logout() zaten yönlendiriyor
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        {/* Logo / Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary">Fellas</h1>
            <p className="text-xs text-gray-500">Stok Sayım</p>
          </div>
        </div>

        {/* User Info + Logout */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">{userEmail}</p>
          </div>
          <img
            alt="Profile"
            src={userImage}
            className="h-10 w-10 rounded-full object-cover"
          />
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Çıkış
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeHeader;