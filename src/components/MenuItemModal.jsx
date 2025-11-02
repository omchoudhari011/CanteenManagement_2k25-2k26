import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function MenuItemModal({ isOpen, onClose, editingItem }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: 'veg',
    image_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        description: editingItem.description,
        price: editingItem.price,
        type: editingItem.type,
        image_url: editingItem.image_url || ''
      })
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        type: 'veg',
        image_url: ''
      })
    }
    setError('')
  }, [editingItem, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const itemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        type: formData.type,
        image_url: formData.image_url || null
      }

      if (editingItem) {
        const { error } = await supabase
          .from('menu_items')
          .update(itemData)
          .eq('id', editingItem.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('menu_items')
          .insert([itemData])

        if (error) throw error
      }

      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="veg"
                  checked={formData.type === 'veg'}
                  onChange={handleChange}
                  className="w-4 h-4 text-veg-green focus:ring-veg-green"
                />
                <div className="w-3 h-3 rounded-full bg-veg-green"></div>
                <span>Vegetarian</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="nonveg"
                  checked={formData.type === 'nonveg'}
                  onChange={handleChange}
                  className="w-4 h-4 text-nonveg-red focus:ring-nonveg-red"
                />
                <div className="w-3 h-3 rounded-full bg-nonveg-red"></div>
                <span>Non-Vegetarian</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Optional: Enter a URL to an image</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
