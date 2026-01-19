import { useState, useEffect } from 'react';
import { Heart, Plus, Minus, ShoppingCart, Star, Truck, Shield, ArrowLeft, ChevronLeft, ChevronRight, Package, CheckCircle } from 'lucide-react';

// Centralized base URL configuration
const API_BASE_URL = 'http://localhost:4000';

const ProductDetailsPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Get or create session ID for guest users
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('guestSessionId');
    if (!sessionId) {
      sessionId = 'guest_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem('guestSessionId', sessionId);
    }
    return sessionId;
  };

  const getUserId = () => {
    return null; // Replace with actual auth logic
  };

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        
        // In a real app, get productId from URL params
        // For demo, we'll fetch all products and use the first one
        const response = await fetch(`${API_BASE_URL}/products`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        const productsArray = data.products || data;
        
        if (productsArray.length > 0) {
          const firstProduct = productsArray[0];
          
          const formattedProduct = {
            id: firstProduct._id,
            name: firstProduct.name,
            description: firstProduct.description || 'No description available',
            price: firstProduct.price,
            images: firstProduct.images && firstProduct.images.length > 0 
              ? firstProduct.images.map(img => `${API_BASE_URL}${img}`)
              : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop'],
            category: firstProduct.category,
            stock: firstProduct.stock,
            sku: firstProduct.sku,
            rating: 4.5,
            reviews: 127,
            features: [
              'Premium quality materials',
              'Durable construction',
              'Modern design',
              '30-day money-back guarantee'
            ],
            specifications: {
              'Brand': firstProduct.category,
              'SKU': firstProduct.sku,
              'Availability': firstProduct.stock > 0 ? 'In Stock' : 'Out of Stock',
              'Stock': `${firstProduct.stock} units`
            }
          };
          
          setProduct(formattedProduct);
          
          // Fetch related products (same category)
          const related = productsArray
            .filter(p => p._id !== firstProduct._id && p.category === firstProduct.category)
            .slice(0, 4)
            .map(p => ({
              id: p._id,
              name: p.name,
              price: p.price,
              image: p.images && p.images.length > 0 
                ? `${API_BASE_URL}${p.images[0]}`
                : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
              category: p.category
            }));
          
          setRelatedProducts(related);
          
          // Fetch cart to get current quantity
          await fetchCartQuantity(firstProduct._id);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, []);

  const fetchCartQuantity = async (productId) => {
    try {
      const userId = getUserId();
      const params = new URLSearchParams();
      
      if (userId) {
        params.append('userId', userId);
      } else {
        params.append('sessionId', getSessionId());
      }
      
      const response = await fetch(`${API_BASE_URL}/cart?${params}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch cart');
      
      const data = await response.json();
      const items = data.items || data.cart?.items || data;
      
      if (items && Array.isArray(items)) {
        const cartItem = items.find(item => {
          const itemProductId = item.productId?._id || item.productId || item.product?._id || item.product;
          return itemProductId === productId;
        });
        
        if (cartItem) {
          setQuantity(cartItem.quantity || 0);
        }
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const updateCartQuantity = async (productId, newQuantity, currentQuantity) => {
    try {
      const userId = getUserId();
      const quantityToAdd = newQuantity - currentQuantity;
      
      const requestBody = {
        productId: productId,
        quantity: quantityToAdd
      };
      
      if (userId) {
        requestBody.userId = userId;
      } else {
        requestBody.sessionId = getSessionId();
      }
      
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) throw new Error('Failed to update cart');
    } catch (err) {
      console.error('Error updating cart:', err);
      alert('Failed to update cart. Please try again.');
      await fetchCartQuantity(productId);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      const newQty = quantity + 1;
      setQuantity(newQty);
      updateCartQuantity(product.id, newQty, quantity);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 0) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      updateCartQuantity(product.id, newQty, quantity);
    }
  };

  const addToCart = () => {
    if (product && product.stock > 0) {
      increaseQuantity();
    }
  };

  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
  };

  const nextImage = () => {
    if (product && product.images) {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product && product.images) {
      setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Products</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl">
              <img 
                src={product.images[selectedImageIndex]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}

              {product.images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-blue-600 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="inline-block text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-3">
                {product.category}
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-gray-800">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Tax included. Shipping calculated at checkout.</p>
            </div>

            {/* Availability */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md">
              <span className="text-gray-700 font-medium">Availability:</span>
              <span className={`font-bold ${
                isOutOfStock 
                  ? 'text-red-600' 
                  : product.stock < 10 
                  ? 'text-yellow-600' 
                  : 'text-green-600'
              }`}>
                {isOutOfStock 
                  ? 'Out of Stock' 
                  : product.stock < 10 
                  ? `Only ${product.stock} left!` 
                  : 'In Stock'}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              {quantity === 0 ? (
                <button 
                  onClick={addToCart}
                  disabled={isOutOfStock}
                  className={`w-full px-8 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl ${
                    isOutOfStock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    <ShoppingCart className="w-6 h-6" />
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </div>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-3">
                    <button
                      onClick={decreaseQuantity}
                      className="p-4 rounded-xl bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white text-gray-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    >
                      <Minus className="w-6 h-6" />
                    </button>
                    
                    <div className="flex-1 text-center">
                      <span className="text-3xl font-bold text-gray-800">
                        {quantity}
                      </span>
                      <span className="text-sm text-gray-500 block mt-1">in cart</span>
                    </div>
                    
                    <button
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      className={`p-4 rounded-xl transition-all duration-300 shadow-md transform ${
                        quantity >= product.stock
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white text-gray-700 hover:shadow-lg hover:scale-105 active:scale-95'
                      }`}
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                  {quantity >= product.stock && (
                    <p className="text-sm text-center text-yellow-600 font-medium">
                      Maximum quantity reached
                    </p>
                  )}
                </div>
              )}

              <button 
                onClick={toggleWishlist}
                className="w-full px-8 py-4 rounded-2xl font-semibold transition-all duration-300 border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
              >
                <Heart 
                  className={`w-6 h-6 transition-colors ${
                    isInWishlist 
                      ? 'text-red-500 fill-red-500' 
                      : 'text-gray-600'
                  }`} 
                />
                <span className="text-lg">
                  {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </span>
              </button>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-6 shadow-md space-y-3">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Key Features</h3>
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-xl shadow-md">
                <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">Free Shipping</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-md">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">Secure Payment</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-md">
                <Package className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Product Specifications</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-700">{key}:</span>
                <span className="text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {/* {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">You May Also Like</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-gray-800 mt-2 mb-2">{item.name}</h3>
                    <p className="text-xl font-bold text-gray-800">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">You May Also Like</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => window.location.href = `/products/${item.id}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-gray-800 mt-2 mb-2">{item.name}</h3>
                    <p className="text-xl font-bold text-gray-800">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;