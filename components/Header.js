// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'

// const Header = ({ categories, activeCategory = 'All', onCategoryChange = () => {} }) => {
//   return (
//     <>
//       <header className="header">
//         <div className="container">
//           <div className="header-top">
//             <Link href="/" className="logo">
//               My<span>Store</span>
//             </Link>
//             <div className="header-actions">
//               <div className="search-bar">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <circle cx="11" cy="11" r="8"></circle>
//                   <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                 </svg>
//                 <input type="text" placeholder="Search products..." />
//               </div>
//               <button className="cart-btn">
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <circle cx="9" cy="21" r="1"></circle>
//                   <circle cx="20" cy="21" r="1"></circle>
//                   <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
//                 </svg>
//                 Cart
//               </button>
//             </div>
//           </div>
//         </div>
//         <nav className="category-nav">
//           <div className="container">
//             <ul className="category-list">
//               <li 
//                 className={activeCategory === 'All' ? 'active' : ''}
//                 onClick={() => onCategoryChange('All')}
//                 style={{ cursor: 'pointer' }}
//               >
//                 All Products
//               </li>
//               {categories && categories.map((category) => (
//                 <li 
//                   key={category}
//                   className={activeCategory === category ? 'active' : ''}
//                   onClick={() => onCategoryChange(category)}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   {category}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </nav>
//       </header>
//     </>
//   )
// }

// export default Header


'use client'

import { useState } from 'react'
import Link from 'next/link'

const CATEGORY_GROUPS = [
  {
    group: 'Electronics',
    icon: '⚡',
    categories: ['Phones', 'Laptops'],
  },
  {
    group: 'Vehicles',
    icon: '🚘',
    categories: ['Cars', 'Bikes'],
  },
]

const categoryIcons = {
  Cars: '🚗',
  Bikes: '🏍️',
  Phones: '📱',
  Laptops: '💻',
}

const Header = ({
  categories = [],
  activeCategory = 'All',
  onCategoryChange = () => {},
  cart = [],
  onRemoveFromCart = () => {},
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState({ Electronics: true, Vehicles: true })

  const handleCategoryClick = (category) => {
    onCategoryChange(category)
    setSidebarOpen(false)
  }

  const toggleGroup = (group) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }))
  }

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <>
      {/* Overlays */}
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <ul className="sidebar-list">
          {/* All Products */}
          <li
            className={`sidebar-item all-products-item ${activeCategory === 'All' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('All')}
          >
            <span className="sidebar-item-icon">🛍️</span>
            All Products
          </li>

          {/* Grouped dropdowns */}
          {CATEGORY_GROUPS.map(({ group, icon, categories: cats }) => (
            <li key={group} className="sidebar-group">
              <div className="sidebar-group-header" onClick={() => toggleGroup(group)}>
                <span className="sidebar-group-icon">{icon}</span>
                <span className="sidebar-group-label">{group}</span>
                <svg
                  className={`sidebar-chevron ${openGroups[group] ? 'rotated' : ''}`}
                  width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
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
          <span className="cart-drawer-title">🛒 Your Cart</span>
          <button className="sidebar-close" onClick={() => setCartOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <span style={{ fontSize: '52px' }}>🛒</span>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={item.image}
                    alt={item.itemname}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentElement.textContent = categoryIcons[item.category] || '📦'
                    }}
                  />
                </div>
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.itemname}</p>
                  <p className="cart-item-category">{item.category}</p>
                  <p className="cart-item-price">{formatPrice(item.price)}</p>
                  <p className="cart-item-qty">Qty: {item.qty}</p>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => onRemoveFromCart(item.id)}
                  title="Remove"
                >✕</button>
              </div>
            ))
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
                MUlti<span>  Category Catalog</span>
              </Link>
            </div>
            <div className="header-actions">
              <div className="search-bar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input type="text" placeholder="Search products..." />
              </div>
              <button className="cart-btn" onClick={() => setCartOpen(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Cart
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header