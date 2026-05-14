import React from "react";
import { Link } from "react-router-dom";
import { FaAward, FaHeart, FaShippingFast, FaUsers, FaStar, FaQuoteLeft } from "react-icons/fa";

const About = () => {
  const stats = [
    { icon: <FaUsers className="text-2xl" />, number: "10,000+", label: "Happy Customers" },
    { icon: <FaShippingFast className="text-2xl" />, number: "5,000+", label: "Orders Delivered" },
    { icon: <FaAward className="text-2xl" />, number: "100+", label: "Premium Products" },
    { icon: <FaStar className="text-2xl" />, number: "4.9/5", label: "Customer Rating" }
  ];

  const values = [
    {
      icon: <i className="fa-solid fa-bullseye"></i>,
      title: "Our Mission",
      description: "To provide authentic Khmer fashion that celebrates Cambodian heritage while embracing modern style and comfort."
    },
    {
      icon: <i className="fa-solid fa-eye"></i>,
      title: "Our Vision",
      description: "To become the leading platform for Khmer fashion worldwide, connecting people with Cambodian culture through clothing."
    },
    {
      heart: <i className="fa-solid fa-heart"></i>,
      title: "Our Values",
      description: "Quality craftsmanship, cultural preservation, customer satisfaction, and sustainable practices guide everything we do."
    }
  ];

  const team = [
    {
      name: "Sophea Chan",
      role: "Founder & Creative Director",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Vichea Lim",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Sreyneath Kim",
      role: "Customer Experience",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent mb-6 animate-pulse">
  About <span className="text-amber-500 animate-bounce inline-block">CLOTHING SHOP</span>
</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Preserving Cambodian heritage through contemporary fashion, one stitch at a time
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Main Content */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                  Welcome to <span className="font-semibold text-purple-600">Clothing Shop</span> — 
                  where traditional Cambodian craftsmanship meets modern fashion sensibilities. 
                  Founded with a passion for preserving our rich cultural heritage, we bring you 
                  authentic Khmer designs reimagined for today's world.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                  Each piece in our collection tells a story of Cambodian artistry, from intricate 
                  patterns inspired by Angkor Wat to contemporary silhouettes that honor traditional 
                  clothing while embracing modern comfort.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We work directly with local artisans and use sustainable materials to ensure that 
                  every purchase supports Cambodian communities and helps keep our cultural traditions alive.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg border border-gray-200">
                    <div className="text-purple-600 flex justify-center mb-2">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-1 shadow-2xl">
                <img
                  src="https://i.pinimg.com/736x/ef/71/b3/ef71b32c562a7405145e0d8417671cdf.jpg"
                  alt="TClothing shop"
                  className="w-full h-[630px] object-cover rounded-2xl"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                <FaQuoteLeft className="text-3xl text-purple-600 mb-3" />
                <p className="text-gray-700 font-medium italic">
                  "Keeping Clothing Shop alive through fashion that honors our past while embracing our future."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Drives Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our commitment to quality, culture, and community sets us apart
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl mb-4">{value.icon}</div>
                <div className="text-4xl text-red-600 mb-4">{value.heart}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-lg text-purple-100 max-w-2xl mx-auto">
              Passionate individuals dedicated to bringing you the best of Khmer fashion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white/30"
                />
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-purple-100">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Ready to Explore Fashion?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of customers who have discovered the beauty and quality of authentic clothing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/men"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              Men's Collection
            </Link>
            <Link
              to="/women"
              className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-2xl font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300 hover:shadow-xl"
            >
              Women's Collection
            </Link>
            <Link
              to="/contact"
              className="border-2 border-gray-600 text-gray-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-600 hover:text-white transition-all duration-300 hover:shadow-xl"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
