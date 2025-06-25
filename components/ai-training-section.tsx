import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Brain, Lightbulb, Target } from "lucide-react"

export function AITrainingSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-emerald-50 to-teal-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Capacitaciones en IA Educativa</h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Aprende a integrar la inteligencia artificial en tus clases de inglés de manera efectiva y pedagógica
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow border-emerald-200">
            <CardHeader>
              <Brain className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <CardTitle>IA para Principiantes</CardTitle>
              <CardDescription>Introducción a las herramientas de IA más útiles para docentes</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  ChatGPT para educadores
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Creación de actividades
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Evaluación automatizada
                </li>
              </ul>
              <Badge className="mb-4">2 horas</Badge>
              <div className="text-2xl font-bold text-emerald-600 mb-4">$63.000</div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Inscribirse</Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-orange-200">
            <CardHeader>
              <Lightbulb className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>IA Creativa en el Aula</CardTitle>
              <CardDescription>Herramientas de IA para crear contenido visual y multimedia</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Generación de imágenes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Videos educativos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Presentaciones dinámicas
                </li>
              </ul>
              <Badge className="mb-4">3 horas</Badge>
              <div className="text-2xl font-bold text-orange-600 mb-4">$94.000</div>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">Inscribirse</Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-teal-200">
            <CardHeader>
              <Target className="h-12 w-12 text-teal-600 mx-auto mb-4" />
              <CardTitle>IA Avanzada para Docentes</CardTitle>
              <CardDescription>Personalización del aprendizaje y análisis de datos</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Aprendizaje adaptativo
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Análisis de progreso
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Automatización de tareas
                </li>
              </ul>
              <Badge className="mb-4">4 horas</Badge>
              <div className="text-2xl font-bold text-teal-600 mb-4">$125.000</div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700">Inscribirse</Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-emerald-100 to-teal-100 border-none">
            <CardContent className="p-8">
              <h4 className="text-2xl font-bold mb-4">Paquete Completo de Capacitación</h4>
              <p className="text-gray-600 mb-6">
                Accede a las 3 capacitaciones + material exclusivo + seguimiento personalizado por 30 días
              </p>
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-400 line-through">$282.000</span>
                <span className="text-4xl font-bold text-green-600">$225.000</span>
                <Badge className="bg-green-100 text-green-800">Ahorra $57.000</Badge>
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Obtener Paquete Completo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
