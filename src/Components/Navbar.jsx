import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // ✅ ADDED MOBILE MENU STATE
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartItemsCount } = useCart();
  const { getWishlistItemsCount } = useWishlist();

  //  ADDED USER STATE AND EFFECT TO LOAD USER FROM LOCAL STORAGE
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem("user");

      if (!userData) {
        setUser(null);
        return;
      }

      try {
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);

    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  // Auto-search when search term changes and we're on all-collections page
  useEffect(() => {
    if (location.pathname === "/all-collections" && searchTerm.trim()) {
      const timer = setTimeout(() => {
        navigate(
          `/all-collections?search=${encodeURIComponent(searchTerm.trim())}`,
          { replace: true },
        );
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [searchTerm, location.pathname, navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(
        `/all-collections?search=${encodeURIComponent(searchTerm.trim())}`,
      );
      setSearchTerm("");
      setIsSearchOpen(false);
    }
  };

  // Clear search when navigating away from all-collections
  useEffect(() => {
    if (location.pathname !== "/all-collections") {
      setSearchTerm("");
    }
  }, [location.pathname]);

  // ✅ ADDED MOBILE MENU TOGGLE FUNCTION
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-500 backdrop-blur-md shadow-sm border-b border-gray-100 py-3 z-50">
      <div className="w-[95%] mx-auto flex justify-between items-center px-4 2xl:px-6">
        {/* ✅ Left: Logo & Navigation */}
        <div className="flex items-center space-x-6 2xl:space-x-8">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2 2xl:gap-3 group transition-all duration-300"
          >
            <div className="relative">
              <img
                className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-full border-2 border-gray-300 object-cover group-hover:border-amber-500 transition-colors duration-300"
                src="https://i.pinimg.com/1200x/7a/bf/2c/7abf2ca43b62487de9aa4cfc62686e84.jpg"
                alt="Fashion Store Logo"
              />
              <div className="absolute inset-0 rounded-full bg-amber-500/20 group-hover:bg-amber-500/30 transition-colors duration-300"></div>
            </div>
            <span className="font-bold text-xl 2xl:text-2xl wave-text hidden sm:block">
              CLOTHING SHOP
            </span>
          </NavLink>

          {/* Navigation Links - Show on desktop only (lg and above) */}
          <div className="hidden lg:flex items-center space-x-4 2xl:space-x-6 ml-4">
            {[
              { path: "/men", label: "Men" },
              { path: "/women", label: "Women" },
              { path: "/all-collections", label: "All Collection" },
            ].map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 2xl:px-4 2xl:py-2 rounded-xl transition-all duration-300 font-medium text-sm 2xl:text-base relative overflow-hidden group
                ${
                  isActive
                    ? "text-gray-800 font-semibold bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 shadow-sm"
                    : "text-white hover:text-gray-800"
                }`
                }
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-amber-50 to-yellow-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl"></span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* ✅ Middle: Search Bar - Centered on desktop */}
        {/* Search Bar */}
<div className="hidden lg:flex flex-1 justify-center px-6">
  <form
    onSubmit={handleSearchSubmit}
    className="relative w-full max-w-md"
  >
    {/* Search Icon */}
    <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>

    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="
        w-full
        bg-white
        border border-gray-200
        rounded-full
        pl-11
        pr-10
        py-2.5
        text-sm
        outline-none
        transition-all
        duration-300
        focus:ring-2
        focus:ring-amber-400
        focus:border-amber-400
        shadow-sm
      "
    />

    {/* Clear Button */}
    {searchTerm && (
      <button
        type="button"
        onClick={() => setSearchTerm("")}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    )}
  </form>
</div>

        {/* ✅ Right: Actions */}
        <div className="flex items-center space-x-4 2xl:space-x-6">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="lg:hidden p-2 rounded-xl text-white hover:text-gray-600 hover:bg-amber-50 transition-all duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* About & Contact - Hidden on tablet (md), show on desktop (xl) only */}
          <div className="hidden xl:flex items-center space-x-2 2xl:space-x-4">
            {[
              { path: "/about", label: "About" },
              { path: "/contact", label: "Contact" },
            ].map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 2xl:px-4 2xl:py-2 rounded-xl transition-all duration-300 font-medium text-sm 2xl:text-base relative overflow-hidden group
                ${
                  isActive
                    ? "text-gray-800 font-semibold bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 shadow-sm"
                    : "text-white hover:text-gray-800"
                }`
                }
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-amber-50 to-yellow-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl"></span>
              </NavLink>
            ))}
          </div>

          {/* Wishlist Icon */}
          <div className="relative group">
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `p-2 2xl:p-3 rounded-xl transition-all duration-300 relative flex items-center hover:scale-105 active:scale-95 ${
                  isActive
                    ? "text-pink-600 bg-amber-50 border border-amber-200"
                    : "text-white hover:text-pink-600 hover:bg-amber-50"
                }`
              }
            >
              <FaHeart className="w-5 h-5 2xl:w-6 2xl:h-6" />
              {getWishlistItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 2xl:w-5 2xl:h-5 flex items-center justify-center font-semibold text-[10px] 2xl:text-xs">
                  {getWishlistItemsCount()}
                </span>
              )}
            </NavLink>
          </div>

          {/* Cart Icon */}
          <div className="relative group">
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `p-2 2xl:p-3 rounded-xl transition-all duration-300 relative flex items-center hover:scale-105 active:scale-95 ${
                  isActive
                    ? "text-gray-600 bg-amber-50 border border-amber-200"
                    : "text-white hover:text-gray-600 hover:bg-amber-50"
                }`
              }
            >
              <i className="fa-solid fa-cart-shopping text-lg 2xl:text-xl"></i>
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 2xl:w-5 2xl:h-5 flex items-center justify-center font-semibold text-[10px] 2xl:text-xs">
                  {getCartItemsCount()}
                </span>
              )}
            </NavLink>
          </div>

         
          {/* Login/User Button - Show on desktop (lg) and above */}
          <div className="hidden lg:flex items-center">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-white font-medium text-sm">
                  Hi, {user.first_name || user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl font-medium text-sm bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-4 py-2 2xl:px-6 2xl:py-3 rounded-xl font-medium text-sm 2xl:text-base transition-all duration-300 relative overflow-hidden group shadow-lg
                ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xl scale-105"
                    : "bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600 hover:shadow-xl hover:scale-105 active:scale-95"
                }`
                }
              >
                <span className="relative z-10">Login</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button - Show on tablet and below */}
          <button
            onClick={toggleMobileMenu}
            className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${
              isMobileMenuOpen
                ? "text-gray-600 bg-amber-50 border border-white"
                : "text-white hover:text-gray-600 hover:bg-amber-50"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="lg:hidden px-4 py-3 border-t border-gray-100 bg-white">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 rounded-xl pl-10 pr-12 py-3 text-sm border border-gray-200 outline-none  focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
              autoFocus
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-amber-500"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full right-4 lg:hidden bg-white rounded-xl shadow-2xl border border-gray-200 z-50 w-48">
          <div className="p-4">
            <div className="space-y-2">
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl transition-all duration-300 font-medium text-center text-sm
                ${
                  isActive
                    ? "text-amber-600 font-semibold bg-amber-50 border border-amber-200"
                    : "text-gray-700 hover:text-amber-700 hover:bg-amber-50"
                }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl transition-all duration-300 font-medium text-center text-sm
                ${
                  isActive
                    ? "text-amber-600 font-semibold bg-amber-50 border border-amber-200"
                    : "text-gray-700 hover:text-amber-700 hover:bg-amber-50"
                }`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl transition-all duration-300 font-medium text-center text-sm
                ${
                  isActive
                    ? "text-amber-600 font-semibold bg-amber-50 border border-amber-200"
                    : "text-gray-700 hover:text-amber-700 hover:bg-amber-50"
                }`
                }
              >
                Contact
              </NavLink>
             
              {user ? (
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-3 rounded-xl bg-red-500 text-white font-medium text-center text-sm hover:bg-red-600 transition-all duration-300"
                >
                  Logout
                </button>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-white font-medium text-center text-sm hover:from-amber-500 hover:to-amber-600 transition-all duration-300"
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation - Show on tablet and below */}
      <div className="lg:hidden border-t border-gray-100 mt-3 pt-3 px-4">
        <div className="flex items-center justify-around">
          {["men", "women", "all-collections"].map((item) => (
            <NavLink
              key={item}
              to={`/${item}`}
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl transition-all duration-300 font-medium text-sm text-center
              ${
                isActive
                  ? "text-gray-600 font-semibold bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 shadow-sm"
                  : "text-white hover:text-gray-600 hover:bg-white"
              }`
              }
            >
              {item.charAt(0).toUpperCase() + item.slice(1).replace("-", " ")}
            </NavLink>
          ))}
        </div>
      </div>
      <style>{`
        .wave-text {
          background: linear-gradient(
            90deg,
            #ef4444,
            #f59e0b,
            #10b981,
            #3b82f6,
            #8b5cf6,
            #ec4899,
            #ef4444
          );
          background-size: 400% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: wave 4s linear infinite;
        }

        @keyframes wave {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 400% 50%;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
