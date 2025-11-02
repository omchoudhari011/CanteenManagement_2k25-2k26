import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import MenuItem from './MenuItem'
import MenuItemModal from './MenuItemModal'
import { useAuth } from '../contexts/AuthContext'

export default function MenuList() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchMenuItems()

    const channel = supabase
      .channel('menu_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, () => {
        fetchMenuItems()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMenuItems(data || [])
    } catch (error) {
      console.error('Error fetching menu items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item')
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingItem(null)
  }

  const filteredItems = menuItems.filter((item) => {
    if (filter === 'all') return true
    return item.type === filter
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setFilter('veg')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              filter === 'veg'
                ? 'bg-veg-green text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-veg-green border-2 border-white"></div>
            Vegetarian
          </button>
          <button
            onClick={() => setFilter('nonveg')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              filter === 'nonveg'
                ? 'bg-nonveg-red text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-nonveg-red border-2 border-white"></div>
            Non-Vegetarian
          </button>
        </div>

        {user && (
          <button
            onClick={handleAddNew}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Item
          </button>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No menu items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdmin={!!user}
            />
          ))}
        </div>
      )}

      <MenuItemModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        editingItem={editingItem}
      />
    </div>
  )
}
