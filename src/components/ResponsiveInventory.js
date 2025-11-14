import React, { useState, useEffect } from "react";
import ProductCardMobile from "./ProductCardMobile";
import ProductModal from "./ProductModal";

const ResponsiveInventory = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Ekran boyutunu kontrol et
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Ürünleri çek
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const userId = localStorage.getItem("user");
      const response = await fetch("http://localhost:4000/api/product", {
        headers: {
          "x-user-id": userId,
        },
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Modal Control Functions
  const openAddModal = () => {
    setSelectedProduct(null); // null = Add mode
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product); // data var = Edit mode
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleSuccess = () => {
    fetchProducts(); // Listeyi yenile
  };

  const updateProductState = async (productId, updates) => {
    const userId = localStorage.getItem("user");
    
    try {
      const response = await fetch(
        `http://localhost:4000/api/product/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
          body: JSON.stringify({
            ...updates,
            userId: userId,
          }),
        }
      );
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const deleteItem = async (productId) => {
    const userId = localStorage.getItem("user");
    
    try {
      const response = await fetch(
        `http://localhost:4000/api/product/${productId}`,
        {
          method: "DELETE",
          headers: {
            "x-user-id": userId,
          },
        }
      );
      if (response.ok) {
        fetchProducts(); // Listeyi yenile
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mobil görünüm
  if (isMobile) {
    return (
      <>
        <ProductModal
          isOpen={showModal}
          onClose={closeModal}
          productData={selectedProduct}
          onSuccess={handleSuccess}
        />
        <ProductCardMobile
          products={filteredProducts}
          updateProduct={updateProductState}
          deleteItem={deleteItem}
          onAddClick={openAddModal}
          onEditClick={openEditModal}
        />
      </>
    );
  }

  // Desktop görünüm (Mevcut tablo yapısı)
  return (
    <>
      <ProductModal
        isOpen={showModal}
        onClose={closeModal}
        productData={selectedProduct}
        onSuccess={handleSuccess}
      />
      <div className="grid w-full mx-4 overflow-x-auto rounded-lg border bg-white border-gray-200">
        <div className="flex justify-between pt-5 pb-3 px-3">
          <div className="flex gap-4 justify-center items-center">
            <span className="font-bold">Products</span>
            <div className="flex justify-center items-center px-2 border-2 rounded-md">
              <img
                alt="search-icon"
                className="w-5 h-5"
                src={require("../assets/search-icon.png")}
              />
              <input
                className="border-none outline-none focus:border-none text-xs"
                type="text"
                placeholder="Search here"
                value={searchTerm}
                onChange={handleSearchTerm}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
              onClick={openAddModal}
            >
              Add Product
            </button>
          </div>
        </div>

        <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                Ürün
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                Stok
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                Birim
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                Açıklama
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                Son Güncelleme
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                İşlem
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td className="whitespace-nowrap px-4 py-2 text-gray-900 font-medium">
                  {product.name}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {product.stock}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {product.unit || "Adet"}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {product.description}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-xs">
                  <div>{product.lastUpdatedBy || "Admin"}</div>
                  <div className="text-gray-500">
                    {product.lastUpdatedAt
                      ? new Date(product.lastUpdatedAt).toLocaleDateString(
                          "tr-TR"
                        )
                      : "-"}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <span 
                    className="text-green-700 cursor-pointer hover:text-green-900"
                    onClick={() => openEditModal(product)}
                  >
                    Edit{" "}
                  </span>
                  <span
                    className="text-red-600 px-2 cursor-pointer hover:text-red-800"
                    onClick={() => {
                      if (window.confirm(`"${product.name}" silinsin mi?`)) {
                        deleteItem(product._id);
                      }
                    }}
                  >
                    Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ResponsiveInventory;