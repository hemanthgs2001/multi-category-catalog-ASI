import './globals.css'

export const metadata = {
  title: 'Multi Category Catalog - Best Products, Best Prices',
  description: 'Your one-stop shop for cars, bikes, phones, and laptops',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}