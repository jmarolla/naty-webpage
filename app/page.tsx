import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Users,
  Star,
  Download,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  FileText,
  Presentation,
  ClipboardList,
  PenTool,
} from "lucide-react"
import { AITrainingSection } from "@/components/ai-training-section"
import { ContactForm } from "@/components/contact-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-25">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-emerald-600" />
              <h1 className="text-2xl font-bold text-gray-900">Miss Naty - English & AI Education</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#servicios" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Servicios
              </a>
              <a href="#productos" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Productos
              </a>
              <a href="#sobre-mi" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Sobre Mí
              </a>
              <a href="#contacto" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Contacto
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Recursos Educativos con <span className="text-emerald-600">Miss Naty</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Proyectos completos, planificaciones detalladas y capacitaciones en IA educativa diseñadas por una profesora
            con más de 15 años de experiencia para transformar tus clases de inglés.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              Ver Productos
            </Button>
            <Button size="lg" variant="outline">
              Conocer Más
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">¿Qué Ofrezco?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>Planificaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Planificaciones anuales, mensuales y semanales alineadas con el currículum oficial.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <PenTool className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <CardTitle>Actividades</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Actividades creativas y dinámicas para mantener a los estudiantes comprometidos.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Presentation className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Presentaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Presentaciones interactivas y materiales visuales para facilitar el aprendizaje.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <ClipboardList className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <CardTitle>Evaluaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Exámenes, rúbricas y herramientas de evaluación adaptadas al nivel inicial.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 text-rose-600 mx-auto mb-4 flex items-center justify-center">🤖</div>
                <CardTitle>Capacitaciones IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Capacitaciones sobre el uso de inteligencia artificial aplicada a la educación y enseñanza del inglés.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="productos" className="py-16 px-4 bg-green-50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Proyectos Destacados</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge className="bg-emerald-100 text-emerald-800">Nuevo</Badge>
                  <span className="text-2xl font-bold text-green-600">$32.000</span>
                </div>
                <CardTitle>Proyecto: My Family</CardTitle>
                <CardDescription>Unidad completa sobre la familia con 15 actividades</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Planificación de 4 semanas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    15 actividades interactivas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Presentación PowerPoint
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Evaluación final
                  </li>
                </ul>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Comprar Ahora
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge className="bg-orange-100 text-orange-800">Popular</Badge>
                  <span className="text-2xl font-bold text-green-600">$38.000</span>
                </div>
                <CardTitle>Proyecto: Animals & Pets</CardTitle>
                <CardDescription>Explorando el mundo animal en inglés</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Planificación de 6 semanas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    20 actividades + juegos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Canciones y videos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Material imprimible
                  </li>
                </ul>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Comprar Ahora
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge className="bg-teal-100 text-teal-800">Completo</Badge>
                  <span className="text-2xl font-bold text-green-600">$56.000</span>
                </div>
                <CardTitle>Proyecto: Seasons & Weather</CardTitle>
                <CardDescription>Las estaciones del año y el clima</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Planificación trimestral
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    30+ actividades
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Experimentos simples
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Evaluaciones múltiples
                  </li>
                </ul>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Comprar Ahora
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <AITrainingSection />

      {/* About Section */}
      <section id="sobre-mi" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Sobre Miss Naty</h3>
              <p className="text-gray-600 mb-4">
                Soy Miss Naty, profesora de inglés especializada en nivel inicial con más de 15 años de experiencia
                enseñando tanto en escuelas como de forma particular. Mi pasión es crear materiales educativos
                innovadores y capacitar a otros docentes en el uso de tecnología e inteligencia artificial para la
                educación.
              </p>
              <p className="text-gray-600 mb-6">
                Además de desarrollar proyectos educativos, dicto capacitaciones sobre cómo integrar la IA en el aula de
                manera efectiva y pedagógica. Cada material que creo está basado en mi experiencia y las últimas
                tendencias educativas.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm text-gray-600">1000+ estudiantes enseñados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm text-gray-600">4.9/5 valoración</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">🤖 Especialista en IA Educativa</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg p-8 text-center">
              <div className="w-32 h-32 mx-auto mb-4">
                <img
                  src="/images/miss-naty.jpg"
                  alt="Miss Naty - Profesora de Inglés"
                  className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                />
              </div>
              <h4 className="text-xl font-semibold mb-2">Miss Naty</h4>
              <p className="text-gray-600">Especialista en Inglés e IA Educativa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-16 px-4 bg-green-50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Contacto</h3>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h4 className="text-xl font-semibold mb-6">¿Tienes alguna pregunta?</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-emerald-600" />
                  <span>bonettanatalia@hotmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-emerald-600" />
                  <span>+549 11 3407 4531</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  <span>Buenos Aires, Argentina</span>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-6 w-6" />
            <span className="text-lg font-semibold">Miss Naty - English & AI Education</span>
          </div>
          <p className="text-gray-400">© 2024 Miss Naty. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
