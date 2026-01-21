import React, { useState } from 'react'
import { X, ImagePlus, XCircle } from 'lucide-react'

// Edit Product Modal Component
const EditProductModal = ({ product, onClose, onSave, showToast }) => {
    //debugger
  const [formData, setFormData] = useState({
    id: product.id,
    name: product.name,
    sku: product.sku,
    category: product.category,
    price: product.price,
    stock: product.stock,
    description: product.description || '',
    isActive: product.isActive
  })
  const [selectedImages, setSelectedImages] = useState([])
  const [imagePreview, setImagePreview] = useState([])
  const [keepExistingImages, setKeepExistingImages] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 5) {
      showToast('Maximum 5 images allowed', 'error')
      return
    }

    setSelectedImages(files)
    setKeepExistingImages(false)

    // Clear previous previews
    setImagePreview([])

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeNewImages = () => {
    setSelectedImages([])
    setImagePreview([])
    setKeepExistingImages(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      
      // Add all text fields
      formDataToSend.append('name', formData.name)
      formDataToSend.append('sku', formData.sku)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('stock', formData.stock)
      formDataToSend.append('isActive', formData.isActive)
      if (formData.description) {
        formDataToSend.append('description', formData.description)
      }

      // Add new images if selected
      if (selectedImages.length > 0) {
        selectedImages.forEach(image => {
          formDataToSend.append('images', image)
        })
      }

      const API_URL = `http://localhost:4000/products/${formData.id}`
      
      const response = await fetch(API_URL, {
        method: 'PUT',
        body: formDataToSend
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const data = await response.json()

      if (data.success) {
        showToast('Product updated successfully!', 'success')
        onSave(data.product)
      } else {
        showToast(data.message || 'Failed to update product', 'error')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      showToast(`Failed to update product: ${error.message}`, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">Edit Product</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product name"
              disabled={isSubmitting}
            />
          </div>

          {/* SKU and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., SKU-001"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="">Select category</option>
                 <option value="Snacks">Snacks</option>
                <option value="Beverages">Beverages</option>
                <option value="Bakery">Bakery & Pastries</option>
                <option value="Confectionery">Confectionery (Sweets & Chocolates)</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Packaged Food">Packaged Food</option>
                <option value="Dairy">Dairy Products</option>
                <option value="Fruits">Fruits</option>
                <option value="Healthy Snacks">Healthy Snacks</option>
                <option value="Spices">Spices & Seasonings</option>
                <option value="Frozen Food">Frozen Food</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min="0"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product description"
              disabled={isSubmitting}
            />
          </div>

          {/* Current Image */}
          {keepExistingImages && product.image && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Image
              </label>
              <div className="relative inline-block">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-32 h-32 rounded-lg object-cover border border-gray-200"
                />
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {keepExistingImages ? 'Upload New Images (Optional)' : 'New Images'}
            </label>
            
            {imagePreview.length > 0 ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-3">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`}
                        className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={removeNewImages}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
                  disabled={isSubmitting}
                >
                  <XCircle size={16} />
                  Remove new images
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                <ImagePlus size={32} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 mb-1">Click to upload images</span>
                <span className="text-xs text-gray-500">Maximum 5 images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={isSubmitting}
                />
              </label>
            )}
          </div>

          {/* Status Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.isActive ? 'bg-green-500' : 'bg-gray-300'
                }`}
                disabled={isSubmitting}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-gray-600">
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              'Update Product'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProductModal