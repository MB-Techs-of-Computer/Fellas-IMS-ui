const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export const authFetch = async (url, options = {}) => {
  
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Unauthorized - Please login again");
  }

  
  if (response.status === 403) {
    throw new Error("Forbidden - You don't have permission");
  }

  return response;
};

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
  
  
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  
  return data;
};


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


export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};




export const getProducts = async () => {
  const response = await authFetch(`${API_BASE_URL}/api/product`);
  return response.json();
};


export const addProduct = async (productData) => {
  const response = await authFetch(`${API_BASE_URL}/api/product/add`, {
    method: "POST",
    body: JSON.stringify(productData),
  });
  return response.json();
};


export const updateProduct = async (productId, updates) => {
  const response = await authFetch(`${API_BASE_URL}/api/product/${productId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return response.json();
};


export const deleteProduct = async (productId) => {
  const response = await authFetch(`${API_BASE_URL}/api/product/${productId}`, {
    method: "DELETE",
  });
  return response.json();
};


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


export const getTotalSaleAmount = async () => {
  const response = await authFetch(`${API_BASE_URL}/api/sales/get/${getUserId()}/totalsaleamount`);
  return response.json();
};


export const getTotalPurchaseAmount = async () => {
  const response = await authFetch(`${API_BASE_URL}/api/purchase/get/${getUserId()}/totalpurchaseamount`);
  return response.json();
};


export const getMonthlySales = async () => {
  const response = await authFetch(`${API_BASE_URL}/api/sales/getmonthly`);
  return response.json();
};


export const getPurchases = async () => {
  const response = await authFetch(`${API_BASE_URL}/api/purchase/get/${getUserId()}`);
  return response.json();
};




export const getSales = async () => {
  const response = await authFetch(`${API_BASE_URL}/api/sales/get/${getUserId()}`);
  return response.json();
};




export const getStores = async () => {
  const response = await authFetch(`${API_BASE_URL}/api/store/get/${getUserId()}`);
  return response.json();
};


const getUserId = () => {
  const user = getCurrentUser();
  return user?.id || localStorage.getItem("user");
};




export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};


export const getCurrentUser = () => {
  const userId = localStorage.getItem("user");
  
  if (!userId) {
    return null;
  }
  
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const userImage = localStorage.getItem("userImage");
  const [firstName, ...lastNameParts] = userName ? userName.split(" ") : ["", ""];
  const lastName = lastNameParts.join(" ");
  
  return {
    id: userId,
    firstName: firstName,
    lastName: lastName,
    email: userEmail,
    imageUrl: userImage
  };
};


export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === "admin";
};