import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaShoppingBag,
  FaArrowLeft,
  FaCreditCard,
  FaLock,
  FaTruck,
  FaShieldAlt,
  FaHome,
  FaArrowRight,
  FaChevronDown,
  FaQrcode,
  FaCopy,
  FaCheckCircle,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    updateSize,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  } = useCart();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [openSizeDropdowns, setOpenSizeDropdowns] = useState({});

  const heroSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "Your Shopping Cart",
      subtitle: "Review your selected items and complete your order",
    },
    {
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "Secure Checkout",
      subtitle: "Safe and encrypted payment processing",
    },
    {
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "Fast Delivery",
      subtitle: "Free shipping on all orders",
    },
  ];

  // Move functions before bankAccounts
  const getSubtotal = () => getCartTotal();
  const getShippingCost = () => 0;
  const getTotal = () => getSubtotal() + getShippingCost();

  // Bank account information - now using getTotal() after it's defined
  const bankAccounts = {
    aba: {
      name: "ABA Bank",
      accountName: "FASHION STORE CO., LTD",
      accountNumber: "123 456 789",
      qrCode: `https://i.pinimg.com/736x/81/58/84/8158842fe3e81efce11db9336498f7ef.jpg`,
      color: "from-blue-500 to-blue-600",
      icon: "🏦",
      instructions: [
        "Open ABA Mobile App",
        "Tap 'Transfer' or 'Scan & Pay'",
        "Scan the QR code above",
        `Verify amount: $${getTotal().toFixed(2)}`,
        "Confirm payment",
      ],
    },
    acleda: {
      name: "ACLEDA Bank",
      accountName: "FASHION STORE CO., LTD",
      accountNumber: "987 654 321",
      qrCode: `/image/qr-code/ac-qr.png`,
      color: "from-green-500 to-green-600",
      icon: "🏦",
      instructions: [
        "Open ACLEDA Mobile App",
        "Select 'Quick Transfer'",
        "Scan QR Code or enter account number",
        `Amount: $${getTotal().toFixed(2)}`,
        "Complete transaction",
      ],
    },
    wing: {
      name: "Wing",
      accountName: "FASHION STORE",
      accountNumber: "012 345 678",
      qrCode: `/image/qr-code/wing-qr.png`,
      color: "from-orange-500 to-orange-600",
      icon: "💸",
      instructions: [
        "Open Wing App",
        "Tap 'Pay Bill' or 'Scan to Pay'",
        "Scan QR Code",
        `Amount: $${getTotal().toFixed(2)}`,
        "Enter PIN to confirm",
      ],
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const toggleSizeDropdown = (itemId) => {
    setOpenSizeDropdowns((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleSizeUpdate = (itemId, currentSize, newSize) => {
    if (currentSize !== newSize) {
      updateSize(itemId, currentSize, newSize);
    }
    setOpenSizeDropdowns((prev) => ({
      ...prev,
      [itemId]: false,
    }));
  };

  const continueShopping = () => navigate("/all-collections");

  const proceedToCheckout = async () => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    if (!token) {
        Swal.fire({
            title: 'Login Required',
            text: 'Please login to proceed to checkout',
            icon: 'warning',
            confirmButtonText: 'Login',
            confirmButtonColor: '#2563eb',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) navigate('/login');
        });
        return;
    }

    Swal.fire({
        title: "Select Payment Method",
        html: `...`, // keep your existing html
        // ... keep all your existing Swal options
    }).then(async (result) => {
        if (result.isConfirmed) {
            const selectedPayment = document.querySelector('input[name="payment"]:checked').value;

            // ✅ Step 1 - Send cart to Django checkout
            try {
                // First add all cart items to Django cart
                for (const item of cartItems) {
                    await fetch('http://127.0.0.1:8000/api/cart/add/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            product_id: item.id,
                            size: item.size,
                            quantity: item.quantity
                        })
                    });
                }

                // ✅ Step 2 - Checkout (creates order)
                const checkoutRes = await fetch('http://127.0.0.1:8000/api/checkout/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const checkoutData = await checkoutRes.json();

                if (!checkoutRes.ok) {
                    Swal.fire('Error', checkoutData.error || 'Checkout failed', 'error');
                    return;
                }

                const orderId = checkoutData.order_id;

                // ✅ Step 3 - Create payment
                const paymentRes = await fetch('http://127.0.0.1:8000/api/payment/create/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        order_id: orderId,
                        method: selectedPayment
                    })
                });

                const paymentData = await paymentRes.json();
                const paymentId = paymentData.payment_id;

                // ✅ Store for later confirmation
                localStorage.setItem('pending_payment_id', paymentId);
                localStorage.setItem('pending_order_id', orderId);

                // Show bank payment UI
                showBankPayment(selectedPayment);

            } catch (err) {
                Swal.fire('Error', 'Cannot connect to server', 'error');
            }
        }
    });
};

  const showBankPayment = (bankType) => {
    const bank = bankAccounts[bankType];

    Swal.fire({
      html: `
      <div style="text-align: center;">
       <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: linear-gradient(to right, ${
  bank.name === "ABA Bank" 
    ? "#0066b3, #004a8f"  // ✅ ABA Bank colors (blue)
    : bank.name === "ACLEDA Bank" 
    ? "#1F1054, #1A0D47"  // ✅ ACLEDA Bank colors (green) 
    : "#24B329, #22B317"  // ✅ Wing colors (orange)
}); border-radius: 1.5rem; color: white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); display: inline-block; width: auto; min-width: 200px; max-width: 300px;">
  <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem; text-align: center;">${
    bank.name
  }</h3>
  <p style="font-size: 1.25rem; text-align: center;">$${getTotal().toFixed(
    2
  )}</p>
  <p style="font-size: 0.875rem; opacity: 0.9; text-align: center;">Total Amount</p>
</div>
        
        <!-- QR Code Section - Moved to TOP -->
        <div style="text-align: center; margin-bottom: 2rem;">
          <h4 style="font-weight: 600; color: #1f2937; margin-bottom: 1rem; font-size: 1.125rem;">Scan QR Code to Pay</h4>
          <div style="background-color: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); display: inline-block; border: 2px solid #f3f4f6;">
            <img src="${
              bank.qrCode
            }" alt="QR Code" style="width: 18rem; height: 18rem; border-radius: 0.5rem;"/>
          </div>
          <p style="font-size: 0.875rem; color: #6b7280; margin-top: 0.75rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
            </svg>
            Scan with your banking app
          </p>
        </div>
 
      </div>
    `,
      width: 800,
      showCancelButton: true,
      confirmButtonText: "I Have Completed Payment",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      customClass: {
        popup: "rounded-3xl",
        confirmButton: "px-8 py-3 rounded-xl font-semibold shadow-lg",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        verifyPayment(bankType);
      }
    });
  };

 const verifyPayment = async (bankType) => {
    Swal.fire({
        title: "Processing Payment",
        showConfirmButton: false,
        allowOutsideClick: false,
        timer: 2500,
        timerProgressBar: true,
        didOpen: () => Swal.showLoading(),
    }).then(async () => {
        const token = localStorage.getItem('access_token');
        const paymentId = localStorage.getItem('pending_payment_id');

        try {
            // ✅ Confirm payment in Django
            const confirmRes = await fetch('http://127.0.0.1:8000/api/payment/confirm/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ payment_id: paymentId })
            });

            const confirmData = await confirmRes.json();

            if (confirmRes.ok) {
                // Clear pending
                localStorage.removeItem('pending_payment_id');
                localStorage.removeItem('pending_order_id');
                showPaymentSuccess(bankType);
            } else {
                Swal.fire('Error', confirmData.error || 'Payment failed', 'error');
            }
        } catch (err) {
            Swal.fire('Error', 'Cannot connect to server', 'error');
        }
    });
};

  const showPaymentSuccess = (paymentMethod) => {
    const methodName =
      paymentMethod === "credit"
        ? "Credit/Debit Card"
        : bankAccounts[paymentMethod]?.name;
    const orderId = `FS${Date.now().toString().slice(-8)}`;

    // Use your local GIF file
    const yourGifUrl =
      "https://i.pinimg.com/originals/96/9c/3a/969c3a7d11ac4a0d6a5b73d90928603e.gif"; // ឬ path របស់ GIF នៅក្នុង project អ្នក

    Swal.fire({
      title: "🎉 Payment Successful!",
      html: `
      <div style="text-align: center;">
        <div style="margin-bottom: 1.5rem;">
          <img 
            src="${yourGifUrl}" 
            alt="Success Celebration" 
            style="width: 200px; height: 200px; border-radius: 1rem; object-fit: cover; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.1);"
          />
        </div>
        
        <div style="background: linear-gradient(to right, #d1fae5, #bbf7d0); border: 1px solid #a7f3d0; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem;">
          <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.875rem;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #374151;">Order ID:</span>
              <span style="font-family: monospace; font-weight: bold; color: #1f2937;">${orderId}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #374151;">Payment Method:</span>
              <span style="font-weight: 600; color: #059669;">${methodName}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #374151;">Amount Paid:</span>
              <span style="font-weight: bold; font-size: 1.125rem; color: #059669;">$${getTotal().toFixed(
                2
              )}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #374151;">Items:</span>
              <span style="font-weight: 600;">${getCartItemsCount()} products</span>
            </div>
          </div>
        </div>
        
        <p style="color: #6b7280; margin-bottom: 0.5rem; font-size: 1.125rem; font-weight: 500;">Thank you for your purchase! 🎊</p>
        <p style="font-size: 0.875rem; color: #9ca3af;">Your order will be processed and shipped within 24 hours.</p>
      </div>
    `,
      width: 500,
      confirmButtonText: "Continue Shopping",
      confirmButtonColor: "#10b981",
      customClass: {
        popup: "rounded-3xl",
        title: "text-2xl font-bold text-gray-800 mb-2",
        confirmButton:
          "px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        navigate("/all-collections");
      }
    });
  };

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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <section className="relative h-96 overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
            </div>
          ))}

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Shopping Cart
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                Your fashion journey starts here
              </p>

              <div className="flex gap-4 justify-center items-center">
                <button
                  onClick={continueShopping}
                  className="group bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-amber-400 hover:scale-105 transform transition-all duration-300 shadow-2xl flex items-center gap-2"
                >
                  Start Shopping
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="py-10 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingBag className="text-3xl text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start
                shopping to discover amazing products!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={continueShopping}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg"
                >
                  Continue Shopping
                </button>
                <Link
                  to="/"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 text-center flex items-center justify-center gap-2"
                >
                  <FaHome />
                  Go Home
                </Link>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Popular Collections
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  to="/men"
                  className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 text-center hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg"
                >
                  <h4 className="text-xl font-bold mb-2">Men's Collection</h4>
                  <p className="text-blue-100">
                    Discover trendy fashion for men
                  </p>
                </Link>
                <Link
                  to="/women"
                  className="bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-2xl p-6 text-center hover:from-pink-600 hover:to-rose-700 transition-all duration-300 hover:shadow-lg"
                >
                  <h4 className="text-xl font-bold mb-2">Women's Collection</h4>
                  <p className="text-pink-100">Elegant styles for women</p>
                </Link>
                <Link
                  to="/all-collections"
                  className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 text-center hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg"
                >
                  <h4 className="text-xl font-bold mb-2">All Products</h4>
                  <p className="text-purple-100">Browse everything we offer</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <section className="relative h-64 overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
          </div>
        ))}

        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Review your items and proceed to checkout
            </p>
          </div>
        </div>
      </section>

      <div className="py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    Your Items ({getCartItemsCount()})
                  </h2>
                  <button
                    onClick={continueShopping}
                    className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                  >
                    <FaArrowLeft />
                    Continue Shopping
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size || "no-size"}`}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-xl"
                        />
                      </div>

                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-800 text-lg mb-1">
                              {item.name}
                            </h3>
                            <p className="text-gray-600 text-sm capitalize">
                              {item.category}
                            </p>

                            <div className="mt-2">
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">
                                  Size:
                                </span>
                                <div className="relative">
                                  <button
                                    onClick={() => toggleSizeDropdown(item.id)}
                                    className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                  >
                                    <span>{item.size}</span>
                                    <FaChevronDown
                                      className={`text-xs transition-transform duration-200 ${
                                        openSizeDropdowns[item.id]
                                          ? "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </button>

                                  {openSizeDropdowns[item.id] && (
                                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-2 min-w-[80px]">
                                      <div className="flex flex-col gap-1">
                                        {getAvailableSizes(item.category).map(
                                          (size) => (
                                            <button
                                              key={size}
                                              onClick={() =>
                                                handleSizeUpdate(
                                                  item.id,
                                                  item.size,
                                                  size
                                                )
                                              }
                                              className={`px-2 py-1 text-sm rounded-md transition-colors duration-200 text-left ${
                                                item.size === size
                                                  ? "bg-blue-600 text-white"
                                                  : "text-gray-700 hover:bg-blue-50"
                                              }`}
                                            >
                                              {size}
                                            </button>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="text-gray-400 hover:text-red-500 transition-colors duration-300 p-1"
                              title="Remove item"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity - 1,
                                  item.size
                                )
                              }
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-300"
                            >
                              <FaMinus className="text-xs" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity + 1,
                                  item.size
                                )
                              }
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-300"
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-sm text-gray-500">
                                ${item.price} each
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center">
                    <FaTruck className="text-2xl text-green-600 mb-2" />
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Free Shipping
                    </h4>
                    <p className="text-sm text-gray-600">On all orders</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <FaShieldAlt className="text-2xl text-blue-600 mb-2" />
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Secure Checkout
                    </h4>
                    <p className="text-sm text-gray-600">
                      256-bit SSL encryption
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <FaLock className="text-2xl text-purple-600 mb-2" />
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Easy Returns
                    </h4>
                    <p className="text-sm text-gray-600">
                      30-day return policy
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({getCartItemsCount()} items)</span>
                    <span>${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total</span>
                      <span>${getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={proceedToCheckout}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-lg mb-4 flex items-center justify-center gap-2"
                >
                  <FaCreditCard />
                  Proceed to Checkout
                </button>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
                    <FaLock className="text-xs" />
                    <span>Secure and encrypted checkout</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    By completing your purchase you agree to our Terms of
                    Service
                  </p>
                </div>

                <div className="border-t border-gray-200 mt-6 pt-6">
                  <p className="text-sm text-gray-600 mb-3">We accept:</p>
                  <div className="flex gap-3">
                    {["Visa", "Mastercard", "PayPal", "Apple Pay"].map(
                      (method) => (
                        <div
                          key={method}
                          className="w-20 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-medium text-gray-600"
                        >
                          {method}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
