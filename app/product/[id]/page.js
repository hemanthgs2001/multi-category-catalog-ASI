'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaCar, FaMotorcycle, FaMobileAlt, FaLaptop, FaBoxOpen } from 'react-icons/fa'
import productsData from '../../../data/products.json'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

const categoryIcons = {
  'Cars': <FaCar size={80} color="#888" />,
  'Bikes': <FaMotorcycle size={80} color="#888" />,
  'Phones': <FaMobileAlt size={80} color="#888" />,
  'Laptops': <FaLaptop size={80} color="#888" />,
}

const StarRating = ({ rating, totalReviews, size = 'medium' }) => {
  const starSize = size === 'large' ? 24 : 16
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <svg key={i} width={starSize} height={starSize} viewBox="0 0 24 24" fill="#FFD700">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      )
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <svg key={i} width={starSize} height={starSize} viewBox="0 0 24 24">
          <defs>
            <linearGradient id={`halfGrad-${size}-${rating}`}>
              <stop offset="50%" stopColor="#FFD700"/>
              <stop offset="50%" stopColor="#DDD"/>
            </linearGradient>
          </defs>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={`url(#halfGrad-${size}-${rating})`}/>
        </svg>
      )
    } else {
      stars.push(
        <svg key={i} width={starSize} height={starSize} viewBox="0 0 24 24" fill="#DDD">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      )
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '2px' }}>{stars}</div>
      <span style={{ fontSize: size === 'large' ? '16px' : '14px', color: '#666' }}>
        {rating} out of 5 {totalReviews > 0 ? `(${totalReviews} reviews)` : ''}
      </span>
    </div>
  )
}

// Helper function to check if a string is a valid URL
const isExternalUrl = (url) => {
  return url && (url.startsWith('http://') || url.startsWith('https://'))
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const product = productsData.products.find(p => p.id === params.id)

  const [mounted, setMounted] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!product) return
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setIsAddedToCart(cart.some(item => item.id === product.id))
    } catch {
      setIsAddedToCart(false)
    }
  }, [product?.id])

  useEffect(() => {
    if (!mounted || !product) return

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
  }, [product?.id, mounted])

  const handleAddToCart = () => {
    if (!product) return
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const alreadyInCart = cart.some(item => item.id === product.id)
      if (!alreadyInCart) {
        const updatedCart = [...cart, { ...product, quantity: 1 }]
        localStorage.setItem('cart', JSON.stringify(updatedCart))
        setIsAddedToCart(true)
        window.dispatchEvent(new Event('cartUpdated'))
      }
    } catch (err) {
      console.error('Failed to update cart:', err)
    }
  }

  const handleRemoveFromCart = () => {
    if (!product) return
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleCategoryChange = (category) => {
    if (category === 'All') {
      router.push('/')
    } else {
      router.push(`/?category=${category}`)
    }
  }

  // Get the correct image source
  const getImageSrc = () => {
    if (!product?.image) return null
    if (isExternalUrl(product.image)) {
      return product.image
    }
    return `/${product.image}`
  }

  if (!product) {
    return (
      <>
        <Header
          categories={productsData.categories}
          activeCategory="All"
          onCategoryChange={handleCategoryChange}
        />
        <main className="container">
          <div className="error">
            <h2>Product Not Found</h2>
            <p>The product you're looking for doesn't exist.</p>
            <Link href="/" className="back-link" style={{ marginTop: '20px', display: 'inline-flex' }}>
              ← Back to Store
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const imageSrc = getImageSrc()

  return (
    <>
      <Header
        categories={productsData.categories}
        activeCategory={product.category}
        onCategoryChange={handleCategoryChange}
      />
      <main className="detail-container">
        <Link href="/" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Products
        </Link>

        <div className="detail-card">
          <div className="detail-image-container" style={{ position: 'relative' }}>
            {!imageError && imageSrc ? (
              <img
                src={imageSrc}
                alt={product.itemname}
                className="detail-image"
                onError={() => setImageError(true)}
              />
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                minHeight: '300px',
                background: '#f5f5f5',
                borderRadius: '12px',
              }}>
                {categoryIcons[product.category] || <FaBoxOpen size={80} color="#888" />}
              </div>
            )}
            {discount > 0 && (
              <span className="discount-badge">
                {discount}% OFF
              </span>
            )}
          </div>

          <div className="detail-content">
            <div className="detail-header">
              <div>
                <h1 className="detail-name">{product.itemname}</h1>
                <span className="detail-category" style={{ marginTop: '10px', display: 'inline-block' }}>
                  {product.category}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="detail-price">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <div style={{
                    textDecoration: 'line-through',
                    color: '#999',
                    fontSize: '18px',
                    marginTop: '5px'
                  }}>
                    {formatPrice(product.originalPrice)}
                  </div>
                )}
                {discount > 0 && (
                  <div style={{ color: '#4CAF50', fontSize: '14px', marginTop: '5px' }}>
                    You save {formatPrice(product.originalPrice - product.price)} ({discount}%)
                  </div>
                )}
              </div>
            </div>

            <div style={{ margin: '20px 0' }}>
              <StarRating rating={product.rating} totalReviews={product.totalReviews} size="large" />
            </div>

            <p className="detail-description">{product.description}</p>

            {/* Add to Cart button */}
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

            {/* Remove from Cart button — only visible after item is added */}
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

            {product.itemprops && product.itemprops.length > 0 && (
              <>
                <h3 className="props-title">Specifications</h3>
                <div className="props-grid">
                  {product.itemprops.map((prop, index) => (
                    <div key={index} className="prop-item">
                      <div className="prop-key">{prop.key}</div>
                      <div className="prop-value">{prop.value}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {product.reviews && product.reviews.length > 0 && (
              <div style={{ marginTop: '40px' }}>
                <h3 className="props-title">Customer Reviews</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                  {product.reviews.map((review, index) => (
                    <div key={index} style={{
                      padding: '20px',
                      background: '#f9f9f9',
                      borderRadius: '8px',
                      border: '1px solid #eee'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <strong style={{ color: '#333' }}>{review.user}</strong>
                        <StarRating rating={review.rating} totalReviews={0} size="small" />
                      </div>
                      <p style={{ color: '#666', fontStyle: 'italic' }}>"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}