// Frontend/src/utils/api.js - Yeni dosya oluştur

// Authenticated fetch helper
export const authFetch = async (url, options = {}) => {
  const userId = localStorage.getItem("user");

  const headers = {
    "Content-Type": "application/json",
    "x-user-id": userId, // ← User ID header'a ekle
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 401 Unauthorized → Login'e yönlendir
  if (response.status === 401) {
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  return response;
};

// Kullanım örnekleri:

// GET
export const getProducts = async () => {
  const response = await authFetch("http://localhost:4000/api/product");
  return response.json();
};

// POST
export const addProduct = async (productData) => {
  const response = await authFetch("http://localhost:4000/api/product/add", {
    method: "POST",
    body: JSON.stringify(productData),
  });
  return response.json();
};

// PUT
export const updateProduct = async (productId, updates) => {
  const response = await authFetch(
    `http://localhost:4000/api/product/${productId}`,
    {
      method: "PUT",
      body: JSON.stringify(updates),
    }
  );
  return response.json();
};

// DELETE
export const deleteProduct = async (productId) => {
  const response = await authFetch(
    `http://localhost:4000/api/product/${productId}`,
    {
      method: "DELETE",
    }
  );
  return response.json();
};