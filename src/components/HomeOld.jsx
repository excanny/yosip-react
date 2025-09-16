import React, { useState, useEffect } from "react";

export default function YoGood() {
  const slides = [
    {
      title: "Fresh. Creamy. Happy.",
      subtitle: "Premium cultured yogurts made from locally sourced milk.",
    },
    {
      title: "Naturally Delicious.",
      subtitle: "Wholesome yogurts with no artificial additives.",
    },
    {
      title: "Healthy Indulgence.",
      subtitle: "Nutritious, creamy, and simply irresistible.",
    },
  ];

  const [current, setCurrent] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  return (
    <div className="bg-white font-sans">
      {/* Top Banner */}
      <div className="bg-pink-50 text-sm text-gray-700 flex items-center justify-center gap-3 py-2 border-b">
        <span className="bg-black text-white text-xs font-semibold px-2 py-1 rounded-full">
          New
        </span>
        <span>Free delivery over ₦10,000</span>
        <span className="ml-auto flex items-center gap-6 pr-6">
          <span className="flex items-center gap-1">
            🚚 Same-day in Lagos
          </span>
          <span className="flex items-center gap-1">🔒 Secure checkout</span>
        </span>
      </div>

      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍦</span>
          <span className="text-xl font-bold">YoGood</span>
        </div>

        <div className="flex-1 px-8">
          <input
            type="text"
            placeholder="Search yogurt, flavors, packs..."
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 border rounded-lg px-3 py-2">
            ☰ Filters
          </button>
          <button className="flex items-center gap-2 bg-gray-900 text-white rounded-full px-4 py-2">
            🛒 Cart <span className="bg-white text-black rounded-full px-2">0</span>
          </button>
        </div>
      </div>

      {/* Hero Slider */}
      <div className="mx-6 my-6 rounded-3xl bg-gradient-to-b from-gray-300 to-gray-100 p-10 relative overflow-hidden">
        <div className="transition-all duration-700">
          <h1 className="text-5xl font-bold">{slides[current].title}</h1>
          <p className="text-gray-400 mt-2">{slides[current].subtitle}</p>
          <div className="flex gap-4 mt-6">
            <button className="bg-gray-900 text-white px-6 py-3 rounded-2xl">
              Shop Best Sellers
            </button>
            <button
              onClick={nextSlide}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-2xl"
            >
              Next
            </button>
          </div>
        </div>

        {/* Slider dots */}
        <div className="absolute bottom-4 right-6 flex gap-2">
          {slides.map((_, index) => (
            <span
              key={index}
              onClick={() => goToSlide(index)}
              className={`cursor-pointer ${
                index === current
                  ? "w-6 h-2 bg-gray-800"
                  : "w-2 h-2 bg-gray-400"
              } rounded-full transition-all`}
            ></span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-10">
        <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥛</span>
            <h3 className="font-bold">Farm-fresh milk</h3>
          </div>
          <p className="text-gray-600 mt-2">
            Made with the best locally sourced milk.
          </p>
        </div>
        <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <h3 className="font-bold">No added nonsense</h3>
          </div>
          <p className="text-gray-600 mt-2">
            Pure goodness. No artificial additives.
          </p>
        </div>
        <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <h3 className="font-bold">Quality assured</h3>
          </div>
          <p className="text-gray-600 mt-2">
            Trusted quality you can rely on.
          </p>
        </div>
      </div>

      {/* Popular Products */}
      <div className="px-6 py-12 bg-gray-50">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Our Best Sellers</h2>
          <p className="text-gray-600">Discover Nigeria's favorite yogurt flavors</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { name: "Classic Plain", price: "₦1,200", image: "🥛", rating: "4.9", description: "Smooth and creamy traditional yogurt" },
            { name: "Strawberry Burst", price: "₦1,500", image: "🍓", rating: "4.8", description: "Fresh strawberry pieces in creamy yogurt" },
            { name: "Mango Delight", price: "₦1,500", image: "🥭", rating: "4.9", description: "Tropical mango flavor with real fruit" },
            { name: "Mixed Berry", price: "₦1,600", image: "🫐", rating: "4.7", description: "Blueberry, raspberry and blackberry blend" }
          ].map((product, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="text-6xl mb-4 text-center">{product.image}</div>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
              <h3 className="font-bold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-pink-600">{product.price}</span>
                <button className="bg-pink-600 text-white px-4 py-2 rounded-xl hover:bg-pink-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Benefits */}
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Why Choose YoGood?</h2>
            <p className="text-gray-600">More than just delicious - it's nutritious</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <span className="text-xl">💪</span>
                </div>
                <div>
                  <h4 className="font-bold mb-2">High in Protein</h4>
                  <p className="text-gray-600">15g of protein per serving to support muscle health and keep you satisfied longer.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <span className="text-xl">🦴</span>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Rich in Calcium</h4>
                  <p className="text-gray-600">Essential for strong bones and teeth. 25% of your daily calcium needs in each cup.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <span className="text-xl">🌱</span>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Live Probiotics</h4>
                  <p className="text-gray-600">Billions of beneficial bacteria to support digestive health and immunity.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🥄</div>
                <h3 className="text-2xl font-bold mb-2">Perfect for Every Meal</h3>
                <p className="text-gray-600">Breakfast, snack, or dessert - YoGood fits perfectly into your day</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="px-6 py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              <span className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</span>
              <span className="ml-2 font-semibold">4.8 out of 5</span>
              <span className="text-gray-600 ml-1">(2,847 reviews)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Adaora N.",
                location: "Lagos",
                review: "The best yogurt I've tried in Nigeria! Creamy texture and the strawberry flavor is incredible. My kids love it too.",
                rating: 5,
                verified: true
              },
              {
                name: "Ibrahim K.",
                location: "Abuja",
                review: "Finally, a local yogurt brand that matches international quality. The plain yogurt is perfect for my morning smoothies.",
                rating: 5,
                verified: true
              },
              {
                name: "Chioma E.",
                location: "Port Harcourt",
                review: "I'm lactose sensitive but can enjoy YoGood without any issues. Great taste and super fast delivery!",
                rating: 4,
                verified: true
              }
            ].map((review, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-800 mb-4">"{review.review}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-sm text-gray-600">{review.location}</div>
                  </div>
                  {review.verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="px-6 py-12 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Fresh with YoGood</h2>
          <p className="mb-8 text-pink-100">Get exclusive offers, new flavor alerts, and healthy recipes delivered to your inbox</p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address"
              className="w-full px-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-pink-600 px-6 py-3 rounded-xl font-semibold hover:bg-pink-50 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-8 text-pink-100">
            <span className="flex items-center gap-2">
              <span>🎁</span>
              <span className="text-sm">Exclusive offers</span>
            </span>
            <span className="flex items-center gap-2">
              <span>🥄</span>
              <span className="text-sm">Healthy recipes</span>
            </span>
            <span className="flex items-center gap-2">
              <span>🔔</span>
              <span className="text-sm">New flavors first</span>
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍦</span>
              <span className="text-xl font-bold">YoGood</span>
            </div>
            <p className="text-gray-400 mb-4">
              Premium cultured yogurts made from locally sourced milk, delivering fresh taste and nutrition to Nigerian families.
            </p>
            <div className="flex gap-4">
              <span className="bg-gray-800 p-2 rounded-lg cursor-pointer hover:bg-gray-700">📘</span>
              <span className="bg-gray-800 p-2 rounded-lg cursor-pointer hover:bg-gray-700">📷</span>
              <span className="bg-gray-800 p-2 rounded-lg cursor-pointer hover:bg-gray-700">🐦</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Products</h4>
            <div className="space-y-2 text-gray-400">
              <div className="hover:text-white cursor-pointer">Classic Plain</div>
              <div className="hover:text-white cursor-pointer">Fruit Flavors</div>
              <div className="hover:text-white cursor-pointer">Greek Yogurt</div>
              <div className="hover:text-white cursor-pointer">Organic Range</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <div className="space-y-2 text-gray-400">
              <div className="hover:text-white cursor-pointer">Contact Us</div>
              <div className="hover:text-white cursor-pointer">FAQs</div>
              <div className="hover:text-white cursor-pointer">Delivery Info</div>
              <div className="hover:text-white cursor-pointer">Returns</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <div className="space-y-2 text-gray-400">
              <div className="hover:text-white cursor-pointer">About Us</div>
              <div className="hover:text-white cursor-pointer">Our Story</div>
              <div className="hover:text-white cursor-pointer">Careers</div>
              <div className="hover:text-white cursor-pointer">Press</div>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-400 text-sm">
            © 2025 YoGood. All rights reserved.
          </div>
          <div className="flex gap-6 text-gray-400 text-sm mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Cookie Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}