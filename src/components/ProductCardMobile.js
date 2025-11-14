import React, { useState } from "react";

const ProductCardMobile = ({ products, updateProduct, deleteItem, onAddClick, onEditClick }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleProductUpdate = (productId, updates) => {
    updateProduct(productId, updates);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full px-2 py-4">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="flex items-center px-4 border-2 rounded-lg bg-white shadow-sm">
          <img
            alt="search-icon"
            className="w-5 h-5 mr-2"
            src={require("../assets/search-icon.png")}
          />
          <input
            className="flex-1 border-none outline-none text-base"
            type="text"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={handleSearchTerm}
          />
        </div>
      </div>

      {/* Add Product Button */}
      <div className="mb-4">
        <button
          onClick={onAddClick}
          className="w-full bg-secondary hover:opacity-90 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-xl">+</span>
          <span>Yeni Ürün Ekle</span>
        </button>
      </div>

      {/* Products Grid - Mobile Friendly */}
      <div className="space-y-3">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onUpdate={handleProductUpdate}
            onDelete={deleteItem}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Ürün bulunamadı
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ product, onUpdate, onDelete }) => {
  const [stock, setStock] = useState(product.stock);
  const [unit, setUnit] = useState(product.unit || "Adet");
  const [description, setDescription] = useState(product.description || "");
  const [hasChanges, setHasChanges] = useState(false);

  const handleStockChange = (e) => {
    setStock(e.target.value);
    setHasChanges(true);
  };

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
    setHasChanges(true);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setHasChanges(true);
  };

  const handleSave = () => {
    // Tüm değişiklikleri tek seferde kaydet
    onUpdate(product._id, {
      stock: stock,
      unit: unit,
      description: description,
    });
    setHasChanges(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header: Ürün adı + Kullanıcı + Tarih */}
      <div className="bg-gray-50 px-4 py-3 flex justify-between items-start border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 text-base flex-1">
          {product.name}
        </h3>
        <div className="text-right text-xs text-gray-600 ml-2">
          <div className="font-medium">{product.lastUpdatedBy || "Admin"}</div>
          <div className="text-gray-500">
            {product.lastUpdatedAt
              ? new Date(product.lastUpdatedAt).toLocaleDateString("tr-TR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Yeni"}
          </div>
        </div>
      </div>

      {/* Body: Stock + Unit + Description */}
      <div className="p-4">
        <div className="grid grid-cols-10 gap-3 items-center">
          {/* Stock Input - Editable */}
          <div className="col-span-2">
            <label className="text-xs text-gray-600 mb-1 block">Miktar</label>
            <input
              type="number"
              value={stock}
              onChange={handleStockChange}
              className="w-full px-3 py-2 text-lg font-bold border-2 border-gray-300 rounded-lg text-center focus:border-secondary focus:outline-none"
              min="0"
            />
          </div>

          {/* Unit Dropdown */}
          <div className="col-span-4">
            <label className="text-xs text-gray-600 mb-1 block">Birim</label>
            <select
              value={unit}
              onChange={handleUnitChange}
              className="w-full px-2 py-2 border-2 border-gray-300 rounded-lg bg-white text-sm font-medium focus:border-secondary focus:outline-none"
            >
              <option value="Adet">Adet</option>
              <option value="Kg">Kg</option>
              <option value="Litre">Litre</option>
              <option value="Metre">Metre</option>
              <option value="Kutu">Kutu</option>
              <option value="Paket">Paket</option>
            </select>
          </div>

          {/* Description */}
          <div className="col-span-4">
            <label className="text-xs text-gray-600 mb-1 block">Not</label>
            <input
              type="text"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="..."
              className="w-full px-2 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-secondary focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex mt-3 gap-2">
          <button
            onClick={() => {
              if (window.confirm(`"${product.name}" silinsin mi?`)) {
                onDelete(product._id);
              }
            }}
            className="py-2 w-full bg-primary hover:opacity-90 text-sm text-white rounded-lg transition-colors"
          >
            Ürünü Sil
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`py-2 w-full text-sm text-white rounded-lg transition-colors ${
              hasChanges
                ? "bg-secondary hover:opacity-90"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {hasChanges ? "Kaydet" : "Kaydedildi ✓"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardMobile;