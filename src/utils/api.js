// Frontend/src/utils/api.js

// Base URL - Production'da Railway URL'ine geç
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

// Authenticated fetch helper
export const authFetch = async (url, options = {}) => {
  // LocalStorage'dan token al
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Token varsa Authorization header'a ekle
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 401 Unauthorized → Token geçersiz/yok, login'e yönlendir
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Unauthorized - Please login again");
  }

  // 403 Forbidden → Yetki yok
  if (response.status === 403) {
    throw new Error("Forbidden - You don't have permission");
  }

  return response;
};

// ============ AUTH API'leri ============

// Login
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  const data = await response.json();
  
  // Token ve user'ı localStorage'a kaydet
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  
  return data;
};

// Register
export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return response.json();
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

// ============ PRODUCT API'leri ============

// GET - Tüm ürünler
export const getProducts = async () => {
  const response = await authFetch(`${API_BASE_URL}/api/product`);
  return response.json();
};

// POST - Yeni ürün ekle
export const addProduct = async (productData) => {
  const response = await authFetch(`${API_BASE_URL}/api/product/add`, {
    method: "POST",
    body: JSON.stringify(productData),
  });
  return response.json();
};

// PUT - Ürün güncelle
export const updateProduct = async (productId, updates) => {
  const response = await authFetch(`${API_BASE_URL}/api/product/${productId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return response.json();
};

// DELETE - Ürün sil
export const deleteProduct = async (productId) => {
  const response = await authFetch(`${API_BASE_URL}/api/product/${productId}`, {
    method: "DELETE",
  });
  return response.json();
};

// SEARCH - Ürün ara
export const searchProducts = async (searchTerm) => {
  const response = await authFetch(
    `${API_BASE_URL}/api/product/search?q=${encodeURIComponent(searchTerm)}`
  );
  return response.json();
};

export const addPurchase = async (purchaseData) => {
  const response = await authFetch(`${API_BASE_URL}/api/purchase/add`, {
    method: "POST",
    body: JSON.stringify(purchaseData),
  });
  return response.json();
};

export const addSale = async (saleData) => {
  const response = await authFetch(`${API_BASE_URL}/api/sales/add`, {
    method: "POST",
    body: JSON.stringify(saleData),
  });
  return response.json();
};

export const addStore = async (storeData) => {
  const response = await authFetch(`${API_BASE_URL}/api/store/add`, {
    method: "POST",
    body: JSON.stringify(storeData),
  });
  return response.json();
};

// utils/api.js dosyasının sonuna EKLE:

// ============ DASHBOARD API'leri ============

// GET - Total sale amount
export const getTotalSaleAmount = async () => {
  const response = await authFetch(`${API_BASE_URL}/api/sales/get/${getUserId()}/totalsaleamount`);
  return response.json();
};

// GET - Total purchase amount
export const getTotalPurchaseAmount = async () => {
  const response = await authFetch(`${API_BASE_URL}/api/purchase/get/${getUserId()}/totalpurchaseamount`);
  return response.json();
};

// GET - Monthly sales
export const getMonthlySales = async () => {
  const response = await authFetch(`${API_BASE_URL}/api/sales/getmonthly`);
  return response.json();
};

// ============ PURCHASE API'leri ============

// GET - Tüm purchase'ları getir
export const getPurchases = async () => {
  const response = await authFetch(`${API_BASE_URL}/api/purchase/get/${getUserId()}`);
  return response.json();
};

// ============ SALES API'leri ============

// GET - Tüm sales'leri getir
export const getSales = async () => {
  const response = await authFetch(`${API_BASE_URL}/api/sales/get/${getUserId()}`);
  return response.json();
};

// ============ STORE API'leri ============

// GET - Tüm store'ları getir
export const getStores = async () => {
  const response = await authFetch(`${API_BASE_URL}/api/store/get/${getUserId()}`);
  return response.json();
};

// Helper fonksiyon - User ID'yi al
const getUserId = () => {
  const user = getCurrentUser();
  return user?.id || localStorage.getItem("user");
};

// ============ HELPER FUNCTIONS ============

// Token var mı kontrol et
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Mevcut user bilgisini al
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");

  if (!userStr) {
    return null;
  }

  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error("Error parsing user data from Local Storage:", e);
    localStorage.removeItem("user");
    return null; 
  }
};

// Admin mi kontrol et
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === "admin";
};