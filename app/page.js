'use client'

import { useState } from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import WelcomeSection from '../components/WelcomeSection'
import ProductGrid from '../components/ProductGrid'
import Footer from '../components/Footer'
import productsData from '../data/products.json'

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = productsData.categories

  const filteredProducts = activeCategory === 'All' 
    ? productsData.products 
    : productsData.products.filter(p => p.category === activeCategory)

  return (
    <>
      <Header 
        categories={categories} 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <main className="container">
        <HeroSection />
        
        {activeCategory === 'All' ? (
          <>
            <FeaturedSection products={productsData.products} />
            <WelcomeSection />
          </>
        ) : (
          <ProductGrid 
            products={filteredProducts} 
            title={`${activeCategory} Products`}
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