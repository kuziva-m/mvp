import { Check } from 'lucide-react'

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

const ModernMinimalTemplate = ({
  businessName,
  heroHeadline,
  heroSubheadline,
  services,
  about,
  cta,
  colors = { primary: '#4b5563', secondary: '#374151', text: '#1f2937' },
  logoUrl,
}: TemplateProps) => {
  return (
    <div className="min-h-screen bg-white" style={{ color: colors.text }}>
      <header className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {logoUrl ? <img src={logoUrl} alt={businessName} className="h-8" /> : <h1 className="text-xl font-bold">{businessName}</h1>}
        </div>
      </header>

      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-6xl font-bold mb-6 leading-tight">{heroHeadline}</h2>
          <p className="text-2xl text-gray-600 mb-10">{heroSubheadline}</p>
          <button className="px-8 py-4 rounded text-white font-semibold text-lg" style={{ backgroundColor: colors.primary }}>
            {cta}
          </button>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {services.map((feature, i) => (
              <div key={i}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${colors.primary}20` }}>
                  <Check className="w-6 h-6" style={{ color: colors.primary }} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">About</h2>
          <p className="text-xl text-gray-700 leading-relaxed">{about}</p>
        </div>
      </section>

      <section className="py-24 px-4" style={{ backgroundColor: colors.primary }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Let's Work Together</h2>
          <p className="text-xl mb-8">Get in touch to learn more</p>
          <button className="px-8 py-4 bg-white rounded font-semibold text-lg" style={{ color: colors.primary }}>
            {cta}
          </button>
        </div>
      </section>

      <footer className="py-12 px-4 bg-gray-900 text-white text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} {businessName}. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default ModernMinimalTemplate
