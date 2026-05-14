import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaHeart,
  FaShoppingCart,
  FaArrowLeft,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(""); // ✅ ADD SIZE STATE

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((json) => {
        const foundProduct = json.products.find((p) => p.id === parseInt(id));
        
        const transformedProduct = foundProduct ? {
          ...foundProduct,
          title: foundProduct.name || foundProduct.title,
          rating: {
            rate: foundProduct.rating || 4.5,
            count: foundProduct.ratingCount || Math.floor(Math.random() * 200) + 50
          },
          // ✅ ADD SIZES DATA - DEFAULT SIZES IF NOT PROVIDED
          sizes: foundProduct.sizes || ["S", "M", "L", "XL"]
        } : null;
        
        setProduct(transformedProduct);
        // ✅ SET DEFAULT SIZE WHEN PRODUCT LOADS
        if (transformedProduct) {
          setSelectedSize(transformedProduct.sizes[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  // Fetch related products
  useEffect(() => {
    if (product) {
      fetch('/data/products.json')
        .then(res => res.json())
        .then(json => {
          const related = json.products
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4);
          setRelatedProducts(related);
        })
        .catch(err => console.log(err));
    }
  }, [product]);

  const handleAddToCart = () => {
    // ✅ INCLUDE SELECTED SIZE IN CART ITEM
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name || product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        size: selectedSize, // ✅ ADD SIZE TO CART
      });
    }
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // ✅ SIZE SELECTION HANDLER
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link
              to="/"
              className="hover:text-blue-600 transition-colors duration-300"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              to="/all-collections"
              className="hover:text-blue-600 transition-colors duration-300"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-96 object-contain"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 uppercase tracking-wide">
                  {product.category}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    <FaStar className="text-yellow-400" />
                    <span className="text-sm font-medium">
                      {product.rating?.rate || 4.5}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.rating?.count || 100} reviews)
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-blue-600">
                  ${product.price}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-full">
                  Free Shipping
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* ✅ SIZE SELECTOR */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Size:
                  </span>
                  <span className="text-sm text-blue-600 font-medium">
                    {selectedSize}
                  </span>
                </div>
                <div className="flex gap-3">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`px-6 py-3 border-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                        selectedSize === size
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-300 text-gray-700 hover:border-blue-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-sm font-medium text-gray-700">
                  Quantity:
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseQuantity}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-300 hover:scale-105 active:scale-95"
                  >
                    <FaMinus className="text-sm" />
                  </button>
                  <span className="w-12 text-center text-lg font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-300 hover:scale-105 active:scale-95"
                  >
                    <FaPlus className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <FaShoppingCart />
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 ${
                    isInWishlist(product.id)
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaHeart />
                  {isInWishlist(product.id) ? "In favorite" : "Favorite"}
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FaTruck className="text-green-500" />
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FaShieldAlt className="text-blue-500" />
                  <span>Secure payment</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FaUndo className="text-purple-500" />
                  <span>30-day returns</span>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 hover:scale-105"
            >
              <FaArrowLeft />
              <span>Back to Products</span>
            </button>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-blue-300 block"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">
                        ${item.price}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                        Free Shipping
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 col-span-4">
                Loading related products...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
