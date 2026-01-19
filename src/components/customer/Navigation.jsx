import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import { ShoppingCart, X, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Add this import

const Navigation = ({ cart = [], onCartUpdate }) => {

   console.log('🧭 Navigation: Received cart prop:', cart);
  console.log('🧭 Navigation: Cart length:', cart?.length);

  const navigate = useNavigate(); // Add this hook

  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '', rememberMe: false });
  const [registerData, setRegisterData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    agreeToTerms: false 
  });

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserMenu && !e.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
      if (showCartDropdown && !e.target.closest('.cart-container')) {
        setShowCartDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, showCartDropdown]);

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        const userData = data.data?.user || data.user || data;
        const token = data.data?.token || data.token;
        
        setUser(userData);
        if (loginData.rememberMe) {
          localStorage.setItem('user', JSON.stringify(userData));
          if (token) {
            localStorage.setItem('token', token);
          }
        }
        
        setShowWelcome(true);
        setTimeout(() => setShowWelcome(false), 5000);
        
        setShowAuthModal(false);
        setLoginData({ email: '', password: '', rememberMe: false });

         // Refresh cart after login
        if (onCartUpdate) {
          await onCartUpdate();
        }

      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');

    if (!registerData.agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registerData.fullName,
          email: registerData.email,
          password: registerData.password,
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        const userData = data.data?.user || data.user || data;
        const token = data.data?.token || data.token;
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (token) {
          localStorage.setItem('token', token);
        }
        
        setShowWelcome(true);
        setTimeout(() => setShowWelcome(false), 5000);
        
        setShowAuthModal(false);
        setRegisterData({ 
          fullName: '', 
          email: '', 
          password: '', 
          confirmPassword: '',
          agreeToTerms: false 
        });

         // Refresh cart after registration
        if (onCartUpdate) {
          await onCartUpdate();
        }

      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setShowWelcome(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Refresh cart after logout to show guest cart
    if (onCartUpdate) {
      onCartUpdate();
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const getTotalItems = () => {
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      console.log('🧭 Navigation: getTotalItems - cart is empty or invalid', cart);
      return 0;
    }
    const total = cart.reduce((total, item) => {
      const qty = Number(item.quantity) || 0;
      console.log('🧭 Navigation: Item:', item.productId?.name, 'Quantity:', qty);
      return total + qty;
    }, 0);
    console.log('🧭 Navigation: Total items in cart:', total);
    return total;
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const itemPrice = item.itemTotal || (item.productId?.price * item.quantity) || 0;
      return total + itemPrice;
    }, 0).toFixed(2);
  };

  const updateQuantity = async (index, delta) => {
    const item = cart[index];
    const productId = item.productId?._id || item.productId;
    const newQuantity = item.quantity + delta;
    
    if (newQuantity > 0) {
      // Add visual feedback
      setUpdatingItems(prev => new Set(prev).add(index));
      
      try {
        const response = await fetch('http://localhost:4000/cart/add', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: productId,
            quantity: delta
          })
        });
        
        if (response.ok && onCartUpdate) {
          await onCartUpdate();
        }
      } catch (err) {
        console.error('Error updating quantity:', err);
      } finally {
        // Remove visual feedback after a short delay
        setTimeout(() => {
          setUpdatingItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(index);
            return newSet;
          });
        }, 300);
      }
    }
  };


const removeItem = async (index) => {
  const item = cart[index];
  const productId = item.productId?._id || item.productId;

  // Add visual feedback
  setUpdatingItems(prev => new Set(prev).add(index));

  try {
    const response = await axios.delete(
      'http://localhost:4000/cart/remove',
      {
        data: { productId },   // axios uses `data` for DELETE body
        withCredentials: true, // equivalent to fetch credentials: 'include'
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200 && onCartUpdate) {
      await onCartUpdate();
    }
  } catch (err) {
    // Axios error handling
    if (err.response) {
      console.error('Error removing item:', err.response.data?.message);
    } else {
      console.error('Error removing item:', err.message);
    }
  } finally {
    // Always remove visual feedback
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  }
};

  // FIXED: Handle checkout navigation
  const handleCheckout = () => {
    setShowCartDropdown(false);
    navigate('/checkout'); // 
  };
  
  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: gray;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: gray;
        }
      `}</style>

      {/* Welcome Message Banner */}
      {showWelcome && user && (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-lg">Welcome, {user.name}!</p>
                <p className="text-sm text-emerald-50">You've successfully signed in</p>
              </div>
            </div>
            <a
              href={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'}
              className="bg-white text-emerald-600 px-6 py-2 rounded-full font-semibold hover:bg-emerald-50 transition-colors flex items-center space-x-2"
            >
              <span>Go to {user.role === 'admin' ? 'Admin ' : ''}Dashboard</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      )}
       
      <nav className="bg-white shadow-lg fixed w-full z-50" style={{marginTop: showWelcome ? '64px' : '0'}}>
        {/* Top Promo Banner */}
        <div className="bg-pink-50 text-sm text-gray-700 flex items-center justify-center gap-3 px-3 py-1 border-b">
          <span className="bg-black text-white text-xs font-semibold px-2 py-1 rounded-full">
            New
          </span>
          <span>Free delivery over $1000</span>
          <span className="ml-auto flex items-center gap-6 pr-6">
            <span className="flex items-center gap-1">🚚 Same-day delivery</span>
            <span className="flex items-center gap-1">🔒 Secure checkout</span>
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img
                src="assets/yosip.png"
                alt="Yosip Logo"
                className="w-14 h-14 object-contain"
              />
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search yogurt, flavors, packs..."
                  className="w-full pl-4 pr-12 py-3 rounded-full border text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Account & Cart Buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative user-menu-container">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="text-gray-700 hover:text-slate-900 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">
                      Welcome, {(user.name || user.email)
                        .split(' ')
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ')}
                    </span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                      <a
                        href={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                      </a>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="relative text-gray-700 hover:text-slate-900 transition-colors flex items-center space-x-2"
                  title="Account"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">Account</span>
                </button>
              )}
              
              {/* Cart Button with Dropdown */}
              <div className="relative cart-container">
                <button
                  onClick={() => setShowCartDropdown(!showCartDropdown)}
                  type="button"
                  className="relative bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition-colors flex items-center space-x-2"
                >
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
                      {getTotalItems()}
                    </span>
                  )}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4L7 13l-1.5 6h9" />
                  </svg>
                  <span className="font-medium">Cart</span>
                  <span className="bg-white text-slate-900 rounded-full px-2 py-0.5 text-sm font-bold">
                    {getTotalItems()}
                  </span>
                </button>

                {/* Cart Dropdown */}
                {showCartDropdown && (
                
                  <div className="absolute right-0 mt-3 w-[420px] max-h-[calc(100vh-105px)] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 flex flex-col">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-3 border-b border-emerald-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-2 rounded-lg shadow-sm">
                            <ShoppingCart className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">Shopping Cart</h3>
                            <p className="text-sm text-emerald-600 font-medium">{getTotalItems()} items</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setShowCartDropdown(false)}
                          className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-white rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    {cartLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="relative">
                          <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-100 border-t-emerald-600"></div>
                          <ShoppingCart className="w-5 h-5 text-emerald-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                    ) : cart.length === 0 ? (
                      <div className="text-center py-12 px-6">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ShoppingCart className="w-10 h-10 text-gray-300" />
                        </div>
                        <p className="text-gray-700 font-semibold text-lg mb-1">Your cart is empty</p>
                        <p className="text-sm text-gray-500">Add some delicious yogurt to get started!</p>
                      </div>
                    ) : (
                      <>
                        {/* Items List */}
                        <div className="px-4 py-3 max-h-[350px] overflow-y-auto custom-scrollbar">
                          <div className="space-y-3">
                            {cart.map((item, index) => {
                              const isUpdating = updatingItems.has(index);
                              console.log('🧭 Navigation: Rendering cart item:', item, "index", index);
                              return (
                              <div 
                                key={index} 
                                className={`group bg-gray-50 hover:bg-gray-100 rounded-xl p-3 transition-all duration-200 ${
                                  isUpdating ? 'opacity-60 pointer-events-none' : ''
                                }`}
                              >
                                <div className="flex gap-2">
                                  <div className="relative flex-shrink-0">
                                    <img
                                      src={item.productId?.images?.[0] ? `http://localhost:4000${item.productId.images[0]}` : 'https://via.placeholder.com/60'}
                                      alt={item.productId?.name || 'Product'}
                                      className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    {isUpdating && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-600 border-t-transparent"></div>
                                      </div>
                                    )}
                                    <button
                                      onClick={() => removeItem(index)}
                                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-800 text-sm mb-1 truncate">
                                      {item.productId?.name || 'Product'}
                                    </h4>
                                    <p className="text-emerald-600 font-bold text-base mb-2">
                                      ${item.itemTotal?.toFixed(2) || (item.productId?.price * item.quantity).toFixed(2)}
                                    </p>
                                    
                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => updateQuantity(index, -1)}
                                        className="bg-white hover:bg-emerald-50 border border-gray-200 rounded-lg p-1.5 transition-colors"
                                      >
                                        <Minus className="w-3.5 h-3.5 text-gray-600" />
                                      </button>
                                      <span className="text-sm font-semibold text-gray-700 min-w-[24px] text-center">
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() => updateQuantity(index, 1)}
                                        className="bg-white hover:bg-emerald-50 border border-gray-200 rounded-lg p-1.5 transition-colors"
                                      >
                                        <Plus className="w-3.5 h-3.5 text-gray-600" />
                                      </button>
                                      <span className="text-xs text-gray-500 ml-1">
                                        ${item.productId?.price?.toFixed(2)} each
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )})}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gradient-to-b from-white to-gray-50 px-6 py-2 border-t border-gray-100">
                          {/* Subtotal */}
                          <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
                            <div>
                              <p className="text-sm text-gray-600">Subtotal</p>
                              <p className="text-xs text-gray-500 mt-0.5">Taxes calculated at checkout</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-xl text-gray-800">${getTotalPrice()}</p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2">
                            <button 
                              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 flex items-center justify-center gap-2 group" 
                              onClick={handleCheckout}
                            >
                              Proceed to Checkout
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button 
                              onClick={() => setShowCartDropdown(false)}
                              className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                            >
                              Continue Shopping
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Auth Modal */}
        {showAuthModal && (
          <AuthModal
            authMode={authMode}
            setAuthMode={setAuthMode}
            setShowAuthModal={setShowAuthModal}
            error={error}
            setError={setError}
            loginData={loginData}
            setLoginData={setLoginData}
            registerData={registerData}
            setRegisterData={setRegisterData}
            handleLogin={handleLogin}
            handleRegister={handleRegister}
            handleKeyPress={handleKeyPress}
            isLoading={isLoading}
          />
        )}
        
      </nav>
    </>
  );
}

export default Navigation;