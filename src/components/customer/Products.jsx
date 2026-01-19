import { useState, useEffect, useRef } from 'react';
import { Heart, Plus, Minus, Eye, Loader, ShoppingCart } from "lucide-react";
import ProductQuickView from './ProductQuickView.jsx';

// Centralized base URL configuration
const API_BASE_URL = 'http://localhost:4000';

const Products = ({ cart, onOptimisticUpdate, onCartUpdate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [wishlist, setWishlist] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);

  const processingRef = useRef(new Set());

  // Get user ID from auth context
  const getUserId = () => {
    return null; // Replace with actual auth logic
  };

  // ✨ NEW: Sync local quantities with cart prop
  useEffect(() => {
    if (cart && Array.isArray(cart)) {
      const newQuantities = {};
      cart.forEach(item => {
        const productId = item.productId?._id || item.productId || item.product;
        if (productId) {
          newQuantities[productId] = item.quantity;
        }
      });
      setQuantities(newQuantities);
    }
  }, [cart]);

useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/products?isActive=true`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        const productsArray = data.products || data;
        
        const formattedProducts = productsArray.map(product => ({
          id: product._id,
          name: product.name,
          description: product.description || 'No description available',
          price: `$${product.price.toFixed(2)}`,
          image: product.images && product.images.length > 0 
            ? `${API_BASE_URL}${product.images[0]}`
            : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
          category: product.category,
          stock: product.stock,
          sku: product.sku
        }));
        
        setProducts(formattedProducts);
        setError(null);
        
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please check if the backend is running on port 4000.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

const updateCartQuantity = async (productId, newQuantity, currentQuantity) => {
    const operationKey = `${productId}-${newQuantity}`;
    
    if (processingRef.current.has(operationKey)) {
      console.log('⏭️ Skipping duplicate call for:', operationKey);
      return;
    }
    
    processingRef.current.add(operationKey);
    
    try {
      // 1. Update parent's cart optimistically FIRST (instant UI update)
      if (onOptimisticUpdate) {
        onOptimisticUpdate(productId, newQuantity);
      }
      
      // 2. Make API call in background
      const userId = getUserId();
      const quantityToAdd = newQuantity - currentQuantity;
      
      const requestBody = {
        productId: productId,
        quantity: quantityToAdd
      };
      
      if (userId) {
        requestBody.userId = userId;
      }
      
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update cart');
      }
      
      // 3. Sync with real data from server after a short delay
      setTimeout(() => {
        if (onCartUpdate) {
          onCartUpdate();
        }
      }, 500);
      
    } catch (err) {
      console.error('❌ Error updating cart:', err);
      // On error, force refresh to get correct state
      if (onCartUpdate) {
        onCartUpdate();
      }
    } finally {
      setTimeout(() => {
        processingRef.current.delete(operationKey);
      }, 100);
    }
};

const increaseQuantity = (productId, maxStock) => {
  setQuantities(prev => {
    const currentQty = prev[productId] || 0;
    const newQty = Math.min(currentQty + 1, maxStock);
    
    if (newQty !== currentQty) {
      // Update UI immediately
      const updatedQuantities = {
        ...prev,
        [productId]: newQty
      };
      
      // Update cart in background (don't await)
      updateCartQuantity(productId, newQty, currentQty);
      
      return updatedQuantities;
    }
    
    return prev;
  });
};

const decreaseQuantity = (productId) => {
  setQuantities(prev => {
    const currentQty = prev[productId] || 0;
    const newQty = Math.max(currentQty - 1, 0);
    
    if (newQty >= 0) {
      // Update UI immediately
      const updatedQuantities = {
        ...prev,
        [productId]: newQty
      };
      
      // Update cart in background (don't await)
      updateCartQuantity(productId, newQty, currentQty);
      
      return updatedQuantities;
    }
    
    return prev;
  });
};

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const openQuickView = (product) => {
    setSelectedProduct(product);
    document.body.style.overflow = 'hidden';
  };

  const closeQuickView = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'unset';
  };

  const navigateToProductDetails = (productId) => {
    // Store product ID for the details page
    sessionStorage.setItem('selectedProductId', productId);
    window.location.href = `/products/${productId}`;
  };

  if (loading) {
    return (
      <section id="products" className="py-8 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="py-8 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-medium mb-2">Error Loading Products</p>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section id="products" className="py-8 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-gray-600 text-lg">No products available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">Our Premium Collection</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of premium products
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const quantity = quantities[product.id] || 0;
            const isOutOfStock = product.stock === 0;
            
            return (
              <div key={product.id} className="max-w-sm mx-auto w-full">
                <div className="group relative bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg group-hover:scale-110"
                  >
                    <Heart 
                      className={`w-5 h-5 transition-colors ${
                        wishlist.has(product.id) 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-gray-600 hover:text-red-500'
                      }`} 
                    />
                  </button>

                  {product.stock < 10 && product.stock > 0 && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold">
                      Only {product.stock} left!
                    </div>
                  )}
                  {isOutOfStock && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
                      Out of Stock
                    </div>
                  )}

                  <div 
                    className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer"
                    onClick={() => navigateToProductDetails(product.id)}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openQuickView(product);
                        }}
                        className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-full font-medium transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <Eye className="w-4 h-4 inline mr-2" />
                        Quick View
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        SKU: {product.sku}
                      </span>
                    </div>

                    <h3 
                      className="text-lg font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors duration-300 cursor-pointer"
                      onClick={() => navigateToProductDetails(product.id)}
                    >
                      {product.name}
                    </h3>
                    
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-gray-800">
                        {product.price}
                      </span>
                    </div>
                    
                    <div className="pt-1">
                      {quantity === 0 ? (
                        <button 
                          onClick={() => increaseQuantity(product.id, product.stock)}
                          disabled={isOutOfStock}
                          className={`w-full px-4 py-2 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-sm ${
                            isOutOfStock
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" />
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                          </div>
                        </button>
                      ) : (
                        <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-1">
                          <button
                            onClick={() => decreaseQuantity(product.id)}
                            className="p-2 rounded-xl bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white text-gray-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <div className="flex-1 text-center">
                            <span className="text-lg font-bold text-gray-800">
                              {quantity}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => increaseQuantity(product.id, product.stock)}
                            disabled={quantity >= product.stock}
                            className={`p-2 rounded-xl transition-all duration-300 shadow-md transform ${
                              quantity >= product.stock
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white text-gray-700 hover:shadow-lg hover:scale-105 active:scale-95'
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => navigateToProductDetails(product.id)}
                      className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors py-2"
                    >
                      View Full Details →
                    </button>
                  </div>
                  
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductQuickView 
          product={selectedProduct} 
          onClose={closeQuickView}
          quantities={quantities}
          wishlist={wishlist}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          toggleWishlist={toggleWishlist}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}

export default Products;