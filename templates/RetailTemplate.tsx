import { ShoppingBag, Clock, MapPin } from 'lucide-react'

interface TemplateProps {
  businessName: string
  industry: string
  heroHeadline: string
  heroSubheadline: string
  services: Array<{ title: string; description: string }>
  about: string
  cta: string
  colors?: { primary: string; secondary: string; text: string }
  logoUrl?: string
}

const RetailTemplate = ({
  businessName,
  heroHeadline,
  heroSubheadline,
  services,
  about,
  cta,
  colors = { primary: '#9333ea', secondary: '#7e22ce', text: '#1f2937' },
  logoUrl,
}: TemplateProps) => {
  return (
    <div className="min-h-screen bg-white" style={{ color: colors.text }}>
      <header className="py-6 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {logoUrl ? <img src={logoUrl} alt={businessName} className="h-12" /> : <h1 className="text-2xl font-bold">{businessName}</h1>}
          <button className="px-6 py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: colors.primary }}>{cta}</button>
        </div>
      </header>

      <section className="py-20 px-4" style={{ backgroundColor: `${colors.primary}10` }}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">{heroHeadline}</h2>
          <p className="text-xl mb-8">{heroSubheadline}</p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((product, i) => (
              <div key={i} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                <div className="bg-gray-200 h-64 flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-gray-400" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">About {businessName}</h2>
          <p className="text-lg text-gray-700">{about}</p>
        </div>
      </section>

      <section className="py-16 px-4" style={{ backgroundColor: colors.primary }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 text-white">
          <div className="text-center">
            <Clock className="w-10 h-10 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Store Hours</h3>
            <p>Mon-Sat: 9am-8pm</p>
          </div>
          <div className="text-center">
            <MapPin className="w-10 h-10 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Location</h3>
            <p>123 Shopping Plaza</p>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 bg-gray-900 text-white text-center">
        <p>&copy; {new Date().getFullYear()} {businessName}</p>
      </footer>
    </div>
  )
}

export default RetailTemplate
