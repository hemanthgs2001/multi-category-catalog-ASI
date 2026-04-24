'use client'

import { useState } from 'react'

const Header = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-top">
            <a href="/" className="logo">
              My<span>Store</span>
            </a>
            <div className="header-actions">
              <div className="search-bar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" placeholder="Search products..." />
              </div>
              <button className="cart-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Cart
              </button>
            </div>
          </div>
        </div>
        <nav className="category-nav">
          <div className="container">
            <ul className="category-list">
              <li 
                className={activeCategory === 'All' ? 'active' : ''}
                onClick={() => onCategoryChange('All')}
              >
                All Products
              </li>
              {categories.map((category) => (
                <li 
                  key={category}
                  className={activeCategory === category ? 'active' : ''}
                  onClick={() => onCategoryChange(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Header