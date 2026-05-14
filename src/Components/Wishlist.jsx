import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaShoppingCart,
  FaHome,
  FaTrash,
  FaStar,
  FaArrowRight,
  FaChevronDown,
} from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const Wishlist = () => {
  const {
    items,
    removeFromWishlist,
    clearWishlist,
    getWishlistItemsCount,
    toggleWishlist,
    isInWishlist,
  } = useWishlist();
  const { addToCart } = useCart();

  // ✅ ADD STATE FOR SELECTED SIZES AND DROPDOWNS
  const [selectedSizes, setSelectedSizes] = useState({});
  const [openSizeDropdowns, setOpenSizeDropdowns] = useState({});

  // ✅ INITIALIZE SIZES WHEN COMPONENT LOADS
  React.useEffect(() => {
    const initialSizes = {};
    items.forEach((item) => {
      initialSizes[item.id] = item.sizes?.[0] || "M";
    });
    setSelectedSizes(initialSizes);
  }, [items]);

  // ✅ ADD SIZE DROPDOWN TOGGLE HANDLER
  const toggleSizeDropdown = (productId) => {
    setOpenSizeDropdowns((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // ✅ ADD SIZE SELECTION HANDLER
  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
    setOpenSizeDropdowns((prev) => ({
      ...prev,
      [productId]: false,
    }));
  };

  // ✅ UPDATE ADD TO CART TO INCLUDE SELECTED SIZE
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name || product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      size: selectedSizes[product.id] || "M", // ✅ ADD SELECTED SIZE
    });
  };

  const handleMoveAllToCart = () => {
    items.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name || item.title,
        price: item.price,
        image: item.image,
        category: item.category,
        size: selectedSizes[item.id] || "M", // ✅ ADD SELECTED SIZE
      });
    });
    clearWishlist();
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "men's clothing":
        return "from-blue-500 to-blue-600";
      case "women's clothing":
        return "from-pink-500 to-rose-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  // ✅ GET AVAILABLE SIZES BASED ON CATEGORY
  const getAvailableSizes = (category) => {
    switch (category) {
      case "men's clothing":
        return ["S", "M", "L", "XL"];
      case "women's clothing":
        return ["S", "M", "L", "XL"];
      default:
        return ["S", "M", "L", "XL"];
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 pt-20 pb-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-lg p-12">
            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHeart className="text-3xl text-pink-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Aww ..Snap. You haven't added any store yet!
            </h2>
            <p className="text-gray-600 mb-8">
              Tap on <i className="fa-solid fa-heart text-red-600"></i> icon to add store to your Favorite list
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/all-collections"
                className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-700 transition-all duration-300 hover:scale-105"
              >
                ADD YOUR FAVORITE NOW !
              </Link>
              <Link
                to="/"
                className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-pink-500 hover:text-pink-600 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <FaHome />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 pt-20 pb-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
            Your Favorite
          </h1>
          <p className="text-gray-600">
            {getWishlistItemsCount()} items saved for later
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleMoveAllToCart}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105"
          >
            Move All to Cart
          </button>
          <button
            onClick={clearWishlist}
            className="text-gray-500 hover:text-red-600 transition-colors duration-300 flex items-center gap-2 hover:scale-105"
          >
            <FaTrash />
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-pink-300 block"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name || item.title}
                  className="w-full h-64 object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                />

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(item);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                    isInWishlist(item.id)
                      ? "bg-red-500 text-white"
                      : "bg-white/80 text-gray-600"
                  } hover:scale-105 active:scale-95`}
                >
                  <FaHeart className="text-sm" />
                </button>

                {/* Rating Badge */}
                <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span>
                      {item.rating?.rate?.toFixed(1) || item.rating || 4.5}
                    </span>
                  </div>
                </div>

                {/* Category Badge */}
                <div
                  className={`absolute bottom-3 left-3 bg-gradient-to-r ${getCategoryColor(
                    item.category
                  )} text-white px-2 py-1 rounded-full text-xs font-medium`}
                >
                  {item.category === "men's clothing" ? "Men's" : "Women's"}
                </div>

                {/* Popular Badge */}
                {item.price < 50 && (
                  <div className="absolute top-12 left-3 bg-rose-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Popular
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-pink-600 transition-colors duration-300">
                  {item.name || item.title}
                </h3>

                {/* ✅ ADD SIZE SELECTOR */}
                <div className=" mb-3">
                      <label className="flex gap-3 text-md font-medium text-gray-700 mb-2">
                        <span className="py-2 text-1xl font-bold">Size:</span>
                        {/* <span className="ml-2 text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                            {selectedSizes[item.id]}
                            </span> */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleSizeDropdown(item.id);
                          }}
                          className="w-[40px] px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 flex items-center justify-between hover:bg-gray-100"
                        >
                          <span className="text-gray-700 font-medium">
                            {selectedSizes[item.id]}
                          </span>
                          {/* <FaChevronDown
                              className={`text-gray-400 transition-transform duration-300 ${
                                openSizeDropdowns[item.id] ? "rotate-180" : ""
                                }`}
                                /> */}
                        </button>
                      </label>
                      <div className="relative">
                        {/* Size Display Button */}

                        {/* Dropdown Menu - HORIZONTAL LAYOUT */}
                        {openSizeDropdowns[item.id] && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-3">
                            <div className="flex flex-wrap gap-2 justify-center">
                              {item.sizes?.map((size) => (
                                <button
                                  key={size}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSizeSelect(item.id, size);
                                  }}
                                  className={`min-w-[40px] px-3 py-2 rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 font-medium ${
                                    selectedSizes[item.id] === size
                                      ? "border-blue-600 bg-blue-600 text-white shadow-md"
                                      : "border-gray-300 bg-gray-50 text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-pink-600">
                      ${item.price}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full w-fit mt-1">
                      Free Shipping
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(item, e)}
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    <FaShoppingCart className="text-sm" />
                    <span>Add</span>
                  </button>
                </div>

                {/* View Details Link */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <Link
                    to={`/product/${item.id}`}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 text-pink-600 hover:text-pink-700 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95 group cursor-pointer border border-pink-100 hover:border-pink-200"
                  >
                    <span className="font-semibold">View Details</span>
                    <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
