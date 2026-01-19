import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(onClose, 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const icons = {
    success: <CheckCircle size={20} className="text-green-600" />,
    error: <AlertCircle size={20} className="text-red-600" />,
    info: <Info size={20} className="text-blue-600" />
  }

  return (
    <div
      className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 ${
        typeStyles[type]
      } ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}
    >
      {icons[type]}
      <span className="font-medium">{message}</span>
      <button
        onClick={() => {
          setIsExiting(true)
          setTimeout(onClose, 300)
        }}
        className="ml-2 hover:opacity-70 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export default Toast