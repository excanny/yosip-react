import React, { useState, useEffect } from "react";
import { Milk, Percent, ShieldCheck, Star, X, Search, Loader, Plus, Minus } from "lucide-react";

/**
 * YoSip E-commerce Home Component
 * 
 * AUTHENTICATION INTEGRATION:
 * 
 * 1. For Guest Users:
 *    - Component automatically works with backend session cookies
 *    - Cart is stored in backend database via session
 *    - No userId required - session handled automatically
 * 
 * 2. For Authenticated Users:
 *    - Set userId in localStorage: localStorage.setItem("YoSip_userId", actualUserId)
 *    - Cart automatically syncs with backend
 *    - Cart persists across devices
 * 
 * 3. Guest to User Migration:
 *    After user logs in, call the migrateGuestCart function:
 *    
 *    Example:
 *    ```javascript
 *    // After successful login in your auth system
 *    const handleLogin = async (userCredentials) => {
 *      const response = await loginAPI(userCredentials);
 *      const userId = response.user._id;
 *      
 *      // This will migrate guest cart to authenticated user's cart
 *      await migrateGuestCart(userId);
 *    }
 *    ```
 * 
 * IMPORTANT BACKEND REQUIREMENTS:
 * - Backend MUST have CORS configured with credentials: true
 * - Backend MUST use cookie-parser middleware
 * - Backend MUST use ensureGuestSession middleware on cart routes
 * - Frontend URL must be in backend's CORS allowed origins
 * 
 * Example backend CORS config:
 * ```javascript
 * app.use(cors({
 *   origin: ['http://localhost:5173', 'https://yourdomain.com'],
 *   credentials: true,
 *   methods: ['GET', 'POST', 'PUT', 'DELETE'],
 *   allowedHeaders: ['Content-Type']
 * }));
 * ```
 */

export default function Home() {
  // Import Montserrat font
  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Apply font to body
    document.body.style.fontFamily = "'Montserrat', sans-serif";
    
    return () => {
      document.head.removeChild(link);
      document.body.style.fontFamily = '';
    };
  }, []);

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

  const testimonials = [
    {
      id: 1,
      name: "Amaka O.",
      title: "Fitness Coach",
      quote:
        "YoSip yogurt has become part of my daily routine. It's healthy, creamy, and my clients love it too!",
      location: "Lagos, Nigeria",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      id: 2,
      name: "David A.",
      title: "Entrepreneur",
      quote:
        "The Mango Lassi Yogurt Drink is a game changer! Tastes just like homemade, but better.",
      location: "Abuja, Nigeria",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 3,
      name: "Kemi B.",
      title: "Nutritionist",
      quote:
        "Finally, a yogurt brand that truly cares about quality ingredients. I recommend it to all my clients.",
      location: "Port Harcourt, Nigeria",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
      id: 4,
      name: "Tunde E.",
      title: "Student",
      quote:
        "Affordable, delicious, and keeps me energized throughout the day. 10/10!",
      location: "Ibadan, Nigeria",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [current, setCurrent] = useState(0);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  
  // User management: handle both authenticated users and guests
  const [userId, setUserId] = useState(() => {
    // Check if there's an authenticated user ID from your auth system
    const authUserId = localStorage.getItem("YoSip_userId");
    if (authUserId && authUserId !== "guest") {
      return authUserId;
    }
    
    // For guests, create or retrieve a guest ID
    let guestId = localStorage.getItem("YoSip_guestId");
    if (!guestId) {
      // Generate a unique guest ID
      guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("YoSip_guestId", guestId);
    }
    return guestId;
  });
  
  const [isGuest, setIsGuest] = useState(() => {
    const authUserId = localStorage.getItem("YoSip_userId");
    return !authUserId || authUserId === "guest" || userId.startsWith("guest_");
  });

  const API_BASE_URL = "https://yosip-api-1.onrender.com";

  // Helper function to get proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
    // If it's already a full URL (starts with http/https), use it directly
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Otherwise, it's a relative path, prepend API base URL
    return `${API_BASE_URL}${imagePath}`;
  };

  // Helper function to make API calls with credentials for cookies
  const fetchWithCredentials = async (url, options = {}) => {
    return fetch(url, {
      ...options,
      credentials: 'include', // Important: includes cookies in requests
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract products array from response and transform the data
        const productsData = data.products || [];
        const transformedProducts = productsData
          .filter(product => product.isActive) // Only show active products
          .map(product => ({
            id: product._id,
            name: product.name,
            price: product.price,
            description: product.description,
            size: `${product.stock} in stock • ${product.category}`,
            tags: [product.category, product.stock > 15 ? "In Stock" : "Limited"],
            rating: 4.5 + Math.random() * 0.5, // Generate random rating between 4.5-5.0
            image: product.images && product.images.length > 0 
              ? getImageUrl(product.images[0])
              : "https://via.placeholder.com/400x300?text=No+Image",
            stock: product.stock,
            category: product.category,
            sku: product.sku
          }));
        
        setProducts(transformedProducts);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch cart from backend (handles both guests with sessions and authenticated users)
  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      
      try {
        setCartLoading(true);
        
        // For guests, backend will use session cookie automatically
        // For authenticated users, we pass userId
        const url = isGuest 
          ? `${API_BASE_URL}/cart` 
          : `${API_BASE_URL}/cart?userId=${userId}`;
        
        const response = await fetchWithCredentials(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.cart && data.cart.items) {
          // Transform cart items to match our local format
          const transformedCart = data.cart.items.map(item => ({
            id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            description: item.productId.description,
            image: item.productId.images && item.productId.images.length > 0 
              ? getImageUrl(item.productId.images[0])
              : "https://via.placeholder.com/400x300?text=No+Image",
            qty: item.quantity,
            stock: item.productId.stock,
            category: item.productId.category,
          }));
          
          setCart(transformedCart);
        } else if (data.cart && data.cart.items.length === 0) {
          // Empty cart from backend
          setCart([]);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        // Fall back to localStorage if API fails
        const savedCart = localStorage.getItem("YoSip_cart");
        if (savedCart) {
          try {
            setCart(JSON.parse(savedCart));
          } catch (parseErr) {
            console.error("Error parsing localStorage cart:", parseErr);
          }
        }
      } finally {
        setCartLoading(false);
      }
    };

    fetchCart();
  }, [userId, isGuest]);

  // Save cart to localStorage as backup
  useEffect(() => {
    localStorage.setItem("YoSip_cart", JSON.stringify(cart));
  }, [cart]);

  // Save userId to localStorage
  useEffect(() => {
    localStorage.setItem("YoSip_userId", userId);
  }, [userId]);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const goToSlide = (index) => setCurrent(index);

  // Add to cart (with backend sync for all users - guests use session)
  const addToCart = async (product) => {
    console.log("🛒 Adding to cart:", {
      product: product.name,
      productId: product.id,
      userId: userId,
      isGuest: isGuest
    });

    try {
      // Optimistic update
      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          );
        }
        return [...prev, { ...product, qty: 1 }];
      });

      // Sync with backend (for both guests with session and authenticated users)
      console.log("📡 Calling API: POST", `${API_BASE_URL}/cart/add`);
      
      const requestBody = isGuest 
        ? { productId: product.id } // Guest: backend uses session cookie
        : { userId: userId, productId: product.id }; // Authenticated: pass userId
      
      console.log("📦 Request body:", JSON.stringify(requestBody));

      const response = await fetchWithCredentials(`${API_BASE_URL}/cart/add`, {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);
        throw new Error(`Failed to add item to cart: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Cart updated successfully:", data);
      
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
      // The optimistic update remains, so the UI still works
      console.warn("⚠️ Failed to sync cart with server. Your cart is saved locally.");
    }
  };

  // Remove from cart (with backend sync for all users)
  const removeFromCart = async (id) => {
    try {
      // Optimistic update
      setCart((prev) => prev.filter((item) => item.id !== id));

      // Sync with backend
      const requestBody = isGuest 
        ? { productId: id }
        : { userId: userId, productId: id, quantity: 0 };

      const response = await fetchWithCredentials(`${API_BASE_URL}/cart/update`, {
        method: "PUT",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  // Update qty (with backend sync for all users)
  const updateQty = async (id, qty) => {
    if (qty < 1) {
      removeFromCart(id);
      return;
    }

    try {
      // Optimistic update
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, qty } : item))
      );

      // Sync with backend
      const requestBody = isGuest 
        ? { productId: id, quantity: qty }
        : { userId: userId, productId: id, quantity: qty };

      const response = await fetchWithCredentials(`${API_BASE_URL}/cart/update`, {
        method: "PUT",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart");
      }

    } catch (err) {
      console.error("Error updating cart:", err);
      console.warn("⚠️ Failed to sync cart with server. Your cart is saved locally.");
    }
  };

  // Clear cart (with backend sync for all users)
  const clearCart = async () => {
    try {
      // Optimistic update
      setCart([]);

      // Sync with backend
      const requestBody = isGuest 
        ? {} // Guest: backend uses session cookie
        : { userId: userId };

      const response = await fetchWithCredentials(`${API_BASE_URL}/cart/clear`, {
        method: "DELETE",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      localStorage.removeItem("YoSip_cart");
    } catch (err) {
      console.error("Error clearing cart:", err);
      localStorage.removeItem("YoSip_cart");
    }
  };

  // Migrate guest cart to authenticated user (call this after login)
  const migrateGuestCart = async (newUserId) => {
    try {
      console.log("🔄 Migrating guest cart to authenticated user...");
      
      // The backend has a /cart/merge endpoint that handles this
      // It will merge the session-based guest cart with the user's cart
      const response = await fetchWithCredentials(`${API_BASE_URL}/cart/merge`, {
        method: "POST",
        body: JSON.stringify({
          userId: newUserId,
          // sessionId is automatically included via cookies
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to merge cart");
      }

      const data = await response.json();
      
      // Update state
      setUserId(newUserId);
      setIsGuest(false);
      localStorage.setItem("YoSip_userId", newUserId);
      localStorage.removeItem("YoSip_guestId");
      
      // Update cart from merged result
      if (data.cart && data.cart.items) {
        const transformedCart = data.cart.items.map(item => ({
          id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          description: item.productId.description,
          image: item.productId.images && item.productId.images.length > 0 
            ? getImageUrl(item.productId.images[0])
            : "https://via.placeholder.com/400x300?text=No+Image",
          qty: item.quantity,
          stock: item.productId.stock,
          category: item.productId.category,
        }));
        setCart(transformedCart);
      }
      
      console.log("✅ Guest cart successfully migrated to authenticated user");
    } catch (err) {
      console.error("❌ Error migrating guest cart:", err);
    }
  };

  // Checkout
  const checkout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    alert(
      `✅ Checkout successful!\n\nItems: ${cart.length}\nTotal: $${cartTotal.toFixed(2)}`
    );
    clearCart();
    setCartOpen(false);
  };

  // Get quantity for a product in cart
  const getCartQuantity = (productId) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.qty : 0;
  };

  // Cart count & total
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="bg-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        {/* Top Banner */}
        <div className="bg-pink-50 text-sm text-gray-700 flex items-center justify-between px-0 py-2 border-b w-full">
          <div className="flex items-center gap-4 px-6">
            <span className="bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
              New
            </span>
            <span className="text-gray-600">Free delivery over $100</span>
          </div>
          <div className="flex items-center gap-6 px-6">
            <span className="flex items-center gap-2 text-gray-600">
              <span>🚚</span>
              <span>Same-day delivery</span>
            </span>
            <span className="flex items-center gap-2 text-gray-600">
              <span>🔒</span>
              <span>Secure checkout</span>
            </span>
          </div>
        </div>

        {/* Navbar */}
        <div className="flex items-center justify-between px-6 py-2 bg-white border-b w-full">
          <div className="flex items-center gap-2">
            <img src="assets/yosip.png" alt="YoSip Logo" className="w-12 h-12" />
          </div>

          <div className="px-8 w-1/2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search yogurt, flavors, packs..."
                className="w-full border border-gray-300 rounded-full pl-6 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
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
            {isGuest && (
              <button
                onClick={() => {
                  const testUserId = "6936a637778637ae3ad32818";
                  localStorage.setItem("YoSip_userId", testUserId);
                  setUserId(testUserId);
                  setIsGuest(false);
                  console.log("🔄 Switched to test user:", testUserId);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium"
                title="Account"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Account</span>
              </button>
            )}
            {!isGuest && (
              <button
                onClick={() => {
                  localStorage.removeItem("YoSip_userId");
                  const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                  localStorage.setItem("YoSip_guestId", guestId);
                  setUserId(guestId);
                  setIsGuest(true);
                  setCart([]);
                  console.log("🔄 Switched to guest mode");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-all font-medium"
                title="Account"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Account</span>
              </button>
            )}
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-3 bg-gray-900 text-white rounded-full px-4 py-2 relative hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-semibold">Cart</span>
              <span className="bg-white text-gray-900 rounded-full px-2.5 py-0.5 text-sm font-bold min-w-[28px] text-center">
                {cartCount}
              </span>
              {cartLoading && (
                <Loader className="w-4 h-4 animate-spin absolute -top-1 -right-1 text-pink-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Video Section */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="rounded-3xl relative overflow-hidden bg-black shadow-2xl">
          <style>{`
            .video-always-controls::-webkit-media-controls {
              opacity: 1 !important;
            }
            .video-always-controls::-webkit-media-controls-panel {
              opacity: 1 !important;
            }
          `}</style>
          <video
            autoPlay
            loop
            muted
            playsInline
            controls
            controlsList="nodownload"
            className="w-full h-[400px] object-cover rounded-3xl video-always-controls"
          >
            <source
              src="https://res.cloudinary.com/dszwuz5wz/video/upload/v1769774783/Yosip_--_Naija_Chops_p2iqpi.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Why Choose Yosip Section */}
      <div className="px-6 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Why Choose Yosip?
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12">
            We're committed to delivering the highest quality yogurt experience
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 100% Natural */}
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">100% Natural</h3>
              <p className="text-gray-600 leading-relaxed">
                No artificial preservatives, colors, or flavors. Just pure, natural goodness in every cup.
              </p>
            </div>

            {/* Made with Love */}
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Made with Love</h3>
              <p className="text-gray-600 leading-relaxed">
                Each batch is carefully crafted by our artisans who are passionate about yogurt perfection.
              </p>
            </div>

            {/* Fresh Daily */}
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fresh Daily</h3>
              <p className="text-gray-600 leading-relaxed">
                Delivered fresh to your door every day. Experience the difference freshness makes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-8 max-w-7xl mx-auto">
        <div className="rounded-2xl border-2 border-gray-200 bg-white px-6 py-6 hover:border-pink-300 hover:shadow-lg transition-all duration-300">
          <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
            <div className="bg-pink-50 p-3 rounded-xl">
              <Milk className="w-8 h-8 text-pink-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Farm-fresh milk</h3>
              <p className="text-gray-500 text-sm mt-1">
                Made with the best locally sourced milk.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-gray-200 bg-white px-6 py-6 hover:border-pink-300 hover:shadow-lg transition-all duration-300">
          <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
            <div className="bg-green-50 p-3 rounded-xl">
              <Percent className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">No added nonsense</h3>
              <p className="text-gray-500 text-sm mt-1">
                Pure goodness. No artificial additives.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-gray-200 bg-white px-6 py-6 hover:border-pink-300 hover:shadow-lg transition-all duration-300">
          <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
            <div className="bg-blue-50 p-3 rounded-xl">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Quality assured</h3>
              <p className="text-gray-500 text-sm mt-1">
                Trusted quality you can rely on.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Yogurt */}
      <div className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Shop Yosip Goodies</h2>
          <p className="text-gray-600 text-lg mb-10">Home-crafted nostalgic goodness.</p>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-10 h-10 animate-spin text-pink-600" />
            <span className="ml-3 text-gray-600">Loading products...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 mb-4">No products available at the moment.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => {
              const cartQty = getCartQuantity(p.id);
              return (
                <div
                  key={p.id}
                  className="border rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 ease-out overflow-hidden hover:scale-[1.03] hover:-translate-y-2 group cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-48 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {p.tags && p.tags.length > 0 && (
                      <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
                        {p.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-white text-gray-700 text-xs px-2 py-1 rounded-full shadow transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {p.stock < 5 && p.stock > 0 && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow animate-pulse">
                          Only {p.stock} left!
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-pink-600 transition-colors duration-300">{p.name}</h3>
                    <p className="text-gray-900 font-medium mt-1 group-hover:text-pink-700 transition-colors duration-300">
                      ${p.price.toFixed(2)}
                    </p>
                    {p.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                    )}
                    {p.size && (
                      <p className="text-sm text-gray-500 mt-1">{p.size}</p>
                    )}

                    {p.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 transition-transform duration-300 group-hover:scale-125" />
                        <span className="text-sm text-gray-700">{p.rating.toFixed(1)}</span>
                      </div>
                    )}

                    {/* Stock Availability Bar */}
                    <div className="mt-3 mb-2">
                      {p.stock > 0 ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-medium ${p.stock < 10 ? 'text-orange-600' : 'text-green-600'}`}>
                              {p.stock < 10 ? '⚡ Low Stock' : '✓ In Stock'}
                            </span>
                            <span className="text-gray-500">{p.stock} available</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                p.stock < 5 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                                p.stock < 10 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                                'bg-gradient-to-r from-green-500 to-emerald-500'
                              }`}
                              style={{ width: `${Math.min((p.stock / 20) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
                          <X className="w-3 h-3" />
                          <span>Currently Out of Stock</span>
                        </div>
                      )}
                    </div>

                    {cartQty === 0 ? (
                      <>
                        <button
                          onClick={() => addToCart(p)}
                          disabled={p.stock === 0}
                          className={`w-full py-3 px-4 rounded-full font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                            p.stock === 0 
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-md hover:shadow-lg"
                          }`}
                        >
                          {p.stock === 0 ? (
                            <>
                              <X className="w-4 h-4" />
                              <span>Out of Stock</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                        
                        {p.stock > 0 && p.stock < 5 && (
                          <p className="text-xs text-center text-orange-600 font-medium animate-pulse mt-2">
                            🔥 Hurry! Only {p.stock} left in stock
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Single compact row with cart info and controls */}
                        <div className="flex items-center gap-2">
                          {/* Minus button */}
                          <button
                            onClick={() => updateQty(p.id, cartQty - 1)}
                            className="bg-pink-500 text-white rounded-full p-2.5 hover:bg-pink-600 transition-all duration-200 active:scale-95"
                            title="Remove one"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          {/* Cart info in center */}
                          <div className="flex-1 bg-green-50 border-2 border-green-500 rounded-full py-2 px-3 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-xs font-semibold text-green-700">{cartQty} in Cart</span>
                            </div>
                            <span className="text-xs font-bold text-gray-900">${(p.price * cartQty).toFixed(2)}</span>
                          </div>
                          
                          {/* Plus button */}
                          <button
                            onClick={() => updateQty(p.id, cartQty + 1)}
                            disabled={cartQty >= p.stock}
                            className={`rounded-full p-2.5 transition-all duration-200 ${
                              cartQty >= p.stock 
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                                : "bg-pink-500 text-white hover:bg-pink-600 active:scale-95"
                            }`}
                            title={cartQty >= p.stock ? "Max quantity reached" : "Add one more"}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Stock warning if needed */}
                        {(cartQty >= p.stock || (cartQty < p.stock && p.stock - cartQty <= 3)) && (
                          <p className="text-[10px] text-center font-medium mt-1.5">
                            {cartQty >= p.stock ? (
                              <span className="text-orange-600">⚠️ Maximum quantity</span>
                            ) : (
                              <span className="text-amber-600">Only {p.stock - cartQty} more available</span>
                            )}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </div>
      </div>

      {/* Testimonials Carousel */}
      {testimonials.length > 0 && (
        <div className="px-6 py-16 bg-gradient-to-b from-pink-50 to-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-3">What Our Customers Say</h2>
            <p className="text-gray-600 text-center text-lg mb-12">
              Loved by yogurt enthusiasts everywhere.
            </p>

            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden rounded-3xl shadow-xl">
                <div
                  className="flex transition-transform duration-500"
                  style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                >
                  {testimonials.map((t, i) => (
                    <div
                      key={i}
                      className="w-full flex-shrink-0 bg-white p-10 md:p-12 flex flex-col items-center text-center"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <img
                          src={t.image}
                          alt={t.name}
                          className="w-16 h-16 rounded-full object-cover ring-4 ring-pink-100"
                        />
                        <div className="text-left">
                          <h4 className="font-bold text-lg text-gray-900">{t.name}</h4>
                          <p className="text-sm text-gray-500">{t.title}</p>
                          <p className="text-xs text-gray-400">{t.location}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 italic text-lg max-w-2xl leading-relaxed">"{t.quote}"</p>
                      <div className="flex gap-1 mt-6">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    className={`cursor-pointer ${
                      i === currentTestimonial ? "w-8 h-2.5 bg-pink-600" : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                    } rounded-full transition-all duration-300`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            onClick={() => setCartOpen(false)}
          ></div>
          
          {/* Cart Modal - Positioned below cart button */}
          <div className="fixed top-[105px] right-6 z-50 w-[420px] max-h-[calc(100vh-130px)]">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Shopping Cart</h3>
                    <p className="text-xs text-gray-500">{cart.length} items</p>
                  </div>
                </div>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {isGuest && cart.length > 0 && (
                <div className="mx-4 mt-3 bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-xs text-blue-800">
                  <span className="font-semibold">💡 Tip:</span> Sign in to save your cart and checkout faster!
                </div>
              )}

              {/* Cart Content */}
              <div className="flex-1 overflow-y-auto px-4 py-3" style={{ maxHeight: 'calc(100vh - 350px)' }}>
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    {cartLoading ? (
                      <>
                        <Loader className="w-10 h-10 animate-spin text-pink-600 mb-3" />
                        <p className="text-sm text-gray-500">Loading your cart...</p>
                      </>
                    ) : (
                      <>
                       
                        <h4 className="text-lg font-bold text-gray-900 mb-1">Your cart is empty</h4>
                        <p className="text-sm text-gray-500 mb-4">Add some delicious goodies to get started!</p>
                        <button
                          onClick={() => setCartOpen(false)}
                          className="bg-pink-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-pink-700 transition-all shadow-md hover:shadow-lg text-sm"
                        >
                          Start Shopping
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base text-gray-900 truncate">{item.name}</h4>
                          <p className="text-sm text-pink-600 font-semibold">
                            ${item.price.toFixed(2)}
                          </p>

                          <div className="flex items-center gap-2 mt-2 bg-white rounded-lg px-2 py-1.5 w-fit shadow-sm border border-gray-200">
                            <button
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              className="text-gray-600 hover:text-pink-600 transition-colors p-1"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold px-3 text-base text-gray-900">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              className="text-gray-600 hover:text-pink-600 transition-colors p-1"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                          title="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer - Only show when cart has items */}
              {cart.length > 0 && (
                <div className="border-t bg-gray-50 px-5 py-5 space-y-4">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium text-base">Subtotal</span>
                    <span className="font-bold text-gray-900 text-2xl">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={checkout}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <span className="flex items-center justify-center gap-2 text-base">
                        <ShieldCheck className="w-5 h-5" />
                        Proceed to Checkout
                      </span>
                    </button>
                    <button
                      onClick={clearCart}
                      className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-red-400 hover:text-red-600 transition-all text-base"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Stay Fresh with Us Newsletter */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Stay Fresh with Us</h2>
          <p className="text-lg md:text-xl text-green-50 mb-8">
            Get exclusive offers, new flavor alerts, and healthy recipes delivered to your inbox
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 w-full sm:w-auto px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-green-300 text-lg shadow-lg" 
            />
            <button className="w-full sm:w-auto bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          
          {/* Brand + Description */}
          <div>
            <img src="assets/yosip.png" alt="YoSip Logo" className="w-16 mb-4" />
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium natural yogurt crafted with love and the finest ingredients.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Products</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Greek Yogurt</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fruit Yogurt</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Organic Line</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Yogurt Drinks</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <span className="text-lg">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <span className="text-lg">t</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <span className="text-lg">i</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500 max-w-7xl mx-auto">
          © {new Date().getFullYear()} YoSip Yogurt. All rights reserved. | Privacy Policy | Terms of Service
        </div>
      </footer>
    </div>
  );
}