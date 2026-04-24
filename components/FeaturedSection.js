import ProductCard from './ProductCard'

const FeaturedSection = ({ products }) => {
  // Get featured products grouped by category
  const featuredByCategory = {}
  
  products
    .filter(p => p.featured)
    .forEach(product => {
      if (!featuredByCategory[product.category]) {
        featuredByCategory[product.category] = []
      }
      featuredByCategory[product.category].push(product)
    })

  return (
    <div>
      <h2 className="section-title">Featured Products</h2>
      {Object.entries(featuredByCategory).map(([category, items]) => (
        <div key={category} className="category-section">
          <h3 className="category-section-title">{category}</h3>
          <div className="featured-grid">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default FeaturedSection