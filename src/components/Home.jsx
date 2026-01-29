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
              ? `${API_BASE_URL}${product.images[0]}`
              : "https://via.placeholder.com/400x300?text=No+Image", // Fallback image
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
              ? `${API_BASE_URL}${item.productId.images[0]}`
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
            ? `${API_BASE_URL}${item.productId.images[0]}`
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
    <div className="bg-white font-sans px-2">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        {/* Top Banner */}
        <div className="bg-pink-50 text-sm text-gray-700 flex items-center justify-center gap-3 py-1 border-b">
          <span className="bg-black text-white text-xs font-semibold px-2 py-1 rounded-full">
            New
          </span>
          <span>Free delivery over $10</span>
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
            {isGuest && (
              <div className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                <span>👤 Guest Mode</span>
                <button
                  onClick={() => {
                    // Quick test mode: set a test user ID
                    const testUserId = "6936a637778637ae3ad32818";
                    localStorage.setItem("YoSip_userId", testUserId);
                    setUserId(testUserId);
                    setIsGuest(false);
                    console.log("🔄 Switched to test user:", testUserId);
                  }}
                  className="text-blue-600 hover:text-blue-800 underline"
                  title="Switch to test user mode"
                >
                  Test as User
                </button>
              </div>
            )}
            {!isGuest && (
              <div className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-2">
                <span>✓ Authenticated</span>
                <button
                  onClick={() => {
                    // Switch back to guest
                    localStorage.removeItem("YoSip_userId");
                    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    localStorage.setItem("YoSip_guestId", guestId);
                    setUserId(guestId);
                    setIsGuest(true);
                    setCart([]);
                    console.log("🔄 Switched to guest mode");
                  }}
                  className="text-red-600 hover:text-red-800 underline"
                  title="Switch to guest mode"
                >
                  Logout
                </button>
              </div>
            )}
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 bg-gray-900 text-white rounded-full px-4 py-2 relative"
            >
              🛒 Cart{" "}
              <span className="bg-white text-black rounded-full px-2">
                {cartCount}
              </span>
              {cartLoading && (
                <Loader className="w-4 h-4 animate-spin absolute -top-1 -right-1 text-pink-600" />
              )}
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
                  className="border rounded-2xl bg-white shadow hover:shadow-lg transition overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-48 w-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                    {p.tags && p.tags.length > 0 && (
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
                    )}
                    {p.stock < 5 && p.stock > 0 && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow">
                          Only {p.stock} left!
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-gray-900 font-medium mt-1">
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
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-700">{p.rating.toFixed(1)}</span>
                      </div>
                    )}

                    {cartQty === 0 ? (
                      <button
                        onClick={() => addToCart(p)}
                        disabled={p.stock === 0}
                        className={`mt-4 w-full py-2 rounded-full transition ${
                          p.stock === 0 
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                            : "bg-gray-900 text-white hover:bg-gray-800"
                        }`}
                      >
                        {p.stock === 0 ? "Out of Stock" : "Add to cart"}
                      </button>
                    ) : (
                      <div className="mt-4 flex items-center justify-between bg-gray-100 rounded-full px-2 py-2">
                        <button
                          onClick={() => updateQty(p.id, cartQty - 1)}
                          className="bg-white rounded-full p-1.5 hover:bg-gray-200 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-lg px-4">{cartQty}</span>
                        <button
                          onClick={() => updateQty(p.id, cartQty + 1)}
                          disabled={cartQty >= p.stock}
                          className={`rounded-full p-1.5 transition ${
                            cartQty >= p.stock 
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                              : "bg-white hover:bg-gray-200"
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Testimonials Carousel */}
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
                    <p className="text-gray-600 italic max-w-md">"{t.quote}"</p>
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
            
            {isGuest && cart.length > 0 && (
              <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs text-blue-800">
                💡 <strong>Sign in</strong> to save your cart and checkout faster!
              </div>
            )}

            <div className="flex-1 overflow-y-auto mt-4">
              {cart.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-2">Your cart is empty</p>
                  {cartLoading && <Loader className="w-6 h-6 animate-spin text-pink-600 mx-auto" />}
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between mb-4 pb-4 border-b"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1 px-3">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        ${item.price.toFixed(2)}
                      </p>

                      <div className="flex items-center gap-2 mt-2 bg-gray-100 rounded-full px-2 py-1 w-fit">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="bg-white rounded-full p-1 hover:bg-gray-200 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-semibold px-2">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="bg-white rounded-full p-1 hover:bg-gray-200 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="border-t pt-2 space-y-2">
              <p className="font-bold text-lg">
                Total: ${cartTotal.toFixed(2)}
              </p>
              <button
                onClick={checkout}
                disabled={cart.length === 0}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                ✅ Checkout
              </button>
              <button
                onClick={clearCart}
                disabled={cart.length === 0}
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                🗑️ Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call-to-Action Banner */}
      <div className="bg-pink-600 text-white text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Experience Pure Delight?</h2>
        <p className="mb-6">Join thousands of happy customers and indulge in quality yogurt.</p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Shop Now
          </button>
          <button className="bg-pink-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-900 transition">
            Explore More
          </button>
        </div>
      </div>

      {/* Footer */}
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
              <button className="bg-pink-600 px-4 py-2 rounded-r-lg text-white font-semibold hover:bg-pink-700 transition">
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