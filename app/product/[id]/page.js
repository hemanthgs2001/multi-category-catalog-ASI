'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import productsData from '../../../data/products.json'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

const categoryIcons = {
  'Cars': '🚗',
  'Bikes': '🏍️',
  'Phones': '📱',
  'Laptops': '💻'
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
            <linearGradient id={`halfGrad-${size}`}>
              <stop offset="50%" stopColor="#FFD700"/>
              <stop offset="50%" stopColor="#DDD"/>
            </linearGradient>
          </defs>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={`url(#halfGrad-${size})`}/>
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
      <div style={{ display: 'flex', gap: '2px' }}>
        {stars}
      </div>
      <span style={{ fontSize: size === 'large' ? '16px' : '14px', color: '#666' }}>
        {rating} out of 5 {totalReviews > 0 ? `(${totalReviews} reviews)` : ''}
      </span>
    </div>
  )
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const product = productsData.products.find(p => p.id === params.id)

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

  // Handler for category changes - redirects to home page with category filter
  const handleCategoryChange = (category) => {
    if (category === 'All') {
      router.push('/')
    } else {
      router.push(`/?category=${category}`)
    }
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
            <img 
              src={`/${product.image}`}
              alt={product.itemname}
              className="detail-image"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentElement.textContent = categoryIcons[product.category] || '📦'
                e.target.parentElement.style.fontSize = '120px'
              }}
            />
            {discount > 0 && (
              <span style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#e53935',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
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

            {/* Customer Reviews Section */}
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