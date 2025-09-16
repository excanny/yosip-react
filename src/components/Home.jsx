import React, { useState, useEffect } from "react";
import { Milk, Percent, ShieldCheck, Star, X, Search } from "lucide-react";

export default function Home() {
  const slides = [
    {
      title: "Fresh. Creamy. Happy.",
      subtitle: "Premium cultured yogurts made from locally sourced milk.",
      image:
        "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Naturally Delicious.",
      subtitle: "Wholesome yogurts with no artificial additives.",
      image:
        "https://cdn.pixabay.com/photo/2016/06/07/17/15/yogurt-1442034_1280.jpg",
    },
    {
      title: "Healthy Indulgence.",
      subtitle: "Nutritious, creamy, and simply irresistible.",
      image:
        "https://cdn.pixabay.com/photo/2020/03/22/10/36/berry-4956645_1280.png",
    },
  ];

  const products = [
    {
      id: 1,
      name: "Creamy Vanilla Greek Yogurt",
      price: 2200,
      size: "250ml • 3.5% fat • Vanilla",
      tags: ["Greek", "Probiotic"],
      rating: 4.8,
      image: "https://cdn.pixabay.com/photo/2020/03/22/12/33/blackberry-4956988_1280.png",
    },
    {
      id: 2,
      name: "Strawberry Swirl Yogurt",
      price: 2000,
      size: "250ml • 1.5% fat • Strawberry",
      tags: ["Low Fat", "Real Fruit"],
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800",
    },
    {
      id: 3,
      name: "Blueberry Burst Yogurt",
      price: 2100,
      size: "250ml • 3.5% fat • Blueberry",
      tags: ["Antioxidants"],
      rating: 4.7,
      image: "https://cdn.pixabay.com/photo/2016/03/04/02/22/yogurt-1235353_1280.jpg",
    },
    {
      id: 4,
      name: "Mango Lassi Yogurt Drink",
      price: 2400,
      size: "500ml • 10% fat • Mango",
      tags: ["Rich", "Limited"],
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Amaka O.",
      title: "Fitness Coach",
      message:
        "YoSip yogurt has become part of my daily routine. It’s healthy, creamy, and my clients love it too!",
      tags: ["Health", "Lifestyle"],
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      id: 2,
      name: "David A.",
      title: "Entrepreneur",
      message:
        "The Mango Lassi Yogurt Drink is a game changer! Tastes just like homemade, but better.",
      tags: ["Business", "On-the-Go"],
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 3,
      name: "Kemi B.",
      title: "Nutritionist",
      message:
        "Finally, a yogurt brand that truly cares about quality ingredients. I recommend it to all my clients.",
      tags: ["Wellness", "Nutrition"],
      rating: 4,
      image: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
      id: 4,
      name: "Tunde E.",
      title: "Student",
      message:
        "Affordable, delicious, and keeps me energized throughout the day. 10/10!",
      tags: ["Affordable", "Youth"],
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
  ];

const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(
        (prev) => (prev + 1) % testimonials.length
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);


  const [current, setCurrent] = useState(0);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("YoSip_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("YoSip_cart", JSON.stringify(cart));
  }, [cart]);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const goToSlide = (index) => setCurrent(index);


  // ✅ Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials]);

  // Add to cart
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Update qty
  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("YoSip_cart");
  };

  // Checkout
  const checkout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    alert(
      `✅ Checkout successful!\n\nItems: ${cart.length}\nTotal: $${cartTotal.toLocaleString()}`
    );
    clearCart();
    setCartOpen(false);
  };

  // Cart count & total
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="bg-white font-sans px-2">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        {/* Top Banner */}
        <div className="bg-pink-50 text-sm text-gray-700 flex items-center justify-center gap-3 py-1 border-b">
          <span className="bg-black text-white text-xs font-semibold px-2 py-1 rounded-full">
            New
          </span>
          <span>Free delivery over $1000</span>
          <span className="ml-auto flex items-center gap-6 pr-6">
            <span className="flex items-center gap-1">🚚 Same-day delivery</span>
            <span className="flex items-center gap-1">🔒 Secure checkout</span>
          </span>
        </div>

        {/* Navbar */}
        <div className="flex items-center justify-between px-6 py-2 border-b bg-white">
          <div className="flex items-center gap-2">
            <img src="assets/yosip.png" alt="YoSip Logo" className="w-16 h-16" />
          </div>

          <div className="px-8 w-1/2">
  {/* <div className="relative flex items-center">
    <input
      type="text"
      placeholder="Search yogurt, flavors, packs..."
      className="w-full border rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-1 focus:ring-gray-400"
    />
    <button className="absolute right-2 bg-gray-900 text-white p-2 rounded-md">
      <Search className="w-5 h-5" />
    </button>
  </div> */}
  <div className="relative">
    <input
      type="text"
      placeholder="Search yogurt, flavors, packs..."
      className="w-full border rounded-lg pl-4 pr-12 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
    />
    <button
      type="submit"
      className="absolute inset-y-0 right-2 flex items-center justify-center px-3 text-gray-600 hover:text-gray-900"
    >
      <Search className="w-5 h-5" />
    </button>
  </div>
</div>

          <div className="flex items-center gap-3">
          
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 bg-gray-900 text-white rounded-full px-4 py-2"
            >
              🛒 Cart{" "}
              <span className="bg-white text-black rounded-full px-2">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Slider */}
      <div className="mx-6 my-4 rounded-3xl relative overflow-hidden">
        <img
          src={slides[current].image}
          alt={slides[current].title}
          className="w-full h-[320px] object-cover rounded-3xl"
        />

        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center p-10 text-white">
          <h1 className="text-5xl font-bold">{slides[current].title}</h1>
          <p className="mt-2 text-lg">{slides[current].subtitle}</p>
          <div className="flex gap-4 mt-6">
            <button className="bg-gray-900 text-white px-6 py-3 rounded-2xl">
              Shop Best Sellers
            </button>
            <button
              onClick={nextSlide}
              className="bg-white text-gray-900 px-6 py-3 rounded-2xl"
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
                index === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-gray-400"
              } rounded-full transition-all`}
            ></span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-6">
        <div className="rounded-2xl border border-gray-400 bg-white px-5 py-5">
          <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
            <Milk className="w-11 h-11 text-gray-700" />
            <div>
              <h3 className="font-bold">Farm-fresh milk</h3>
              <p className="text-gray-400">
                Made with the best locally sourced milk.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-400 bg-white px-5 py-5">
          <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
            <Percent className="w-11 h-11 text-gray-700" />
            <div>
              <h3 className="font-bold">No added nonsense</h3>
              <p className="text-gray-400 mt-1">
                Pure goodness. No artificial additives.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-400 bg-white px-5 py-5">
          <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
            <ShieldCheck className="w-11 h-11 text-gray-700" />
            <div>
              <h3 className="font-bold">Quality assured</h3>
              <p className="text-gray-400 mt-1">
                Trusted quality you can rely on.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Yogurt */}
      <div className="px-6 pb-12">
        <h2 className="text-3xl font-bold">Shop Yogurt</h2>
        <p className="text-gray-500 mb-6">Hand-crafted cultured goodness.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="border rounded-2xl bg-white shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="relative">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-48 w-full object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
                  {p.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-white text-gray-700 text-xs px-2 py-1 rounded-full shadow"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-gray-900 font-medium mt-1">
                  ${p.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">{p.size}</p>

                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-700">{p.rating}</span>
                </div>

                <button
                  onClick={() => addToCart(p)}
                  className="mt-4 w-full bg-gray-900 text-white py-2 rounded-full"
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Testimonials Carousel */}
      {testimonials.length > 0 && (
        <div className="px-6 py-12 bg-pink-50">
          <h2 className="text-3xl font-bold text-center">What Our Customers Say</h2>
          <p className="text-gray-500 text-center mb-10">
            Loved by yogurt enthusiasts everywhere.
          </p>

          <div className="relative max-w-3xl mx-auto">
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((t, i) => (
                  <div
                    key={i}
                    className="w-full flex-shrink-0 bg-white p-8 flex flex-col items-center text-center"
                  >
                    <p className="text-gray-600 italic max-w-md">“{t.quote}”</p>
                    <div className="flex items-center gap-3 mt-6">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{t.name}</h4>
                        <p className="text-sm text-gray-500">{t.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {testimonials.map((_, i) => (
                <span
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`cursor-pointer ${
                    i === currentTestimonial ? "w-6 h-2 bg-gray-800" : "w-2 h-2 bg-gray-400"
                  } rounded-full transition-all`}
                ></span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
          <div className="bg-white w-80 h-full shadow-lg p-4 flex flex-col">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-bold">Your Cart</h3>
              <button onClick={() => setCartOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-4">
              {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between mb-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1 px-2">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        ${item.price.toLocaleString()}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="px-2 bg-gray-200 rounded"
                        >
                          -
                        </button>
                        <span>{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="px-2 bg-gray-200 rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="border-t pt-2 space-y-2">
              <p className="font-bold">
                Total: ${cartTotal.toLocaleString()}
              </p>
              <button
                onClick={checkout}
                className="w-full bg-green-600 text-white py-2 rounded-lg"
              >
                ✅ Checkout
              </button>
              <button
                onClick={clearCart}
                className="w-full bg-red-500 text-white py-2 rounded-lg"
              >
                🗑️ Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Call-to-Action Banner */}
      <div className="bg-pink-600 text-white text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Experience Pure Delight?</h2>
        <p className="mb-6">Join thousands of happy customers and indulge in quality yogurt.</p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold">
            Shop Now
          </button>
          <button className="bg-pink-800 text-white px-6 py-3 rounded-lg font-semibold">
            Explore More
          </button>
        </div>
      </div>

      {/* ✅ Footer */}
      <footer className="bg-gray-900 text-gray-300 px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Brand + Social */}
          <div>
            <img src="assets/yosip.png" alt="YoSip Logo" className="w-16 mb-4" />
            <p className="text-sm mb-4">
              Bringing you fresh, creamy, and wholesome yogurts crafted with love. 
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-white">🌐</a>
              <a href="#" className="hover:text-white">📘</a>
              <a href="#" className="hover:text-white">📸</a>
              <a href="#" className="hover:text-white">🐦</a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Shop</a></li>
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Stay Updated</h4>
            <p className="text-sm mb-4">Subscribe to our newsletter for the latest flavors and offers.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 px-3 py-2 rounded-l-lg text-black focus:outline-none" 
              />
              <button className="bg-pink-600 px-4 py-2 rounded-r-lg text-white font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar  */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} YoSip Yogurt. All rights reserved. | Privacy Policy
        </div>
      </footer>
    </div>
  );
}
