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
  const [searchQuery, setSearchQuery] = useState('')  
  const categories = productsData.categories

  useEffect(() => {
    const categoryParam = searchParams?.get('category')
    if (categoryParam && categories.includes(categoryParam)) {
      setActiveCategory(categoryParam)
    }
  }, [searchParams, categories])

 
  const filteredProducts = productsData.products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      p.itemname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

 
  const isSearching = searchQuery.trim() !== ''

  const handleAddToCart = (product) => {
    // cart is managed inside Header via localStorage — nothing needed here
  }

  const handleRemoveFromCart = (productId) => {
    // cart is managed inside Header via localStorage — nothing needed here
  }

  
  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    setSearchQuery('')
  }

  return (
    <>
      <Header
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        onRemoveFromCart={handleRemoveFromCart}
        onSearch={setSearchQuery}       
        searchQuery={searchQuery}       
      />
      <main className="container">
        <HeroSection />

        {isSearching && (
          <div style={{ margin: '24px 0 8px' }}>
            <h2 style={{ fontSize: '20px', color: '#333' }}>
              {filteredProducts.length > 0
                ? `${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''} for "${searchQuery}"`
                : `No results found for "${searchQuery}"`}
            </h2>
          </div>
        )}

        {(activeCategory !== 'All' || isSearching) && (
          <button
            className="back-to-all-btn"
            onClick={() => {
              setActiveCategory('All')
              setSearchQuery('')
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to All Products
          </button>
        )}

        {isSearching ? (
          <ProductGrid
            products={filteredProducts}
            title=""
            onAddToCart={handleAddToCart}
          />
        ) : activeCategory === 'All' ? (
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

        {!isSearching && activeCategory !== 'All' && filteredProducts.length > 4 && (
          <a href="#" className="view-all">View All {activeCategory}</a>
        )}
      </main>
      <Footer />
    </>
  )
}