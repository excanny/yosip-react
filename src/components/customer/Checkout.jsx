import { useState, useEffect } from 'react';
import { CreditCard, MapPin, User, Mail, Phone, Lock, ArrowLeft, CheckCircle, Truck, Package, UserPlus, ShoppingBag, Sparkles, Shield } from 'lucide-react';
import ReviewOrder from './ReviewOrder';
import InformationForm from './InformationForm';
import OrderSuccess from './OrderSuccess';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('mk_1M1nRSBoLnf9gBPvNtqHEhcf'); // Replace with your key


const Checkout = ({ onCheckoutComplete }) => {
  const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cartLoading, setCartLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' or 'paypal'
  const stripe = useStripe();
  const elements = useElements();
  
  // Signup form data
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  // Form data (NO card fields - handled by Stripe/Paypal)
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
    orderNotes: '',
    saveInfo: false,
  });

  const [errors, setErrors] = useState({});
  const [orderId, setOrderId] = useState('');

  // Check for logged-in user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Pre-fill form with user data if available
        setFormData(prev => ({
          ...prev,
          email: userData.email || prev.email,
          fullName: userData.name || prev.fullName,
          phone: userData.phone || prev.phone,
          address: userData.address || prev.address,
          city: userData.city || prev.city,
          state: userData.state || prev.state,
          zipCode: userData.zipCode || prev.zipCode,
          country: userData.country || prev.country,
        }));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Fetch cart data on mount
  useEffect(() => {
    const fetchCart = async () => {
      console.log('📦 Checkout: Fetching cart data...');
      setCartLoading(true);
      
      try {
        const response = await fetch('http://localhost:4000/cart', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log('📦 Checkout: Cart API response status:', response.status);
        
        const data = await response.json();
        console.log('📦 Checkout: Cart API response data:', data);
        
        if (response.ok) {
          let cartItems = [];
          
          if (data.cart?.items) {
            cartItems = data.cart.items;
          } else if (data.items) {
            cartItems = data.items;
          } else if (data.data?.items) {
            cartItems = data.data.items;
          } else if (Array.isArray(data)) {
            cartItems = data;
          }
          
          console.log('✅ Checkout: Setting cart to:', cartItems);
          console.log('✅ Checkout: Cart length:', cartItems.length);
          setCart(cartItems);
        } else {
          console.log('❌ Checkout: Failed to fetch cart:', data.message);
          setError('Failed to load cart. Please try again.');
          setCart([]);
        }
      } catch (err) {
        console.error('❌ Checkout: Error fetching cart:', err);
        setError('Network error. Please check your connection.');
        setCart([]);
      } finally {
        setCartLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Handle signup
  const handleSignup = async () => {
    setAuthError('');

    if (!signupData.agreeToTerms) {
      setAuthError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      setAuthError('Password must be at least 6 characters long');
      return;
    }

    setAuthLoading(true);

    try {
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signupData.fullName,
          email: signupData.email,
          password: signupData.password,
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
        
        // Pre-fill form with new user data
        setFormData(prev => ({
          ...prev,
          email: userData.email || signupData.email,
          fullName: userData.name || signupData.fullName,
        }));
        
        setShowSignup(false);
        setSignupData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          agreeToTerms: false
        });
      } else {
        setAuthError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setAuthError('Network error. Please check your connection and try again.');
      console.error('Registration error:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    return sum + (item.itemTotal || (item.productId?.price * item.quantity) || 0);
  }, 0);
  
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.075;
  const total = subtotal + shipping + tax;

  // Validation (NO card validation)
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = 'Valid phone number is required';
    }
    
    if (!formData.fullName || formData.fullName.length < 2) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.address) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.zipCode) {
      newErrors.zipCode = 'ZIP code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let formattedValue = value;
    
    if (name === 'phone') {
      formattedValue = value.replace(/\D/g, '').slice(0, 11);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : formattedValue
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle signup input change
  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission - go to payment selection
  const handleSubmit = async () => {
    if (!validateStep1()) {
      setError('Please fill in all required fields correctly');
      return;
    }
    
    setStep(2); // Go to payment method selection
  };

  // Process payment with selected method
  const processPayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.productId._id || item.productId,
          quantity: item.quantity,
          price: item.productId.price
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone
        },
        contactEmail: formData.email,
        paymentMethod: paymentMethod, // 'stripe' or 'paypal'
        orderNotes: formData.orderNotes,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total
      };

      // Create order and get payment intent/session
      const response = await fetch('http://localhost:4000/orders/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok) {
        if (paymentMethod === 'stripe') {
          // Redirect to Stripe Checkout
          window.location.href = data.stripeUrl;
        } else if (paymentMethod === 'paypal') {
          // Redirect to PayPal
          window.location.href = data.paypalUrl;
        }
      } else {
        setError(data.message || 'Payment initialization failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state with beautiful animation
  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          .float-animation {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
        <div className="text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <ShoppingBag className="relative w-20 h-20 text-emerald-600 mx-auto float-animation" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Preparing your checkout</h2>
          <p className="text-gray-600">Loading your cart items...</p>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cartLoading && cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4">
        <div className="max-w-md w-full">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100">
              <div className="mb-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full blur-xl opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                    <Package className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Discover amazing products and add them to your cart to get started.
              </p>
              <a
                href="/"
                className="group inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-full font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Start Shopping</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Success (will be handled by Stripe/Paypal redirect)
  if (step === 3) {
    return (
      <OrderSuccess
        orderId={orderId}
        total={total}
        formData={formData}
      />
    );
  }

  // Step 2: Payment Method Selection
  if (step === 2) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;700&display=swap');
          
          .checkout-header {
            font-family: 'Playfair Display', serif;
          }
          
          .checkout-body {
            font-family: 'DM Sans', sans-serif;
          }
        `}</style>
        
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8 checkout-body">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setStep(1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to shipping</span>
            </button>

            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 checkout-header">
                Choose Payment Method
              </h1>
              <p className="text-gray-600">
                Select your preferred payment option
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-r-xl">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-8">
              {/* Stripe Option */}
              <button
                onClick={() => setPaymentMethod('stripe')}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                  paymentMethod === 'stripe'
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      paymentMethod === 'stripe' ? 'bg-emerald-600' : 'bg-gray-100'
                    }`}>
                      <CreditCard className={`w-6 h-6 ${
                        paymentMethod === 'stripe' ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Credit/Debit Card</h3>
                      <p className="text-sm text-gray-600">Powered by Stripe - Secure payment</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'stripe' ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'stripe' && (
                      <CheckCircle className="w-5 h-5 text-white" fill="currentColor" />
                    )}
                  </div>
                </div>
              </button>

              {/* PayPal Option */}
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      paymentMethod === 'paypal' ? 'bg-blue-600' : 'bg-gray-100'
                    }`}>
                      <svg className={`w-6 h-6 ${paymentMethod === 'paypal' ? 'text-white' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.15a.805.805 0 01-.793.68H8.278a.48.48 0 01-.474-.558l.924-5.858.016-.1.5-3.178.035-.196a.805.805 0 01.793-.68h2.074c2.713 0 4.832-.876 5.45-3.413.164-.674.11-1.246-.223-1.692-.107-.144-.24-.27-.394-.38z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">PayPal</h3>
                      <p className="text-sm text-gray-600">Fast and secure PayPal checkout</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'paypal' && (
                      <CheckCircle className="w-5 h-5 text-white" fill="currentColor" />
                    )}
                  </div>
                </div>
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t text-lg font-bold">
                  <span>Total</span>
                  <span className="text-emerald-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={processPayment}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Proceed to {paymentMethod === 'stripe' ? 'Stripe' : 'PayPal'}</span>
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Your payment information is secure and encrypted</span>
            </p>
          </div>
        </div>
      </>
    );
  }

  // Step 1: Information Form (Shipping only, no payment fields)
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;700&display=swap');
        
        .checkout-header {
          font-family: 'Playfair Display', serif;
        }
        
        .checkout-body {
          font-family: 'DM Sans', sans-serif;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8 checkout-body">
        {/* Background Decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-600 uppercase tracking-wider">Secure Checkout</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 checkout-header">
              Complete Your Order
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Just need your shipping details - payment comes next
            </p>
          </div>

          {/* User Status Banner */}
          {!user && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative glass-effect border border-blue-200 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                        <UserPlus className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">
                          {showSignup ? 'Create your account' : 'Shopping as guest'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {showSignup ? 'Track orders and enjoy exclusive perks' : 'Create an account for faster checkout'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowSignup(!showSignup)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg whitespace-nowrap"
                    >
                      {showSignup ? 'Continue as Guest' : 'Sign Up'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {user && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative glass-effect border border-emerald-200 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">
                        Welcome back, {user.name || user.email}!
                      </p>
                      <p className="text-sm text-gray-600">
                        Your order will be automatically saved to your account
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Signup Form */}
          {!user && showSignup && (
            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative glass-effect border border-emerald-100 rounded-3xl shadow-2xl p-8 md:p-10">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl shadow-lg">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 checkout-header">Create Account</h2>
                  </div>
                  
                  {authError && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-r-xl">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                        </svg>
                        <span className="font-medium">{authError}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={signupData.fullName}
                        onChange={handleSignupChange}
                        className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white/50"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white/50"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={signupData.password}
                          onChange={handleSignupChange}
                          className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white/50"
                          placeholder="••••••••"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={signupData.confirmPassword}
                          onChange={handleSignupChange}
                          className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white/50"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 pt-2">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={signupData.agreeToTerms}
                        onChange={handleSignupChange}
                        className="mt-1 h-5 w-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label className="text-sm text-gray-700 leading-relaxed">
                        I agree to the{' '}
                        <a href="/terms" className="text-emerald-600 hover:text-emerald-700 font-semibold underline">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-semibold underline">
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    <button
                      onClick={handleSignup}
                      disabled={authLoading}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      {authLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Creating Your Account...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5" />
                          <span>Create Account & Continue</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span>Your cart will be preserved after creating your account</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Information Form (No payment fields) */}
          <InformationForm
            formData={formData}
            errors={errors}
            error={error}
            cart={cart}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            user={user}
          />
        </div>
      </div>
    </>
  );
};

export default Checkout;