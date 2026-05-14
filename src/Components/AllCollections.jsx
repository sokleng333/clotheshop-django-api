import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import {
  FaStar,
  FaHeart,
  FaShoppingCart,
  FaFilter,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

const DEFAULT_SIZES = ["S", "M", "L", "XL"];

const getCategoryName = (category) => {
  if (typeof category === "string") return category;
  return category?.name || "";
};

const getProductSizes = (sizes) => {
  if (!Array.isArray(sizes) || sizes.length === 0) return DEFAULT_SIZES;
  return sizes.map((size) => (typeof size === "string" ? size : size.size)).filter(Boolean);
};

const normalizeProduct = (product) => ({
  ...product,
  title: product.title || product.name || "Product",
  name: product.name || product.title || "Product",
  category: getCategoryName(product.category) || "uncategorized",
  sizes: getProductSizes(product.sizes),
  rating:
    typeof product.rating === "object"
      ? product.rating
      : { rate: product.rating || 4.5, count: product.ratingCount || 100 },
});

const AllCollections = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [openSizeDropdowns, setOpenSizeDropdowns] = useState({});

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const location = useLocation();

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "All Collections",
      subtitle: "Discover our complete range of premium fashion",
    },
    {
      image: "https://i.pinimg.com/1200x/92/22/d3/9222d33e44c600cbce02c285359c5023.jpg",
      title: "Premium Quality",
      subtitle: "Curated selection of the finest clothing items",
    },
    {
      image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      title: "Latest Trends",
      subtitle: "Stay ahead with our newest arrivals",
    },
  ];

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Read search from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search");
    if (searchQuery) setSearchTerm(searchQuery);
  }, [location.search]);

  useEffect(() => {
    const applyProducts = (products) => {
      const transformedData = products.map(normalizeProduct);
      setData(transformedData);
      setFilteredData(transformedData);

      const initialSizes = {};
      transformedData.forEach((product) => {
        initialSizes[product.id] = product.sizes[0] || "M";
      });
      setSelectedSizes(initialSizes);
    };

    const loadProducts = async () => {
      try {
        const apiRes = await fetch("http://127.0.0.1:8000/api/products/");
        if (!apiRes.ok) throw new Error("API request failed");
        const apiJson = await apiRes.json();
        applyProducts(Array.isArray(apiJson) ? apiJson : apiJson.products || []);
      } catch (err) {
        const localRes = await fetch("/data/products.json");
        const localJson = await localRes.json();
        applyProducts(localJson.products || []);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const toggleSizeDropdown = (productId) => {
    setOpenSizeDropdowns((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
    setOpenSizeDropdowns((prev) => ({ ...prev, [productId]: false }));
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name || product.title,
      price: product.price,
      image: product.image,
      category: product.category?.name || product.category,
      size: selectedSizes[product.id],
    });
  };

  // Filter and sort
  useEffect(() => {
    let results = [...data];

    if (searchTerm) {
      results = results.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getCategoryName(item.category).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    results = results.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    if (selectedCategory !== "all") {
      results = results.filter(
        (item) => getCategoryName(item.category).toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    switch (sortBy) {
      case "price-low": results.sort((a, b) => a.price - b.price); break;
      case "price-high": results.sort((a, b) => b.price - a.price); break;
      case "rating": results.sort((a, b) => b.rating?.rate - a.rating?.rate); break;
      case "name": results.sort((a, b) => a.title.localeCompare(b.title)); break;
      default: break;
    }

    setFilteredData(results);
  }, [data, sortBy, priceRange, searchTerm, selectedCategory]);

  const categories = [
    { id: "all", name: "All Products", count: data.length },
    { id: "men", name: "Men's Fashion", count: data.filter((item) => getCategoryName(item.category).toLowerCase().includes("men")).length },
    { id: "women", name: "Women's Fashion", count: data.filter((item) => getCategoryName(item.category).toLowerCase().includes("women")).length },
  ];

  const getCategoryColor = (category) => {
    const name = getCategoryName(category).toLowerCase();
    switch (name) {
      case "men": return "from-blue-500 to-blue-600";
      case "women": return "from-pink-500 to-rose-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 1000]);
    setSelectedCategory("all");
    setSortBy("default");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
          </div>
        ))}

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"}`}
            />
          ))}
        </div>

        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              All Collections
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover our complete range of premium fashion
            </p>
            <button
              onClick={() => document.getElementById("products").scrollIntoView({ behavior: "smooth" })}
              className="group bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-amber-400 hover:scale-105 transform transition-all duration-300 shadow-2xl flex items-center gap-2 mx-auto"
            >
              Explore Collections
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <div id="products" className="py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Search Results Info */}
          {searchTerm && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Search Results</h2>
              <p className="text-gray-600">
                Found <span className="font-semibold text-blue-600">{filteredData.length}</span> products matching "
                <span className="text-blue-600 font-semibold">{searchTerm}</span>"
              </p>
            </div>
          )}

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200"
            >
              <FaFilter />
              <span>Filters</span>
            </button>
            <div className="text-sm text-gray-600">{filteredData.length} products</div>
          </div>

          {/* Filters Bar */}
          <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 transition-all duration-300 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="default">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="name">Name A-Z</option>
              </select>
              <button
                onClick={resetFilters}
                className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-300 flex items-center gap-2"
              >
                <FaTimes />
                <span>Reset</span>
              </button>
            </div>

            {/* Category Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${getCategoryColor(category.id)} text-white shadow-lg`
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${selectedCategory === category.id ? "bg-white/20" : "bg-gray-200"}`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedCategory !== "all" || priceRange[1] < 1000) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {searchTerm && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="hover:text-blue-900">
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  Category: {categories.find((c) => c.id === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory("all")} className="hover:text-green-900">
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
              {priceRange[1] < 1000 && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  Price: up to ${priceRange[1]}
                  <button onClick={() => setPriceRange([0, 1000])} className="hover:text-purple-900">
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? `No products found for "${searchTerm}".` : "Try adjusting your filters"}
              </p>
              <button onClick={resetFilters} className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-blue-300"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Wishlist */}
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(item); }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${isInWishlist(item.id) ? "bg-red-500 text-white" : "bg-white/80 text-gray-600"} hover:scale-105 active:scale-95`}
                    >
                      <FaHeart className="text-sm" />
                    </button>

                    {/* Rating */}
                    <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        <span>{item.rating?.rate?.toFixed(1) || "4.5"}</span>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className={`absolute bottom-3 left-3 bg-gradient-to-r ${getCategoryColor(item.category)} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                      {getCategoryName(item.category) || "Unknown"}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {item.title}
                    </h3>

                    {/* Size Selector */}
                    <div className="mb-3">
                      <label className="flex gap-3 text-md font-medium text-gray-700 mb-2">
                        <span className="py-2 font-bold">Size:</span>
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSizeDropdown(item.id); }}
                          className="w-[40px] px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 flex items-center justify-between hover:bg-gray-100"
                        >
                          <span className="text-gray-700 font-medium">{selectedSizes[item.id]}</span>
                        </button>
                      </label>
                      <div className="relative">
                        {openSizeDropdowns[item.id] && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-3">
                            <div className="flex flex-wrap gap-2 justify-center">
                              {item.sizes?.map((size) => (
                                <button
                                  key={size}
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSizeSelect(item.id, size); }}
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
                        <span className="text-2xl font-bold text-blue-600">${item.price}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">Free Shipping</span>
                      </div>
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(item); }}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                      >
                        <FaShoppingCart className="text-sm" />
                        <span>Add</span>
                      </button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <Link
                        to={`/product/${item.id}`}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-50 to-rose-50 hover:from-blue-100 hover:to-blue-100 text-blue-600 hover:text-blue-700 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95 border border-blue-100 hover:border-blue-200"
                      >
                        <span className="font-semibold">View Details</span>
                        <FaEye className="text-sm group-hover:scale-110 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <img className="w-12 h-12 rounded-full border-2 border-amber-500 object-cover" src="https://i.pinimg.com/1200x/7a/bf/2c/7abf2ca43b62487de9aa4cfc62686e84.jpg" alt="CLOTHING SHOP" />
                <span className="font-bold text-2xl text-amber-400">CLOTHING SHOP</span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-xl">
                Your premier destination for trendy and affordable fashion.
              </p>
              <div className="flex gap-4">
                <NavLink to="/all-collections" className="bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors duration-300">Shop Now</NavLink>
                <NavLink to="/about" className="border-2 border-amber-500 text-amber-500 px-6 py-3 rounded-lg font-semibold hover:bg-amber-500 hover:text-white transition-colors duration-300">About</NavLink>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 text-amber-400">Shop</h3>
              <div className="space-y-4">
                <NavLink to="/men" className="block text-gray-300 hover:text-amber-400 transition-colors duration-300 text-lg">Men's Collection</NavLink>
                <NavLink to="/women" className="block text-gray-300 hover:text-amber-400 transition-colors duration-300 text-lg">Women's Collection</NavLink>
                <NavLink to="/all-collections" className="block text-gray-300 hover:text-amber-400 transition-colors duration-300 text-lg">All Products</NavLink>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 text-amber-400">Support</h3>
              <div className="space-y-4">
                <NavLink to="/contact" className="block text-gray-300 hover:text-amber-400 transition-colors duration-300 text-lg">Contact Us</NavLink>
                <NavLink to="/faq" className="block text-gray-300 hover:text-amber-400 transition-colors duration-300 text-lg">FAQ</NavLink>
                <NavLink to="/size-guide" className="block text-gray-300 hover:text-amber-400 transition-colors duration-300 text-lg">Size Guide</NavLink>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 py-6 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">© 2024 CLOTHING SHOP. All rights reserved.</div>
            <div className="flex gap-8 text-gray-400">
              <NavLink to="/privacy" className="hover:text-amber-400 transition-colors duration-300">Privacy Policy</NavLink>
              <NavLink to="/terms" className="hover:text-amber-400 transition-colors duration-300">Terms of Service</NavLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AllCollections;
