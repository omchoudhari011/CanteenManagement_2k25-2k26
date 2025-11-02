export default function MenuItem({ item, onEdit, onDelete, isAdmin }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-200">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                item.type === 'veg' ? 'bg-veg-green' : 'bg-nonveg-red'
              }`}
              title={item.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
            />
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          </div>
          <span className="text-lg font-bold text-gray-900">${item.price}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4">{item.description}</p>

        {isAdmin && (
          <div className="flex gap-2 pt-3 border-t border-gray-200">
            <button
              onClick={() => onEdit(item)}
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
