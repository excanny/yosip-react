import React from 'react';
import { X, Heart, ShoppingCart, Plus, Minus } from 'lucide-react';

const ProductQuickView = ({ product, onClose, quantities, wishlist, increaseQuantity, decreaseQuantity, toggleWishlist }) => {
  if (!product) return null;

  const quantity = quantities[product.id] || 0;
  const isOutOfStock = product.stock === 0;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h3 className="text-2xl font-bold text-gray-800">Quick View</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                  {product.category}
                </span>
                <span className="text-sm text-gray-500">
                  SKU: {product.sku}
                </span>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-800">
                  {product.price}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">Availability:</span>
                  <span className={`font-semibold ${
                    product.stock === 0 
                      ? 'text-red-600' 
                      : product.stock < 10 
                      ? 'text-yellow-600' 
                      : 'text-green-600'
                  }`}>
                    {product.stock === 0 
                      ? 'Out of Stock' 
                      : product.stock < 10 
                      ? `Only ${product.stock} left!` 
                      : 'In Stock'}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                {quantity === 0 ? (
                  <button 
                    onClick={() => increaseQuantity(product.id, product.stock)}
                    disabled={isOutOfStock}
                    className={`w-full px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-lg ${
                      isOutOfStock
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </div>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-2">
                      <button
                        onClick={() => decreaseQuantity(product.id)}
                        className="p-3 rounded-xl bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white text-gray-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      
                      <div className="flex-1 text-center">
                        <span className="text-2xl font-bold text-gray-800">
                          {quantity}
                        </span>
                        <span className="text-sm text-gray-500 block">in cart</span>
                      </div>
                      
                      <button
                        onClick={() => increaseQuantity(product.id, product.stock)}
                        disabled={quantity >= product.stock}
                        className={`p-3 rounded-xl transition-all duration-300 shadow-md transform ${
                          quantity >= product.stock
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white text-gray-700 hover:shadow-lg hover:scale-105 active:scale-95'
                        }`}
                      >
                        <Plus className="w-5 h-5" />
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
                  onClick={() => toggleWishlist(product.id)}
                  className="w-full px-6 py-4 rounded-2xl font-semibold transition-all duration-300 border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 flex items-center justify-center gap-2"
                >
                  <Heart 
                    className={`w-5 h-5 transition-colors ${
                      wishlist.has(product.id) 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-gray-600'
                    }`} 
                  />
                  {wishlist.has(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default ProductQuickView;