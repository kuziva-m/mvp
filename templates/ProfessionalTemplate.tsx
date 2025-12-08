import { Briefcase, Award, Users } from 'lucide-react'

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

const ProfessionalTemplate = ({
  businessName,
  heroHeadline,
  heroSubheadline,
  services,
  about,
  cta,
  colors = { primary: '#1e40af', secondary: '#1e3a8a', text: '#1f2937' },
  logoUrl,
}: TemplateProps) => {
  return (
    <div className="min-h-screen bg-white" style={{ color: colors.text }}>
      <header className="py-6 px-4 border-b">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {logoUrl ? <img src={logoUrl} alt={businessName} className="h-10" /> : <h1 className="text-xl font-bold">{businessName}</h1>}
          <button className="px-6 py-2 rounded text-white font-semibold" style={{ backgroundColor: colors.primary }}>{cta}</button>
        </div>
      </header>

      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">{heroHeadline}</h2>
          <p className="text-xl text-gray-600 mb-8">{heroSubheadline}</p>
          <button className="px-8 py-3 rounded text-white font-semibold text-lg" style={{ backgroundColor: colors.primary }}>
            Schedule Consultation
          </button>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="space-y-8">
            {services.map((service, i) => (
              <div key={i} className="bg-white p-8 rounded-lg shadow-sm border-l-4" style={{ borderColor: colors.primary }}>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-bold mb-6">About Us</h2>
            <p className="text-lg text-gray-700 mb-6">{about}</p>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Award className="w-8 h-8 flex-shrink-0" style={{ color: colors.primary }} />
              <div>
                <h3 className="font-semibold text-lg mb-1">Licensed & Certified</h3>
                <p className="text-gray-600">Fully licensed professionals</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Users className="w-8 h-8 flex-shrink-0" style={{ color: colors.primary }} />
              <div>
                <h3 className="font-semibold text-lg mb-1">Experienced Team</h3>
                <p className="text-gray-600">Years of industry experience</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Briefcase className="w-8 h-8 flex-shrink-0" style={{ color: colors.primary }} />
              <div>
                <h3 className="font-semibold text-lg mb-1">Professional Service</h3>
                <p className="text-gray-600">Dedicated to your success</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4" style={{ backgroundColor: colors.primary }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6">Contact us today for a consultation</p>
          <button className="px-8 py-3 bg-white rounded font-semibold" style={{ color: colors.primary }}>
            {cta}
          </button>
        </div>
      </section>

      <footer className="py-8 px-4 bg-gray-900 text-white text-center">
        <p>&copy; {new Date().getFullYear()} {businessName}</p>
      </footer>
    </div>
  )
}

export default ProfessionalTemplate
