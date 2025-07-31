import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from "lucide-react"

export default function DecoratorWebsite() {
  const services = [
    {
      title: "Interior Design Consultation",
      description: "Personalized design solutions tailored to your lifestyle and preferences",
      price: "Starting at $150/hr",
    },
    {
      title: "Complete Room Makeover",
      description: "Full-service room transformation from concept to completion",
      price: "Starting at $2,500",
    },
    {
      title: "Color & Material Selection",
      description: "Expert guidance on color palettes, textures, and materials",
      price: "Starting at $300",
    },
    {
      title: "Space Planning",
      description: "Optimize your space for both functionality and beauty",
      price: "Starting at $200/hr",
    },
  ]

  const portfolio = [
    {
      title: "Modern Living Room",
      category: "Residential",
      image: "/projects/?height=300&width=400",
    },
    {
      title: "Luxury Bedroom Suite",
      category: "Residential",
      image: "/projects/?height=300&width=400",
    },
    {
      title: "Contemporary Kitchen",
      category: "Residential",
      image: "/projects/?height=300&width=400",
    },
    {
      title: "Executive Office",
      category: "Commercial",
      image: "/projects/?height=300&width=400",
    },
    {
      title: "Boutique Restaurant",
      category: "Commercial",
      image: "/projects/?height=300&width=400",
    },
    {
      title: "Cozy Reading Nook",
      category: "Residential",
      image: "/projects/?height=300&width=400",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "Emma transformed our home into a space we absolutely love. Her attention to detail and understanding of our style was incredible.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      text: "Professional, creative, and within budget. Emma made our office renovation seamless and the results exceeded our expectations.",
      rating: 5,
    },
    {
      name: "Lisa Rodriguez",
      text: "Working with Emma was a dream. She listened to our needs and created a beautiful, functional space for our growing family.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-rose-800">Meryam Swilem</div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-700 hover:text-rose-600 transition-colors">
                About
              </a>
              <a href="#services" className="text-gray-700 hover:text-rose-600 transition-colors">
                Services
              </a>
              <a href="#portfolio" className="text-gray-700 hover:text-rose-600 transition-colors">
                Portfolio
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-rose-600 transition-colors">
                Testimonials
              </a>
              <a href="#contact" className="text-gray-700 hover:text-rose-600 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Creating Beautiful
                <span className="text-rose-600 block">Spaces That Inspire</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Hi, I'm Meryam Swilem, an interior decorator passionate about transforming spaces into personalized
                sanctuaries that reflect your unique style and enhance your daily life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3">
                  Book Consultation
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-rose-600 text-rose-600 hover:bg-rose-50 px-8 py-3 bg-transparent"
                >
                  View Portfolio
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=600&width=500"
                alt="Emma Claire - Interior Decorator"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-rose-600">150+</div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img src="/placeholder.svg?height=500&width=600" alt="Design Studio" className="rounded-2xl shadow-lg" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About Meryam</h2>
              <p className="text-lg text-gray-600 mb-6">
                With over 8 years of experience in interior design, I specialize in creating spaces that are both
                beautiful and functional. My approach combines timeless elegance with modern sensibilities, ensuring
                each project reflects the client's personality and lifestyle.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                I hold a Bachelor's degree in Interior Design from the Art Institute and am certified by the National
                Council for Interior Design Qualification (NCIDQ). My work has been featured in several design
                publications and I'm passionate about sustainable design practices.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-bold text-rose-600">8+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-rose-600">200+</div>
                  <div className="text-gray-600">Projects Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From initial consultation to final styling, I offer comprehensive design services tailored to your needs
              and budget.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="text-rose-600 font-semibold">{service.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Portfolio</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore some of my recent projects and see how I transform spaces into beautiful, functional environments.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.map((project, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-center">
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take my word for it - hear from some of my wonderful clients about their experience working
              with me.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Let's Create Something Beautiful</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to transform your space? I'd love to hear about your project and discuss how we can bring your
              vision to life.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Get In Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-rose-600 mr-3" />
                  <span className="text-gray-600">emma@emmaclairedesign.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-rose-600 mr-3" />
                  <span className="text-gray-600">San Francisco Bay Area, CA</span>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Follow Me</h4>
                <div className="flex space-x-4">
                  <Instagram className="w-6 h-6 text-gray-600 hover:text-rose-600 cursor-pointer transition-colors" />
                  <Facebook className="w-6 h-6 text-gray-600 hover:text-rose-600 cursor-pointer transition-colors" />
                  <Linkedin className="w-6 h-6 text-gray-600 hover:text-rose-600 cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
            <Card className="bg-gradient-to-br from-rose-50 to-amber-50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Book a Consultation</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                      <option>Select a service</option>
                      <option>Interior Design Consultation</option>
                      <option>Complete Room Makeover</option>
                      <option>Color & Material Selection</option>
                      <option>Space Planning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Tell me about your project..."
                    ></textarea>
                  </div>
                  <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-400 mb-4">Meryam Swilem Design</div>
            <p className="text-gray-400 mb-4">Creating beautiful spaces that inspire</p>
            <p className="text-gray-500 text-sm">© 2025 Meryam Swilem . All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
