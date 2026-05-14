import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        // fetch profile
        const profileRes = await fetch('http://127.0.0.1:8000/api/profile/', {
          headers: {
            'Authorization': `Bearer ${data.access}`,
            'Content-Type': 'application/json'
          }
        });

        const userData = await profileRes.json();
        localStorage.setItem('user', JSON.stringify(userData));
        window.dispatchEvent(new Event('storage'));

        Swal.fire({
          title: 'Welcome back!',
          text: `Welcome, ${userData.username}!`,
          icon: 'success',
          confirmButtonText: 'Start Shopping',
          confirmButtonColor: '#8B5CF6',
          background: '#fff',
          color: '#374151',
          customClass: {
            popup: 'rounded-2xl shadow-2xl',
            title: 'text-2xl font-bold text-gray-900',
            confirmButton: 'px-6 py-3 rounded-xl font-semibold'
          },
          preConfirm: () => {
            navigate('/');
          }
        });

      } else {
        Swal.fire({
          title: 'Login Failed',
          text: 'Wrong username or password',
          icon: 'error',
          confirmButtonColor: '#8B5CF6',
        });
      }

    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: 'Cannot connect to server',
        icon: 'error',
        confirmButtonColor: '#8B5CF6',
      });
    }

    setIsLoading(false);
  };

  const handleSocialLogin = (provider) => {
    Swal.fire({
      title: 'Social Login',
      text: `Logging in with ${provider}...`,
      icon: 'info',
      showConfirmButton: false,
      timer: 1500,
      background: '#fff',
      color: '#374151',
      customClass: { popup: 'rounded-2xl shadow-2xl' }
    });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left Side */}
        <div className="text-center lg:text-left space-y-6">
          <Link to="/" className="inline-flex items-center gap-3 text-2xl font-bold text-gray-900">
            <img
              className="w-15 h-15 rounded-full border-2 border-gray-300 object-cover"
              src="https://i.pinimg.com/1200x/7a/bf/2c/7abf2ca43b62487de9aa4cfc62686e84.jpg"
              alt="Fashion Store Logo"
            />
            <span className="font-bold text-3xl wave-text hidden sm:block">CLOTHING SHOP</span>
          </Link>

          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>

          <p className="text-lg text-gray-600 max-w-md">
            Sign in to your account to continue your shopping journey and discover the latest fashion trends.
          </p>

          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FaUser className="text-green-600 text-sm" />
              </div>
              <span>Fast & secure login</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FaLock className="text-blue-600 text-sm" />
              </div>
              <span>Your data is protected</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FaEnvelope className="text-purple-600 text-sm" />
              </div>
              <span>Personalized recommendations</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 p-8 lg:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">Access your fashion world</p>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleSocialLogin("Google")}
              className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-all duration-300 font-medium"
            >
              <FaGoogle className="text-red-500" />
              Google
            </button>
            <button
              onClick={() => handleSocialLogin("Facebook")}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium"
            >
              <FaFacebook />
              Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">or continue with email</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  onChange={handleChange}
                  value={formData.username}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  value={formData.password}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-purple-600 hover:text-purple-700 font-semibold">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
