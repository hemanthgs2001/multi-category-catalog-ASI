'use client'

import { useRouter } from 'next/navigation'
import { FaCar, FaMotorcycle, FaMobileAlt, FaLaptop } from 'react-icons/fa'

const CATEGORIES = [
  { label: 'Cars', icon: <FaCar size={14} /> },
  { label: 'Bikes', icon: <FaMotorcycle size={14} /> },
  { label: 'Phones', icon: <FaMobileAlt size={14} /> },
  { label: 'Laptops', icon: <FaLaptop size={14} /> },
]

const HeroSection = () => {
  const router = useRouter()

  return (
    <section className="hero">
      <div className="hero-badge">🛍️ New Arrivals Every Week</div>
      <h1>Multi Category Catalog</h1>
      <p>All in One Place</p>

      <div className="hero-category-pills">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            className="hero-category-pill"
            onClick={() => router.push(`/?category=${cat.label}`)}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>
    </section>
  )
}

export default HeroSection