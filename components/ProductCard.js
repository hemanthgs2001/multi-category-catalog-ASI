'use client'

import Link from 'next/link'
import { FaCar, FaMotorcycle, FaMobileAlt, FaLaptop, FaBoxOpen } from 'react-icons/fa'
import { useState, useEffect } from 'react'

const categoryIcons = {
  'Cars': <FaCar size={48} />,
  'Bikes': <FaMotorcycle size={48} />,
  'Phones': <FaMobileAlt size={48} />,
  'Laptops': <FaLaptop size={48} />
}

const StarRating = ({ rating, totalReviews }) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FFD700">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      )
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <svg key={i} width="16" height="16" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="#FFD700"/>
              <stop offset="50%" stopColor="#DDD"/>
            </linearGradient>
          </defs>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#halfGrad)"/>
        </svg>
      )
    } else {
      stars.push(
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#DDD">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      )
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
      <div style={{ display: 'flex', gap: '2px' }}>{stars}</div>
      <span style={{ fontSize: '13px', color: '#666' }}>
        {rating} ({totalReviews})
      </span>
    </div>
  )
}

const ProductCard = ({ product, onAddToCart }) => {
  const [imageError, setImageError] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setIsAddedToCart(cart.some(item => item.id === product.id))
    } catch {
      setIsAddedToCart(false)
    }
  }, [product.id])

  useEffect(() => {
    if (!mounted) return

    const syncCartState = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        setIsAddedToCart(cart.some(item => item.id === product.id))
      } catch {
        setIsAddedToCart(false)
      }
    }

    window.addEventListener('storage', syncCartState)
    window.addEventListener('cartUpdated', syncCartState)

    return () => {
      window.removeEventListener('storage', syncCartState)
      window.removeEventListener('cartUpdated', syncCartState)
    }
  }, [product.id, mounted])

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const alreadyInCart = cart.some(item => item.id === product.id)
      if (!alreadyInCart) {
        const updatedCart = [...cart, { ...product, quantity: 1 }]
        localStorage.setItem('cart', JSON.stringify(updatedCart))
        setIsAddedToCart(true)
        window.dispatchEvent(new Event('cartUpdated'))
      }
      if (onAddToCart) onAddToCart(product)
    } catch (err) {
      console.error('Failed to update cart:', err)
    }
  }
  const handleRemoveFromCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const updatedCart = cart.filter(item => item.id !== product.id)
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      setIsAddedToCart(false)
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (err) {
      console.error('Failed to remove from cart:', err)
    }
  }

  return (
    <Link href={`/product/${product.id}`} className="product-card">
      <div className="product-image-container">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.itemname}
            className="product-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="product-fallback-icon">
            {categoryIcons[product.category] || <FaBoxOpen size={48} />}
          </div>
        )}
        {discount > 0 && (
          <span className="discount-badge">{discount}% OFF</span>
        )}
      </div>

      <div className="product-info">
        <span className="product-category-badge">{product.category}</span>
        <h3 className="product-name">{product.itemname}</h3>
        <p className="product-description">{product.description}</p>

        <StarRating rating={product.rating} totalReviews={product.totalReviews} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <p className="product-price">{formatPrice(product.price)}</p>
          {product.originalPrice && (
            <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '14px' }}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={mounted && isAddedToCart}
          style={mounted && isAddedToCart ? { opacity: 0.75, cursor: 'not-allowed' } : {}}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {mounted && isAddedToCart ? 'Added to Cart' : 'Add to Cart'}
        </button>
        {mounted && isAddedToCart && (
          <button
            className="remove-from-cart-btn"
            onClick={handleRemoveFromCart}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Remove from Cart
          </button>
        )}
      </div>
    </Link>
  )
}

export default ProductCard