import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaEnvelope, FaLock, FaUser, FaCheck, FaTimes } from "react-icons/fa";
import Swal from 'sweetalert2';


const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-gray-200';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: 'Password Mismatch',
        text: "Passwords don't match!",
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#EC4899',
        background: '#fff',
        color: '#374151',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-xl font-semibold'
        }
      });
      return;
    }

    if (!formData.agreeToTerms) {
      Swal.fire({
        title: 'Terms Required',
        text: "Please agree to the terms and conditions",
        icon: 'warning',
        confirmButtonText: 'I Understand',
        confirmButtonColor: '#EC4899',
        background: '#fff',
        color: '#374151',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-xl font-semibold'
        }
      });
      return;
    }

//  fetch api here  
setIsLoading(true);

setIsLoading(true);

try {
    // Step 1 - Register
    const res = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            username: formData.username,
            password: formData.password,
            confirm_password: formData.confirmPassword
        })
    });

    const data = await res.json();

    if (res.ok) {
        // Step 2 - Auto Login
        const loginRes = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: formData.username,
                password: formData.password
            })
        });

        const loginData = await loginRes.json();
        localStorage.setItem('access_token', loginData.access);
        localStorage.setItem('refresh_token', loginData.refresh);

        // Step 3 - Fetch Profile
        const profileRes = await fetch('http://127.0.0.1:8000/api/profile/', {
            headers: { 'Authorization': `Bearer ${loginData.access}` }
        });
        const userData = await profileRes.json();
        localStorage.setItem('user', JSON.stringify(userData));
        window.dispatchEvent(new Event('storage'));

        // Step 4 - Show Success ✅ only one if block
        Swal.fire({
            title: 'Welcome to Our Community!',
            html: `
                <div class="text-center">
                    <p class="text-gray-700 mb-2">Account created for <strong>${formData.firstName}</strong>!</p>
                    <p class="text-sm text-gray-600">Welcome to our fashion family!</p>
                </div>
            `,
            icon: 'success',
            confirmButtonText: 'Start Shopping',
            confirmButtonColor: '#8B5CF6',
            preConfirm: () => {
                navigate('/');
            }
        });

    } else {
        // ❌ Register failed
        Swal.fire({
            title: 'Register Failed',
            text: JSON.stringify(data),
            icon: 'error',
            confirmButtonColor: '#EC4899',
        });
    }

} catch (err) {
    Swal.fire({
        title: 'Error',
        text: 'Cannot connect to server',
        icon: 'error',
        confirmButtonColor: '#EC4899',
    });
}

setIsLoading(false);

setIsLoading(false);
    
    // Simulate API call
  //   setTimeout(() => {
  //     Swal.fire({
  //       title: 'Welcome to Our Community!',
  //       html: `
  //         <div class="text-center">
  //           <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
  //             <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
  //             </svg>
  //           </div>
  //           <p class="text-gray-700 mb-2">Account created successfully for <strong>${formData.firstName}</strong>!</p>
  //           <p class="text-sm text-gray-600">Welcome to our fashion family!</p>
  //         </div>
  //       `,
  //       icon: 'success',
  //       confirmButtonText: 'Start Shopping',
  //       confirmButtonColor: '#8B5CF6',
  //       background: '#fff',
  //       color: '#374151',
  //       customClass: {
  //         popup: 'rounded-2xl shadow-2xl',
  //         title: 'text-2xl font-bold text-gray-900',
  //         confirmButton: 'px-6 py-3 rounded-xl font-semibold'
  //       },
  //       preConfirm: () => {
  //         // Navigate to shop page when button is clicked
  //         navigate('/');
  //       }
  //     });
  //     setIsLoading(false);
  //   }, 2000);
  // };
}

  const handleSocialRegister = (provider) => {
    Swal.fire({
      title: 'Social Registration',
      text: `Registering with ${provider}...`,
      icon: 'info',
      showConfirmButton: false,
      timer: 1500,
      background: '#fff',
      color: '#374151',
      customClass: {
        popup: 'rounded-2xl shadow-2xl'
      }
    })
  };

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "One number", met: /[0-9]/.test(formData.password) },
    { text: "One special character", met: /[^A-Za-z0-9]/.test(formData.password) }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding & Benefits */}
        <div className="text-center lg:text-left space-y-6">
          <Link to="/" className="inline-flex items-center gap-3 text-2xl font-bold text-gray-900">
            <img
              className="w-15 h-15 rounded-full border-2 border-gray-300 object-cover group-hover:border-amber-500 transition-colors duration-300"
              src="https://i.pinimg.com/1200x/7a/bf/2c/7abf2ca43b62487de9aa4cfc62686e84.jpg"
              alt="Fashion Store Logo"
            /><span className="font-bold text-3xl 2xl:text-2xl wave-text hidden sm:block">CLOTHING SHOP</span>
          </Link>
          
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Join Our Fashion Community
          </h1>
          
          <p className="text-lg text-gray-600 max-w-md">
            Create your account and unlock exclusive benefits, personalized recommendations, and faster checkout.
          </p>

          {/* Benefits List */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheck className="text-green-600 text-sm" />
              </div>
              <span>Exclusive member-only deals</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FaCheck className="text-blue-600 text-sm" />
              </div>
              <span>Personalized style recommendations</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FaCheck className="text-purple-600 text-sm" />
              </div>
              <span>Fast & secure checkout</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                <FaCheck className="text-pink-600 text-sm" />
              </div>
              <span>Early access to new collections</span>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 p-8 lg:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Start your fashion journey today</p>
          </div>

          {/* Social Registration Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleSocialRegister("Google")}
              className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium"
            >
              <FaGoogle className="text-red-500" />
              Google
            </button>
            <button
              onClick={() => handleSocialRegister("Facebook")}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium"
            >
              <FaFacebook />
              Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">or register with email</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    onChange={handleChange}
                    value={formData.firstName}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last name"
                  onChange={handleChange}
                  value={formData.lastName}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  onChange={handleChange}
                  value={formData.username}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  onChange={handleChange}
                  value={formData.password}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength === 0 ? 'text-gray-500' :
                      passwordStrength === 1 ? 'text-red-500' :
                      passwordStrength === 2 ? 'text-orange-500' :
                      passwordStrength === 3 ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              <div className="space-y-1 mt-2">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    {req.met ? (
                      <FaCheck className="text-green-500 text-xs" />
                    ) : (
                      <FaTimes className="text-gray-400 text-xs" />
                    )}
                    <span className={req.met ? "text-green-600" : "text-gray-500"}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  onChange={handleChange}
                  value={formData.confirmPassword}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-xs">Passwords don't match</p>
              )}
            </div>

            {/* Terms Agreement */}
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500 mt-1"
              />
              <span className="text-sm text-gray-700">
                I agree to the{" "}
                <Link to="/terms" className="text-pink-600 hover:text-pink-700 font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-pink-600 hover:text-pink-700 font-medium">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-pink-600 hover:text-pink-700 font-semibold transition-colors duration-300"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;