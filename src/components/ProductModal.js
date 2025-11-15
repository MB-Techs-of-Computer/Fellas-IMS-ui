import { Fragment, useContext, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import AuthContext from "../AuthContext";
import { addProduct, updateProduct } from "../utils/api";

export default function ProductModal({
  isOpen,
  onClose,
  productData = null, // null ise Add mode, data varsa Edit mode
  onSuccess,
}) {
  const authContext = useContext(AuthContext);
  const isEditMode = productData !== null;
  
  const [product, setProduct] = useState({
    userId: authContext.user,
    name: "",
    manufacturer: "",
    description: "",
    stock: 0,
    unit: "Adet",
  });

  const cancelButtonRef = useRef(null);

  // Edit mode ise product data'yı doldur
  useEffect(() => {
    if (isEditMode && productData) {
      setProduct({
        ...product,
        name: productData.name || "",
        manufacturer: productData.manufacturer || "",
        description: productData.description || "",
        stock: productData.stock || 0,
        unit: productData.unit || "Adet",
      });
    } else {
      // Add mode - reset form
      setProduct({
        userId: authContext.user,
        name: "",
        manufacturer: "",
        description: "",
        stock: 0,
        unit: "Adet",
      });
    }
  }, [isEditMode, productData]);

  const handleInputChange = (key, value) => {
    setProduct({ ...product, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        // Update existing product
        await updateProduct(productData._id, product);
        alert("Ürün güncellendi!");
      } else {
        // Add new product
        await addProduct(product);
        alert("Ürün eklendi!");
      }
      
      onSuccess(); // Listeyi yenile
      onClose(); // Modal'ı kapat
    } catch (err) {
      console.log(err);
      alert("Hata oluştu");
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900"
                      >
                        {isEditMode ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
                      </Dialog.Title>
                      <form action="#" className="mt-4">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="name"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Ürün Adı
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={product.name}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5"
                              placeholder="Örn: Un"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="manufacturer"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Üretici / Marka
                            </label>
                            <input
                              type="text"
                              name="manufacturer"
                              id="manufacturer"
                              value={product.manufacturer}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5"
                              placeholder="Örn: Söke"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="stock"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Stok
                            </label>
                            <input
                              type="number"
                              name="stock"
                              id="stock"
                              value={product.stock}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5"
                              placeholder="0"
                              min="0"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="unit"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Birim
                            </label>
                            <select
                              name="unit"
                              id="unit"
                              value={product.unit}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5"
                            >
                              <option value="Adet">Adet</option>
                              <option value="Litre">Litre</option>
                              <option value="Kutu">Kutu</option>
                              <option value="Paket">Paket</option>
                              <option value="Kg">Kg</option>
                              <option value="Metre">Gram</option>
                            </select>
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              htmlFor="description"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Açıklama / Notlar
                            </label>
                            <textarea
                              id="description"
                              rows="4"
                              name="description"
                              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-secondary focus:border-secondary"
                              placeholder="Ürün hakkında notlar..."
                              value={product.description}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                    onClick={handleSubmit}
                  >
                    {isEditMode ? "Güncelle" : "Ekle"}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                    ref={cancelButtonRef}
                  >
                    İptal
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}