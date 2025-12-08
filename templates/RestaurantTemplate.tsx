import { Utensils, Clock, MapPin, Phone } from 'lucide-react'

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

const RestaurantTemplate = ({
  businessName,
  heroHeadline,
  heroSubheadline,
  services,
  about,
  cta,
  colors = { primary: '#ea580c', secondary: '#c2410c', text: '#1f2937' },
  logoUrl,
}: TemplateProps) => {
  return (
    <div className="min-h-screen bg-white" style={{ color: colors.text }}>
      {/* Hero */}
      <section className="relative h-[600px] flex items-center justify-center text-white"
        style={{ backgroundColor: colors.primary }}>
        <div className="text-center z-10 px-4">
          {logoUrl ? (
            <img src={logoUrl} alt={businessName} className="h-20 mx-auto mb-6" />
          ) : (
            <h1 className="text-5xl font-bold mb-4">{businessName}</h1>
          )}
          <h2 className="text-4xl font-bold mb-4">{heroHeadline}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">{heroSubheadline}</p>
          <button className="px-8 py-4 text-lg font-semibold rounded-lg"
            style={{ backgroundColor: colors.secondary }}>
            {cta}
          </button>
        </div>
      </section>

      {/* Menu Highlights */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Menu Highlights</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((item, i) => (
              <div key={i} className="text-center">
                <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                  <Utensils className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Our Story</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{about}</p>
        </div>
      </section>

      {/* Hours & Contact */}
      <section className="py-20 px-4" style={{ backgroundColor: colors.primary }}>
        <div className="max-w-6xl mx-auto text-white">
          <h2 className="text-4xl font-bold text-center mb-12">Visit Us</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Clock className="w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hours</h3>
              <p>Mon-Fri: 11am-10pm</p>
              <p>Sat-Sun: 10am-11pm</p>
            </div>
            <div>
              <MapPin className="w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p>123 Food Street</p>
            </div>
            <div>
              <Phone className="w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p>(555) 123-4567</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 bg-gray-900 text-white text-center">
        <p>&copy; {new Date().getFullYear()} {businessName}</p>
      </footer>
    </div>
  )
}

export default RestaurantTemplate
