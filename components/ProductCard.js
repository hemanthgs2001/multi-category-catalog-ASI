'use client'

import Link from 'next/link'

const categoryIcons = {
  'Cars': '🚗',
  'Bikes': '🏍️',
  'Phones': '📱',
  'Laptops': '💻'
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
      <div style={{ display: 'flex', gap: '2px' }}>
        {stars}
      </div>
      <span style={{ fontSize: '13px', color: '#666' }}>
        {rating} ({totalReviews})
      </span>
    </div>
  )
}

const ProductCard = ({ product, onAddToCart }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToCart) onAddToCart(product)
  }

  return (
    <Link href={`/product/${product.id}`} className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.itemname}
          className="product-image"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.parentElement.textContent = categoryIcons[product.category] || '📦'
          }}
        />
        {discount > 0 && (
          <span className="discount-badge">
            {discount}% OFF
          </span>
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
            <span style={{ 
              textDecoration: 'line-through', 
              color: '#999', 
              fontSize: '14px' 
            }}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          Add to Cart
        </button>
      </div>
    </Link>
  )
}

export default ProductCard