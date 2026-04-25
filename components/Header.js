'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaBolt, FaCar, FaMotorcycle, FaMobileAlt, FaLaptop, FaShoppingBag, FaChevronDown } from 'react-icons/fa'
import { RiShoppingCartFill } from 'react-icons/ri'
import { HiSearch } from 'react-icons/hi'
import { IoClose } from 'react-icons/io5'

const CATEGORY_GROUPS = [
  {
    group: 'Electronics',
    icon: <FaBolt size={18} />,
    categories: ['Phones', 'Laptops'],
  },
  {
    group: 'Vehicles',
    icon: <FaCar size={18} />,
    categories: ['Cars', 'Bikes'],
  },
]

const categoryIcons = {
  Cars: <FaCar size={18} />,
  Bikes: <FaMotorcycle size={18} />,
  Phones: <FaMobileAlt size={18} />,
  Laptops: <FaLaptop size={18} />,
}

// Helper function to check if a string is a valid external URL
const isExternalUrl = (url) => {
  return url && (url.startsWith('http://') || url.startsWith('https://'))
}

// Helper function to get the correct image source
const getImageSrc = (image) => {
  if (!image) return null
  if (isExternalUrl(image)) {
    return image
  }
  return `/${image}`
}

const Header = ({
  categories = [],
  activeCategory = 'All',
  onCategoryChange = () => {},
  onRemoveFromCart = () => {},
  onSearch = () => {},
  searchQuery = '',
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState({ Electronics: true, Vehicles: true })
  const [imageErrors, setImageErrors] = useState({})
  const [cart, setCart] = useState([])
  const [mounted, setMounted] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchQuery)

  useEffect(() => {
    setMounted(true)
    const loadCart = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('cart') || '[]')
        const normalized = stored.map(item => ({
          ...item,
          qty: item.qty ?? item.quantity ?? 1,
        }))
        setCart(normalized)
      } catch {
        setCart([])
      }
    }

    loadCart()
    window.addEventListener('cartUpdated', loadCart)
    window.addEventListener('storage', loadCart)

    return () => {
      window.removeEventListener('cartUpdated', loadCart)
      window.removeEventListener('storage', loadCart)
    }
  }, [])

  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  const saveCart = (updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    setCart(updatedCart)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const handleIncrease = (itemId) => {
    try {
      const stored = JSON.parse(localStorage.getItem('cart') || '[]')
      const updated = stored.map(item =>
        item.id === itemId
          ? { ...item, qty: (item.qty ?? item.quantity ?? 1) + 1 }
          : item
      )
      saveCart(updated)
    } catch (err) {
      console.error('Failed to increase qty:', err)
    }
  }

  const handleDecrease = (itemId) => {
    try {
      const stored = JSON.parse(localStorage.getItem('cart') || '[]')
      const updated = stored
        .map(item =>
          item.id === itemId
            ? { ...item, qty: (item.qty ?? item.quantity ?? 1) - 1 }
            : item
        )
        .filter(item => item.qty > 0) // remove if qty hits 0
      saveCart(updated)
    } catch (err) {
      console.error('Failed to decrease qty:', err)
    }
  }

  const handleCategoryClick = (category) => {
    onCategoryChange(category)
    setLocalSearch('')
    onSearch('')
    setSidebarOpen(false)
  }

  const toggleGroup = (group) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }))
  }

  const handleImageError = (itemId) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }))
  }

  const handleRemoveFromCart = (itemId) => {
    try {
      const stored = JSON.parse(localStorage.getItem('cart') || '[]')
      const updated = stored.filter(item => item.id !== itemId)
      saveCart(updated)
      if (onRemoveFromCart) onRemoveFromCart(itemId)
    } catch (err) {
      console.error('Failed to remove from cart:', err)
    }
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(localSearch.trim())
    }
  }

  const handleSearchIconClick = () => {
    onSearch(localSearch.trim())
  }

  const cartCount = mounted ? cart.reduce((sum, item) => sum + (item.qty ?? 1), 0) : 0

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)

  const cartTotal = cart.reduce((sum, item) => sum + item.price * (item.qty ?? 1), 0)

  return (
    <>
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      {cartOpen && (
        <div className="sidebar-overlay" onClick={() => setCartOpen(false)} />
      )}

      {/* ── Category Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">Categories</span>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <IoClose size={20} />
          </button>
        </div>

        <ul className="sidebar-list">
          <li
            className={`sidebar-item all-products-item ${activeCategory === 'All' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('All')}
          >
            <span className="sidebar-item-icon"><FaShoppingBag size={18} /></span>
            All Products
          </li>

          {CATEGORY_GROUPS.map(({ group, icon, categories: cats }) => (
            <li key={group} className="sidebar-group">
              <div className="sidebar-group-header" onClick={() => toggleGroup(group)}>
                <span className="sidebar-group-icon">{icon}</span>
                <span className="sidebar-group-label">{group}</span>
                <FaChevronDown
                  className={`sidebar-chevron ${openGroups[group] ? 'rotated' : ''}`}
                  size={14}
                />
              </div>
              {openGroups[group] && (
                <ul className="sidebar-sub-list">
                  {cats.map((cat) => (
                    <li
                      key={cat}
                      className={`sidebar-sub-item ${activeCategory === cat ? 'active' : ''}`}
                      onClick={() => handleCategoryClick(cat)}
                    >
                      <span className="sidebar-item-icon">{categoryIcons[cat]}</span>
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* ── Cart Drawer ── */}
      <aside className={`cart-drawer ${cartOpen ? 'cart-drawer-open' : ''}`}>
        <div className="cart-drawer-header">
          <span className="cart-drawer-title">
            <RiShoppingCartFill size={20} style={{ marginRight: '8px' }} /> Your Cart
          </span>
          <button className="sidebar-close" onClick={() => setCartOpen(false)}>
            <IoClose size={20} />
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <span style={{ fontSize: '52px' }}>🛒</span>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => {
              const imageSrc = getImageSrc(item.image)
              return (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    {!imageErrors[item.id] && imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={item.itemname}
                        onError={() => handleImageError(item.id)}
                      />
                    ) : (
                      <div className="cart-item-fallback">
                        {categoryIcons[item.category] || <FaShoppingBag size={24} />}
                      </div>
                    )}
                  </div>

                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.itemname}</p>
                    <p className="cart-item-category">{item.category}</p>
                    <p className="cart-item-price">{formatPrice(item.price)}</p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '6px',
                    }}>
                      {/* ── Minus ── */}
                      <button
                        onClick={() => handleDecrease(item.id)}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          border: '1.5px solid #ccc',
                          background: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#555',
                          lineHeight: 1,
                          flexShrink: 0,
                        }}
                        title={item.qty === 1 ? 'Remove item' : 'Decrease quantity'}
                      >
                        −
                      </button>

                      {/* ── Count ── */}
                      <span style={{
                        minWidth: '20px',
                        textAlign: 'center',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#333',
                      }}>
                        {item.qty ?? 1}
                      </span>

                      {/* ── Plus ── */}
                      <button
                        onClick={() => handleIncrease(item.id)}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          border: '1.5px solid #ccc',
                          background: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#555',
                          lineHeight: 1,
                          flexShrink: 0,
                        }}
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* ── Remove ── */}
                  <button
                    className="cart-item-remove"
                    onClick={() => handleRemoveFromCart(item.id)}
                    title="Remove"
                  >✕</button>
                </div>
              )
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span className="cart-total-amount">{formatPrice(cartTotal)}</span>
            </div>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        )}
      </aside>

      {/* ── Main Header ── */}
      <header className="header">
        <div className="container">
          <div className="header-top">
            <div className="header-left">
              <button className="hamburger-btn" onClick={() => setSidebarOpen(true)} aria-label="Open categories">
                <span></span>
                <span></span>
                <span></span>
              </button>
              <Link href="/" className="logo">
                Multi<span> Category Catalog</span>
              </Link>
            </div>
            <div className="header-actions">
              <div className="search-bar">
                <HiSearch
                  size={16}
                  onClick={handleSearchIconClick}
                  style={{ cursor: 'pointer' }}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                {localSearch && (
                  <IoClose
                    size={16}
                    style={{ cursor: 'pointer', color: '#999' }}
                    onClick={() => {
                      setLocalSearch('')
                      onSearch('')
                    }}
                  />
                )}
              </div>
              <button className="cart-btn" onClick={() => setCartOpen(true)}>
                <RiShoppingCartFill size={20} />
                Cart
                {mounted && cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header