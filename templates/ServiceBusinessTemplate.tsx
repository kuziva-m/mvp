import { Wrench, Clock, Shield } from 'lucide-react'

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

const ServiceBusinessTemplate = ({
  businessName,
  heroHeadline,
  heroSubheadline,
  services,
  about,
  cta,
  colors = { primary: '#2563eb', secondary: '#1e40af', text: '#1f2937' },
  logoUrl,
}: TemplateProps) => {
  return (
    <div className="min-h-screen bg-white" style={{ color: colors.text }}>
      <header className="py-6 px-4 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {logoUrl ? (
            <img src={logoUrl} alt={businessName} className="h-12" />
          ) : (
            <h1 className="text-2xl font-bold">{businessName}</h1>
          )}
          <button
            className="px-6 py-3 rounded-lg text-white font-semibold"
            style={{ backgroundColor: colors.primary }}
          >
            {cta}
          </button>
        </div>
      </header>

      <section
        className="py-20 px-4 text-white"
        style={{ backgroundColor: colors.primary }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            {heroHeadline}
          </h2>
          <p className="text-xl mb-8 max-w-2xl">{heroSubheadline}</p>
          <button
            className="px-8 py-4 rounded-lg font-semibold text-lg"
            style={{ backgroundColor: colors.secondary }}
          >
            {cta}
          </button>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, i) => {
              const icons = [Wrench, Clock, Shield]
              const Icon = icons[i % icons.length]
              return (
                <div
                  key={i}
                  className="p-6 rounded-lg border-2 hover:shadow-lg transition-shadow"
                  style={{ borderColor: `${colors.primary}40` }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: colors.primary }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">About Us</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">{about}</p>
            <button
              className="px-6 py-3 rounded-lg text-white font-semibold"
              style={{ backgroundColor: colors.primary }}
            >
              Learn More
            </button>
          </div>
          <div
            className="h-96 rounded-lg"
            style={{ backgroundColor: `${colors.primary}20` }}
          >
            {/* Image placeholder */}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Contact Us</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: colors.primary }}
              >
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Hours</h3>
              <p className="text-gray-600">Mon-Fri: 8am-6pm</p>
              <p className="text-gray-600">Sat: 9am-4pm</p>
            </div>
            <div>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: colors.primary }}
              >
                <Wrench className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Phone</h3>
              <p className="text-gray-600">(555) 123-4567</p>
            </div>
            <div>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: colors.primary }}
              >
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email</h3>
              <p className="text-gray-600">info@example.com</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 bg-gray-900 text-white text-center">
        <p>&copy; {new Date().getFullYear()} {businessName}. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default ServiceBusinessTemplate
