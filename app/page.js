'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import WelcomeSection from '../components/WelcomeSection'
import ProductGrid from '../components/ProductGrid'
import Footer from '../components/Footer'
import productsData from '../data/products.json'


export default function Home() {
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState('All')
  const [cart, setCart] = useState([])
  const categories = productsData.categories

  // Check for category in URL params
  useEffect(() => {
    const categoryParam = searchParams?.get('category')
    if (categoryParam && categories.includes(categoryParam)) {
      setActiveCategory(categoryParam)
    }
  }, [searchParams, categories])

  const filteredProducts = activeCategory === 'All' 
    ? productsData.products 
    : productsData.products.filter(p => p.category === activeCategory)

  // Add to cart handler
  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  // Remove from cart handler
  const handleRemoveFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  return (
    <>
      <Header 
        categories={categories} 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        cart={cart}
        onRemoveFromCart={handleRemoveFromCart}
      />
      <main className="container">
        <HeroSection />

        {/* Back to All Products button — shown when a category is selected */}
        {activeCategory !== 'All' && (
          <button
            className="back-to-all-btn"
            onClick={() => setActiveCategory('All')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to All Products
          </button>
        )}
        
        {activeCategory === 'All' ? (
          <>
            <FeaturedSection products={productsData.products} onAddToCart={handleAddToCart} />
            <WelcomeSection />
          </>
        ) : (
          <ProductGrid 
            products={filteredProducts} 
            title={`${activeCategory} Products`}
            onAddToCart={handleAddToCart}
          />
        )}
        
        {activeCategory !== 'All' && filteredProducts.length > 4 && (
          <a href="#" className="view-all">View All {activeCategory}</a>
        )}
      </main>
      <Footer />
    </>
  )
}