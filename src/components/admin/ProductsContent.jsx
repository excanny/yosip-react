import React, { useState, useEffect } from 'react'
import { Package, X, ImagePlus, XCircle, CheckCircle, AlertCircle, Info, Pencil, Trash2 } from 'lucide-react';
import ToastContainer from './ToastContainer';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';


// Products Page Content
const ProductsContent = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toasts, setToasts] = useState([])

  // Toast functions
  const showToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const API_URL = 'http://localhost:4000/products'
      const response = await fetch(API_URL)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      // Extract products array from response
      const productsArray = data.products || data
      
      // Map MongoDB fields to expected format
      const formattedProducts = productsArray.map(product => {
        console.log(`Product ${product.name} - isActive from API:`, product.isActive)
        return {
          id: product._id,
          name: product.name,
          sku: product.sku,
          category: product.category,
          price: product.price,
          stock: product.stock,
          isActive: product.isActive !== undefined ? product.isActive : true,
          image: product.images && product.images.length > 0 
            ? `http://localhost:4000${product.images[0]}` 
            : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
          description: product.description
        }
      })
      
      console.log('Formatted products with isActive:', formattedProducts.map(p => ({name: p.name, isActive: p.isActive})))
      setProducts(formattedProducts)
      setError(null)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products. Please check if the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const handleToggleStatus = async (product) => {
    console.log('Toggle clicked for product:', product)
    const newStatus = product.isActive ? 'Active' : 'InActive'
    console.log('New status will be:', newStatus)
    
    // Store original status for reverting if needed
    const originalStatus = product.isActive
    
    // Optimistically update the UI
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === product.id ? { ...p, status: newStatus } : p
      )
    )
    
    try {
      const API_URL = `http://localhost:4000/products/${product.id}`
      console.log('Calling API:', API_URL)
      
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Update response:', data)

      showToast(
        `Product ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully!`,
        'success'
      )
    } catch (err) {
      console.error('Error updating product status:', err)
      // Revert the optimistic update on error
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === product.id ? { ...p, status: originalStatus } : p
        )
      )
      showToast('Failed to update product status', 'error')
    }
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const API_URL = `http://localhost:4000/products/${productId}`
        const response = await fetch(API_URL, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        // Refresh products list
        await fetchProducts()
        showToast('Product deleted successfully!', 'success')
      } catch (err) {
        console.error('Error deleting product:', err)
        showToast('Failed to delete product', 'error')
      }
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowEditModal(true)
  }

  // const handleSaveEdit = async (updatedProduct) => {
  //   try {
  //     const API_URL = `http://localhost:4000/products/${updatedProduct.id}`
  //     const response = await fetch(API_URL, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(updatedProduct)
  //     })

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`)
  //     }

  //     setShowEditModal(false)
  //     setEditingProduct(null)
  //     await fetchProducts()
  //     showToast('Product updated successfully!', 'success')
  //   } catch (err) {
  //     console.error('Error updating product:', err)
  //     showToast('Failed to update product', 'error')
  //   }
  // }

//   const handleSaveEdit = async (updatedProduct) => {
//   try {
//     const API_URL = `http://localhost:4000/products/${updatedProduct.id}`
    
//     // Create FormData instead of JSON
//     const formData = new FormData()
    
//     // Append all product fields to FormData
//     Object.keys(updatedProduct).forEach(key => {
//       if (key === 'images') {
//         // Skip images array if it contains file paths (not File objects)
//         // Only append if you have new File objects to upload
//         if (Array.isArray(updatedProduct.images) && updatedProduct.images[0] instanceof File) {
//           updatedProduct.images.forEach(file => {
//             formData.append('images', file)
//           })
//         }
//       } else if (key !== 'id') {
//         // Append other fields (skip id since it's in the URL)
//         formData.append(key, updatedProduct[key])
//       }
//     })
    
//     const response = await fetch(API_URL, {
//       method: 'PUT',
//       // Remove Content-Type header - browser will set it automatically with boundary
//       body: formData
//     })

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}))
//       console.error('Server error:', errorData)
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }

//     const result = await response.json()
//     console.log('Update successful:', result)
    
//     setShowEditModal(false)
//     setEditingProduct(null)
//     await fetchProducts()
//     showToast('Product updated successfully!', 'success')
//   } catch (err) {
//     console.error('Error updating product:', err)
//     showToast('Failed to update product', 'error')
//   }
// }

const handleSaveEdit = async (updatedProduct) => {
  try {
    // Check if ID exists
    if (!updatedProduct.id && !updatedProduct._id) {
      console.error('Product object:', updatedProduct)
      showToast('Product ID is missing', 'error')
      return
    }
    
    // Use either id or _id (MongoDB uses _id)
    const productId = updatedProduct.id || updatedProduct._id
    const API_URL = `http://localhost:4000/products/${productId}`
    
    console.log('Updating product ID:', productId) // Debug log
    
    // Create FormData
    const formData = new FormData()
    
    // Append all product fields to FormData
    Object.keys(updatedProduct).forEach(key => {
      if (key === 'images') {
        // Handle images if they're File objects
        if (Array.isArray(updatedProduct.images) && updatedProduct.images[0] instanceof File) {
          updatedProduct.images.forEach(file => {
            formData.append('images', file)
          })
        }
      } else if (key !== 'id' && key !== '_id') {
        // Append other fields (skip id/_id since it's in the URL)
        formData.append(key, updatedProduct[key])
      }
    })
    
    const response = await fetch(API_URL, {
      method: 'PUT',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Server error:', errorData)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    
    setShowEditModal(false)
    setEditingProduct(null)
    await fetchProducts()
    showToast('Product updated successfully!', 'success')
  } catch (err) {
    console.error('Error updating product:', err)
    showToast('Failed to update product', 'error')
  }
}

  const handleAddProduct = async () => {
    // Refresh products after adding
    setShowAddModal(false)
    await fetchProducts()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 font-medium mb-2">Error Loading Products</p>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <button 
          onClick={fetchProducts}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-600 mt-1">Manage your product inventory ({products.length} items)</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          <Package size={20} />
          <span className="font-medium">Add Product</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Product</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">SKU</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Category</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Price</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Stock</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    No products found. Add your first product to get started!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{product.sku}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{product.category}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">${product.price}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{product.stock}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          product.isActive ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                        title={product.isActive ? 'Deactivate product' : 'Activate product'}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            product.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit product">
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete product">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal 
          onClose={() => setShowAddModal(false)}
          onSave={handleAddProduct}
          showToast={showToast}
        />
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <EditProductModal 
          product={editingProduct}
          onClose={() => {
            setShowEditModal(false)
            setEditingProduct(null)
          }}
          onSave={handleSaveEdit}
          showToast={showToast}
        />
      )}
    </>
  )
}

export default ProductsContent;