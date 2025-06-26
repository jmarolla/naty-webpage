"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Upload,
  Video,
  Brain,
  CheckCircle,
  Download,
  ArrowLeft,
  FileText,
  Loader2,
  LinkIcon,
  Youtube,
  Globe,
  Languages,
  BookOpen,
  Settings,
  X,
} from "lucide-react"
import Link from "next/link"
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx"

interface QuizConfig {
  questionTypes: {
    multipleChoice: boolean
    trueFalse: boolean
  }
  includeVocabulary: boolean
  language: string
  videoLanguage: string
  difficultyLevel: string
  focusAreas: string[]
}

export default function QuizCreatorPage() {
  const [step, setStep] = useState(1)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState("")
  const [videoSource, setVideoSource] = useState<"file" | "url">("file")
  const [questionCount, setQuestionCount] = useState([5])
  const [vocabularyCount, setVocabularyCount] = useState([10])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [quiz, setQuiz] = useState<any>(null)

  const [quizConfig, setQuizConfig] = useState<QuizConfig>({
    questionTypes: {
      multipleChoice: true,
      trueFalse: false,
    },
    includeVocabulary: false,
    language: "es",
    videoLanguage: "en",
    difficultyLevel: "intermediate",
    focusAreas: [],
  })

  const [customVocabulary, setCustomVocabulary] = useState<string[]>([])
  const [newVocabWord, setNewVocabWord] = useState("")

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setVideoFile(file)
      setVideoSource("file")
    }
  }

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(event.target.value)
    setVideoSource("url")
  }

  const addVocabularyWord = () => {
    if (newVocabWord.trim() && !customVocabulary.includes(newVocabWord.trim())) {
      setCustomVocabulary([...customVocabulary, newVocabWord.trim()])
      setNewVocabWord("")
    }
  }

  const removeVocabularyWord = (word: string) => {
    setCustomVocabulary(customVocabulary.filter((w) => w !== word))
  }

  const handleFocusAreaToggle = (area: string) => {
    setQuizConfig((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter((a) => a !== area)
        : [...prev.focusAreas, area],
    }))
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const getVideoSourceInfo = () => {
    if (videoSource === "file" && videoFile) {
      return {
        name: videoFile.name,
        size: `${(videoFile.size / 1024 / 1024).toFixed(2)} MB`,
        type: "Archivo local",
      }
    } else if (videoSource === "url" && videoUrl) {
      let platform = "Enlace directo"
      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
        platform = "YouTube"
      } else if (videoUrl.includes("vimeo.com")) {
        platform = "Vimeo"
      } else if (videoUrl.includes("drive.google.com")) {
        platform = "Google Drive"
      }

      return {
        name: videoUrl,
        platform,
        type: "URL",
      }
    }
    return null
  }

  const canProceed = () => {
    return (videoSource === "file" && videoFile) || (videoSource === "url" && videoUrl && isValidUrl(videoUrl))
  }

  const getSelectedQuestionTypes = () => {
    const types = []
    if (quizConfig.questionTypes.multipleChoice) types.push("Opción múltiple")
    if (quizConfig.questionTypes.trueFalse) types.push("Verdadero/Falso")
    return types
  }

  const handleGenerateQuiz = async () => {
    if (!canProceed()) return

    setIsProcessing(true)
    setStep(3)

    // Simular progreso de procesamiento
    const intervals = [
      { progress: 10, message: videoSource === "file" ? "Subiendo video..." : "Accediendo al video..." },
      { progress: 25, message: "Detectando idioma del contenido..." },
      { progress: 40, message: "Extrayendo audio y transcribiendo..." },
      { progress: 55, message: "Analizando contenido educativo..." },
      { progress: 70, message: "Identificando vocabulario clave..." },
      { progress: 85, message: "Generando preguntas personalizadas..." },
      { progress: 100, message: "Finalizando quiz..." },
    ]

    for (const interval of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setProgress(interval.progress)
    }

    // Simular quiz generado con preguntas más realistas
    const sourceInfo = getVideoSourceInfo()

    // Generar preguntas basadas en diferentes tipos de contenido educativo
    const generateRealisticQuestions = () => {
      const questionTemplates = {
        multipleChoice: [
          {
            question: "¿Cuál es el personaje principal de la historia?",
            options: ["Emma", "Sarah", "Michael", "David"],
            correct: 0,
            explanation: "Emma es presentada como la protagonista al inicio del video.",
            timestamp: "1:23",
          },
          {
            question: "¿Dónde tiene lugar la historia?",
            options: ["En una escuela", "En un parque", "En una biblioteca", "En casa"],
            correct: 2,
            explanation: "La historia se desarrolla principalmente en la biblioteca del pueblo.",
            timestamp: "0:45",
          },
          {
            question: "¿Qué problema enfrenta el personaje principal?",
            options: [
              "Perdió su libro favorito",
              "No puede encontrar a su mascota",
              "Tiene miedo de hablar en público",
              "Olvidó hacer su tarea",
            ],
            correct: 0,
            explanation: "El conflicto central gira en torno al libro perdido de Emma.",
            timestamp: "2:15",
          },
          {
            question: "¿Cómo se resuelve el conflicto en la historia?",
            options: [
              "Con ayuda de un amigo",
              "Encontrando una pista importante",
              "Preguntando a un adulto",
              "Por casualidad",
            ],
            correct: 1,
            explanation: "La pista en el marcapáginas lleva a la resolución del problema.",
            timestamp: "4:30",
          },
          {
            question: "¿Cuál es la lección principal de la historia?",
            options: [
              "La importancia de la amistad",
              "Nunca rendirse ante las dificultades",
              "Ser honesto siempre",
              "Cuidar nuestras pertenencias",
            ],
            correct: 1,
            explanation: "El mensaje central es sobre la perseverancia y no darse por vencido.",
            timestamp: "5:10",
          },
        ],
        trueFalse: [
          {
            question: "Emma encontró su libro en el primer lugar donde buscó.",
            correct: false,
            explanation: "Emma tuvo que buscar en varios lugares antes de encontrar su libro.",
            timestamp: "2:45",
          },
          {
            question: "La historia tiene lugar durante el verano.",
            correct: true,
            explanation: "Se mencionan las vacaciones de verano al principio del video.",
            timestamp: "0:30",
          },
          {
            question: "El bibliotecario ayudó a Emma a encontrar su libro.",
            correct: true,
            explanation: "El bibliotecario, Sr. Johnson, fue clave para resolver el misterio.",
            timestamp: "3:20",
          },
          {
            question: "Emma estaba leyendo un libro de ciencia ficción.",
            correct: false,
            explanation: "El libro perdido era una colección de cuentos de aventuras.",
            timestamp: "1:45",
          },
          {
            question: "Al final, Emma decide compartir su libro con otros niños.",
            correct: true,
            explanation: "Emma organiza un club de lectura para compartir historias.",
            timestamp: "5:45",
          },
        ],
      }

      // Generar diferentes tipos de preguntas según el contenido del video
      const contentTypes = [
        {
          type: "story",
          templates: {
            multipleChoice: [
              "¿Quién es el protagonista de la historia?",
              "¿En qué lugar se desarrolla la historia?",
              "¿Cuál es el problema principal que enfrenta el personaje?",
              "¿Cómo se resuelve el conflicto?",
              "¿Cuál es el mensaje principal de la historia?",
            ],
            trueFalse: [
              "El personaje principal logra resolver su problema sin ayuda.",
              "La historia tiene un final feliz.",
              "Los personajes aprenden una lección importante.",
              "El conflicto se resuelve de manera inesperada.",
            ],
          },
        },
        {
          type: "educational",
          templates: {
            multipleChoice: [
              "¿Cuál es el tema principal explicado en el video?",
              "¿Qué ejemplo se usa para ilustrar el concepto?",
              "¿Cuáles son las características mencionadas?",
              "¿Qué aplicación práctica se presenta?",
              "¿Cuál es la conclusión del video?",
            ],
            trueFalse: [
              "El video presenta ejemplos de la vida real.",
              "Se mencionan datos estadísticos importantes.",
              "El tema se explica de manera progresiva.",
              "Se incluyen actividades prácticas.",
            ],
          },
        },
        {
          type: "documentary",
          templates: {
            multipleChoice: [
              "¿Cuál es el tema central del documental?",
              "¿Qué experto aparece en el video?",
              "¿Qué dato sorprendente se revela?",
              "¿En qué año ocurrieron los eventos mostrados?",
              "¿Cuál es la conclusión principal?",
            ],
            trueFalse: [
              "El documental presenta evidencia científica.",
              "Se entrevista a personas expertas en el tema.",
              "Los hechos presentados están bien documentados.",
              "El video incluye imágenes históricas.",
            ],
          },
        },
      ]

      // Seleccionar tipo de contenido basado en la URL o nombre del archivo
      let selectedType = "story" // Por defecto
      const videoName = (videoSource === "file" ? videoFile?.name : videoUrl) || ""

      if (
        videoName.toLowerCase().includes("lesson") ||
        videoName.toLowerCase().includes("learn") ||
        videoName.toLowerCase().includes("tutorial")
      ) {
        selectedType = "educational"
      } else if (
        videoName.toLowerCase().includes("documentary") ||
        videoName.toLowerCase().includes("history") ||
        videoName.toLowerCase().includes("science")
      ) {
        selectedType = "documentary"
      }

      return questionTemplates
    }

    // Generar preguntas basadas en el idioma seleccionado
    const generateQuestionsInLanguage = (language: string) => {
      const questionTemplates = {
        es: {
          multipleChoice: [
            {
              question: "¿Cómo se llama la protagonista de la historia?",
              options: ["Emma", "Sarah", "Lisa", "Anna"],
              correct: 0,
              explanation: "Emma es presentada como la protagonista al inicio del video.",
            },
            {
              question: "¿Dónde busca Emma su libro perdido primero?",
              options: ["En su habitación", "En la cocina", "En el jardín", "En la sala"],
              correct: 0,
              explanation: "Emma comienza buscando en su habitación, el lugar más lógico.",
            },
            {
              question: "¿Quién ayuda a Emma en su búsqueda?",
              options: ["Su hermano pequeño", "Su mejor amiga", "Su abuela", "Su maestra"],
              correct: 1,
              explanation: "Su mejor amiga Sophie se ofrece a ayudarla inmediatamente.",
            },
            {
              question: "¿Qué tipo de libro había perdido Emma?",
              options: ["Un libro de cocina", "Un libro de aventuras", "Un libro de ciencias", "Un libro de poesía"],
              correct: 1,
              explanation: "Era su libro favorito de aventuras que había estado leyendo.",
            },
            {
              question: "¿Dónde encuentran finalmente el libro?",
              options: ["Debajo de la cama", "En la biblioteca", "En el parque", "En la escuela"],
              correct: 2,
              explanation: "El libro estaba en el banco del parque donde Emma había estado leyendo.",
            },
            {
              question: "¿Cómo se siente Emma al final de la historia?",
              options: ["Triste y preocupada", "Feliz y agradecida", "Enojada y frustrada", "Confundida y perdida"],
              correct: 1,
              explanation: "Emma se siente feliz por recuperar su libro y agradecida por la ayuda recibida.",
            },
            {
              question: "¿Qué aprende Emma de esta experiencia?",
              options: [
                "A ser más cuidadosa",
                "La importancia de la amistad",
                "A leer más rápido",
                "A no prestar libros",
              ],
              correct: 1,
              explanation: "Emma aprende lo valiosa que es la amistad y cómo los amigos se ayudan mutuamente.",
            },
            {
              question: "¿Qué hace Emma después de encontrar su libro?",
              options: [
                "Lo guarda inmediatamente",
                "Continúa leyendo en el parque",
                "Se lo presta a Sophie",
                "Lo lleva a casa",
              ],
              correct: 2,
              explanation: "Emma decide compartir la historia con Sophie como agradecimiento por su ayuda.",
            },
          ],
          trueFalse: [
            {
              question: "Emma perdió su libro en la escuela.",
              correct: false,
              explanation: "Emma perdió su libro en el parque, no en la escuela.",
            },
            {
              question: "Sophie es la mejor amiga de Emma.",
              correct: true,
              explanation: "El video establece claramente que Sophie es la mejor amiga de Emma.",
            },
            {
              question: "Emma encuentra el libro sin ayuda de nadie.",
              correct: false,
              explanation: "Sophie ayuda a Emma en la búsqueda del libro perdido.",
            },
            {
              question: "El libro que perdió Emma era nuevo.",
              correct: false,
              explanation: "Era su libro favorito que había estado leyendo, no era nuevo.",
            },
            {
              question: "Emma y Sophie buscan en varios lugares.",
              correct: true,
              explanation: "Buscan en la habitación, la cocina, el jardín y finalmente en el parque.",
            },
            {
              question: "La historia tiene un final feliz.",
              correct: true,
              explanation: "Emma recupera su libro y fortalece su amistad con Sophie.",
            },
            {
              question: "Emma decide no volver a leer en el parque.",
              correct: false,
              explanation: "Emma aprende a ser más cuidadosa, pero no deja de disfrutar la lectura al aire libre.",
            },
            {
              question: "Sophie se molesta por tener que ayudar a Emma.",
              correct: false,
              explanation: "Sophie ayuda con gusto y disfruta de la aventura de buscar el libro.",
            },
          ],
        },
        en: {
          multipleChoice: [
            {
              question: "What is the main character's name in the story?",
              options: ["Emma", "Sarah", "Lisa", "Anna"],
              correct: 0,
              explanation: "Emma is introduced as the protagonist at the beginning of the video.",
            },
            {
              question: "Where does Emma look for her lost book first?",
              options: ["In her bedroom", "In the kitchen", "In the garden", "In the living room"],
              correct: 0,
              explanation: "Emma starts by searching in her bedroom, the most logical place.",
            },
            {
              question: "Who helps Emma in her search?",
              options: ["Her little brother", "Her best friend", "Her grandmother", "Her teacher"],
              correct: 1,
              explanation: "Her best friend Sophie immediately offers to help her.",
            },
            {
              question: "What type of book had Emma lost?",
              options: ["A cookbook", "An adventure book", "A science book", "A poetry book"],
              correct: 1,
              explanation: "It was her favorite adventure book that she had been reading.",
            },
            {
              question: "Where do they finally find the book?",
              options: ["Under the bed", "At the library", "In the park", "At school"],
              correct: 2,
              explanation: "The book was on the park bench where Emma had been reading.",
            },
            {
              question: "How does Emma feel at the end of the story?",
              options: ["Sad and worried", "Happy and grateful", "Angry and frustrated", "Confused and lost"],
              correct: 1,
              explanation: "Emma feels happy to get her book back and grateful for the help she received.",
            },
            {
              question: "What does Emma learn from this experience?",
              options: ["To be more careful", "The importance of friendship", "To read faster", "Not to lend books"],
              correct: 1,
              explanation: "Emma learns how valuable friendship is and how friends help each other.",
            },
            {
              question: "What does Emma do after finding her book?",
              options: [
                "Puts it away immediately",
                "Continues reading in the park",
                "Lends it to Sophie",
                "Takes it home",
              ],
              correct: 2,
              explanation: "Emma decides to share the story with Sophie as a thank you for her help.",
            },
          ],
          trueFalse: [
            {
              question: "Emma lost her book at school.",
              correct: false,
              explanation: "Emma lost her book in the park, not at school.",
            },
            {
              question: "Sophie is Emma's best friend.",
              correct: true,
              explanation: "The video clearly establishes that Sophie is Emma's best friend.",
            },
            {
              question: "Emma finds the book without anyone's help.",
              correct: false,
              explanation: "Sophie helps Emma in the search for the lost book.",
            },
            {
              question: "The book Emma lost was new.",
              correct: false,
              explanation: "It was her favorite book that she had been reading, not a new one.",
            },
            {
              question: "Emma and Sophie search in several places.",
              correct: true,
              explanation: "They search in the bedroom, kitchen, garden, and finally in the park.",
            },
            {
              question: "The story has a happy ending.",
              correct: true,
              explanation: "Emma gets her book back and strengthens her friendship with Sophie.",
            },
            {
              question: "Emma decides never to read in the park again.",
              correct: false,
              explanation: "Emma learns to be more careful but doesn't stop enjoying reading outdoors.",
            },
            {
              question: "Sophie gets annoyed about having to help Emma.",
              correct: false,
              explanation: "Sophie helps gladly and enjoys the adventure of searching for the book.",
            },
          ],
        },
      }

      return questionTemplates[language as keyof typeof questionTemplates] || questionTemplates.es
    }

    // Usar las preguntas generadas según el idioma seleccionado
    const questionsInSelectedLanguage = generateQuestionsInLanguage(quizConfig.language)

    const mockQuiz = {
      title:
        videoSource === "file"
          ? "Quiz: " + videoFile!.name.replace(/\.[^/.]+$/, "")
          : "Quiz: Video desde " + sourceInfo!.platform,
      source: sourceInfo,
      config: quizConfig,
      vocabulary: quizConfig.includeVocabulary
        ? [
            ...(quizConfig.language === "en"
              ? [
                  {
                    word: "Adventure",
                    translation: "Aventura",
                    definition: "An exciting or unusual experience",
                    context: "Emma's search became a real adventure",
                  },
                  {
                    word: "Library",
                    translation: "Biblioteca",
                    definition: "A building containing books for public use",
                    context: "The old library was Emma's favorite place",
                  },
                  {
                    word: "Mystery",
                    translation: "Misterio",
                    definition: "Something that is difficult to understand",
                    context: "The missing book became a mystery to solve",
                  },
                  {
                    word: "Discover",
                    translation: "Descubrir",
                    definition: "To find something for the first time",
                    context: "Emma hoped to discover where her book was",
                  },
                  {
                    word: "Friendship",
                    translation: "Amistad",
                    definition: "A close relationship between friends",
                    context: "Their friendship grew stronger through the adventure",
                  },
                  {
                    word: "Courage",
                    translation: "Valor/Coraje",
                    definition: "The ability to do something brave",
                    context: "Emma showed courage when asking for help",
                  },
                  {
                    word: "Solution",
                    translation: "Solución",
                    definition: "An answer to a problem",
                    context: "The librarian provided the perfect solution",
                  },
                  {
                    word: "Grateful",
                    translation: "Agradecido/a",
                    definition: "Feeling thankful for something",
                    context: "Emma felt grateful for everyone's help",
                  },
                ]
              : [
                  {
                    word: "Aventura",
                    translation: "Adventure",
                    definition: "Una experiencia emocionante o inusual",
                    context: "La búsqueda de Emma se convirtió en una verdadera aventura",
                  },
                  {
                    word: "Biblioteca",
                    translation: "Library",
                    definition: "Un edificio que contiene libros para uso público",
                    context: "La vieja biblioteca era el lugar favorito de Emma",
                  },
                  {
                    word: "Misterio",
                    translation: "Mystery",
                    definition: "Algo que es difícil de entender",
                    context: "El libro perdido se convirtió en un misterio por resolver",
                  },
                  {
                    word: "Descubrir",
                    translation: "Discover",
                    definition: "Encontrar algo por primera vez",
                    context: "Emma esperaba descubrir dónde estaba su libro",
                  },
                  {
                    word: "Amistad",
                    translation: "Friendship",
                    definition: "Una relación cercana entre amigos",
                    context: "Su amistad se fortaleció a través de la aventura",
                  },
                  {
                    word: "Valor",
                    translation: "Courage",
                    definition: "La capacidad de hacer algo valiente",
                    context: "Emma mostró valor al pedir ayuda",
                  },
                  {
                    word: "Solución",
                    translation: "Solution",
                    definition: "Una respuesta a un problema",
                    context: "El bibliotecario proporcionó la solución perfecta",
                  },
                  {
                    word: "Agradecida",
                    translation: "Grateful",
                    definition: "Sentirse agradecido por algo",
                    context: "Emma se sintió agradecida por toda la ayuda",
                  },
                ]),
            ...customVocabulary.slice(0, Math.max(0, vocabularyCount[0] - 8)).map((word) => ({
              word,
              translation: quizConfig.language === "en" ? `Spanish: ${word}` : `English: ${word}`,
              definition: quizConfig.language === "en" ? `Definition of ${word}` : `Definición de ${word}`,
              context:
                quizConfig.language === "en"
                  ? `Example usage of ${word} in the video`
                  : `Ejemplo de uso de ${word} en el video`,
            })),
          ].slice(0, vocabularyCount[0])
        : [],
      questions: Array.from({ length: questionCount[0] }, (_, i) => {
        const isMultipleChoice =
          quizConfig.questionTypes.multipleChoice && (!quizConfig.questionTypes.trueFalse || Math.random() > 0.5)

        if (isMultipleChoice) {
          const questionIndex = i % questionsInSelectedLanguage.multipleChoice.length
          return {
            id: i + 1,
            type: "multiple-choice",
            ...questionsInSelectedLanguage.multipleChoice[questionIndex],
          }
        } else {
          const questionIndex = i % questionsInSelectedLanguage.trueFalse.length
          return {
            id: i + 1,
            type: "true-false",
            ...questionsInSelectedLanguage.trueFalse[questionIndex],
          }
        }
      }),
    }

    setQuiz(mockQuiz)
    setIsProcessing(false)
    setStep(4)
  }

  const downloadQuiz = async () => {
    // Crear el documento Word
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Título principal
            new Paragraph({
              children: [
                new TextRun({
                  text: quiz.title,
                  bold: true,
                  size: 32,
                  color: "2563EB",
                }),
              ],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),

            // Información del video
            new Paragraph({
              children: [
                new TextRun({
                  text: "Información del Video",
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Fuente: ${quiz.source.name}`,
                  size: 20,
                }),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Tipo: ${quiz.source.type}`,
                  size: 20,
                }),
              ],
              spacing: { after: 100 },
            }),

            ...(quiz.source.platform
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Plataforma: ${quiz.source.platform}`,
                        size: 20,
                      }),
                    ],
                    spacing: { after: 100 },
                  }),
                ]
              : []),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Idioma del video: ${quiz.config.videoLanguage === "en" ? "English" : "Español"}`,
                  size: 20,
                }),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Nivel: ${quiz.config.difficultyLevel === "beginner" ? "Principiante (A1-A2)" : quiz.config.difficultyLevel === "intermediate" ? "Intermedio (B1-B2)" : "Avanzado (C1-C2)"}`,
                  size: 20,
                }),
              ],
              spacing: { after: 300 },
            }),

            // Instrucciones
            new Paragraph({
              children: [
                new TextRun({
                  text: "Instrucciones",
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Este quiz contiene ${quiz.questions.length} preguntas basadas en el contenido del video. `,
                  size: 20,
                }),
                new TextRun({
                  text: "Lee cada pregunta cuidadosamente y selecciona la respuesta correcta.",
                  size: 20,
                }),
              ],
              spacing: { after: 300 },
            }),

            // Preguntas
            new Paragraph({
              children: [
                new TextRun({
                  text: "Preguntas",
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 200 },
            }),

            // Generar todas las preguntas
            ...quiz.questions.flatMap((question: any, index: number) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${index + 1}. ${question.question}`,
                    bold: true,
                    size: 22,
                  }),
                ],
                spacing: { before: 200, after: 100 },
              }),

              ...(question.type === "multiple-choice"
                ? question.options.map(
                    (option: string, optIndex: number) =>
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `${String.fromCharCode(65 + optIndex)}. ${option}`,
                            size: 20,
                            color: optIndex === question.correct ? "16A34A" : "000000",
                            bold: optIndex === question.correct,
                          }),
                        ],
                        spacing: { after: 50 },
                      }),
                  )
                : [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "A. Verdadero",
                          size: 20,
                          color: question.correct ? "16A34A" : "000000",
                          bold: question.correct,
                        }),
                      ],
                      spacing: { after: 50 },
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "B. Falso",
                          size: 20,
                          color: !question.correct ? "16A34A" : "000000",
                          bold: !question.correct,
                        }),
                      ],
                      spacing: { after: 50 },
                    }),
                  ]),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "Explicación: ",
                    bold: true,
                    size: 18,
                    italics: true,
                  }),
                  new TextRun({
                    text: question.explanation,
                    size: 18,
                    italics: true,
                    color: "6B7280",
                  }),
                ],
                spacing: { after: 200 },
              }),
            ]),

            // Vocabulario si existe
            ...(quiz.vocabulary.length > 0
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Lista de Vocabulario",
                        bold: true,
                        size: 24,
                      }),
                    ],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 400, after: 200 },
                  }),

                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${quiz.vocabulary.length} palabras clave del video:`,
                        size: 20,
                      }),
                    ],
                    spacing: { after: 200 },
                  }),

                  // Tabla de vocabulario
                  new Table({
                    width: {
                      size: 100,
                      type: WidthType.PERCENTAGE,
                    },
                    rows: [
                      // Header
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: "Palabra",
                                    bold: true,
                                    size: 20,
                                  }),
                                ],
                                alignment: AlignmentType.CENTER,
                              }),
                            ],
                            width: { size: 25, type: WidthType.PERCENTAGE },
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: "Traducción",
                                    bold: true,
                                    size: 20,
                                  }),
                                ],
                                alignment: AlignmentType.CENTER,
                              }),
                            ],
                            width: { size: 25, type: WidthType.PERCENTAGE },
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: "Definición",
                                    bold: true,
                                    size: 20,
                                  }),
                                ],
                                alignment: AlignmentType.CENTER,
                              }),
                            ],
                            width: { size: 50, type: WidthType.PERCENTAGE },
                          }),
                        ],
                      }),
                      // Filas de vocabulario
                      ...quiz.vocabulary.map(
                        (item: any) =>
                          new TableRow({
                            children: [
                              new TableCell({
                                children: [
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: item.word,
                                        size: 18,
                                        bold: true,
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              new TableCell({
                                children: [
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: item.translation,
                                        size: 18,
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              new TableCell({
                                children: [
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: item.definition,
                                        size: 18,
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                      ),
                    ],
                  }),
                ]
              : []),

            // Pie de página
            new Paragraph({
              children: [
                new TextRun({
                  text: "Generado por Miss Naty - English & AI Education",
                  size: 16,
                  italics: true,
                  color: "6B7280",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 400 },
            }),
          ],
        },
      ],
    })

    // Generar y descargar el archivo
    const blob = await Packer.toBlob(doc)
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${quiz.title.replace(/[^a-z0-9]/gi, "_")}.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadVocabulary = () => {
    if (!quiz.vocabulary.length) return

    const vocabText = quiz.vocabulary
      .map((item: any) => `${item.word} - ${item.translation}\n${item.definition}\n`)
      .join("\n")

    const blob = new Blob([vocabText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vocabulario_${quiz.title.replace(/[^a-z0-9]/gi, "_")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Video className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Generador de Quiz con IA</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= stepNumber ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 ${step > stepNumber ? "bg-purple-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Upload Video or URL */}
        {step === 1 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Video className="h-6 w-6" />
                Agregar Video Educativo
              </CardTitle>
              <CardDescription>
                Sube un archivo de video o proporciona una URL de YouTube, Vimeo, o cualquier enlace directo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="file" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Subir Archivo
                  </TabsTrigger>
                  <TabsTrigger value="url" className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Desde URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="file" className="space-y-4">
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <div className="space-y-2">
                      <Label htmlFor="video-upload" className="cursor-pointer">
                        <span className="text-lg font-medium">Haz clic para subir tu video</span>
                        <br />
                        <span className="text-sm text-gray-500">MP4, MOV, AVI (máx. 100MB)</span>
                      </Label>
                      <Input
                        id="video-upload"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="url" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="video-url">URL del Video</Label>
                      <Input
                        id="video-url"
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={videoUrl}
                        onChange={handleUrlChange}
                        className="mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border-red-200">
                        <CardContent className="p-4 text-center">
                          <Youtube className="h-8 w-8 text-red-600 mx-auto mb-2" />
                          <h4 className="font-medium text-sm">YouTube</h4>
                          <p className="text-xs text-gray-500">Videos públicos</p>
                        </CardContent>
                      </Card>
                      <Card className="border-blue-200">
                        <CardContent className="p-4 text-center">
                          <Video className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <h4 className="font-medium text-sm">Vimeo</h4>
                          <p className="text-xs text-gray-500">Videos públicos</p>
                        </CardContent>
                      </Card>
                      <Card className="border-green-200">
                        <CardContent className="p-4 text-center">
                          <Globe className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <h4 className="font-medium text-sm">Enlace Directo</h4>
                          <p className="text-xs text-gray-500">Archivos .mp4, .mov</p>
                        </CardContent>
                      </Card>
                    </div>

                    {videoUrl && !isValidUrl(videoUrl) && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-700 text-sm">Por favor, ingresa una URL válida</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {getVideoSourceInfo() && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium">Video seleccionado:</p>
                      <p className="text-sm text-gray-600 break-all">{getVideoSourceInfo()!.name}</p>
                      <div className="flex gap-4 mt-1">
                        <Badge variant="secondary">{getVideoSourceInfo()!.type}</Badge>
                        {getVideoSourceInfo()!.platform && (
                          <Badge variant="outline">{getVideoSourceInfo()!.platform}</Badge>
                        )}
                        {getVideoSourceInfo()!.size && (
                          <span className="text-xs text-gray-500">{getVideoSourceInfo()!.size}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceed()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Configure Quiz */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Settings className="h-6 w-6" />
                  Configuración Avanzada del Quiz
                </CardTitle>
                <CardDescription>Personaliza tu quiz para la enseñanza de idiomas</CardDescription>
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Configuración básica */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Configuración Básica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Cantidad de preguntas</Label>
                    <div className="mt-4">
                      <Slider
                        value={questionCount}
                        onValueChange={setQuestionCount}
                        max={20}
                        min={3}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>3</span>
                        <span className="font-medium text-purple-600">{questionCount[0]} preguntas</span>
                        <span>20</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-3 block">Tipos de preguntas</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="multiple-choice"
                          checked={quizConfig.questionTypes.multipleChoice}
                          onCheckedChange={(checked) =>
                            setQuizConfig((prev) => ({
                              ...prev,
                              questionTypes: { ...prev.questionTypes, multipleChoice: !!checked },
                            }))
                          }
                        />
                        <Label htmlFor="multiple-choice">Opción múltiple</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="true-false"
                          checked={quizConfig.questionTypes.trueFalse}
                          onCheckedChange={(checked) =>
                            setQuizConfig((prev) => ({
                              ...prev,
                              questionTypes: { ...prev.questionTypes, trueFalse: !!checked },
                            }))
                          }
                        />
                        <Label htmlFor="true-false">Verdadero / Falso</Label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quiz-language">Idioma del Quiz</Label>
                      <Select
                        value={quizConfig.language}
                        onValueChange={(value) => setQuizConfig((prev) => ({ ...prev, language: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="pt">Português</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="video-language">Idioma del Video</Label>
                      <Select
                        value={quizConfig.videoLanguage}
                        onValueChange={(value) => setQuizConfig((prev) => ({ ...prev, videoLanguage: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="pt">Português</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Nivel de dificultad</Label>
                    <Select
                      value={quizConfig.difficultyLevel}
                      onValueChange={(value) => setQuizConfig((prev) => ({ ...prev, difficultyLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Principiante (A1-A2)</SelectItem>
                        <SelectItem value="intermediate">Intermedio (B1-B2)</SelectItem>
                        <SelectItem value="advanced">Avanzado (C1-C2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Configuración de vocabulario */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Lista de Vocabulario
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-vocabulary"
                      checked={quizConfig.includeVocabulary}
                      onCheckedChange={(checked) =>
                        setQuizConfig((prev) => ({ ...prev, includeVocabulary: !!checked }))
                      }
                    />
                    <Label htmlFor="include-vocabulary">Incluir lista de vocabulario</Label>
                  </div>

                  {quizConfig.includeVocabulary && (
                    <>
                      <div>
                        <Label className="text-base font-medium">Cantidad de palabras</Label>
                        <div className="mt-4">
                          <Slider
                            value={vocabularyCount}
                            onValueChange={setVocabularyCount}
                            max={30}
                            min={5}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-500 mt-2">
                            <span>5</span>
                            <span className="font-medium text-purple-600">{vocabularyCount[0]} palabras</span>
                            <span>30</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="custom-vocab">Vocabulario personalizado (opcional)</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            id="custom-vocab"
                            placeholder="Agregar palabra..."
                            value={newVocabWord}
                            onChange={(e) => setNewVocabWord(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addVocabularyWord()}
                          />
                          <Button onClick={addVocabularyWord} size="sm">
                            Agregar
                          </Button>
                        </div>
                        {customVocabulary.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {customVocabulary.map((word, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                {word}
                                <X className="h-3 w-3 cursor-pointer" onClick={() => removeVocabularyWord(word)} />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Áreas de enfoque */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Áreas de Enfoque (opcional)
                </CardTitle>
                <CardDescription>Selecciona las habilidades específicas que quieres evaluar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    "Comprensión auditiva",
                    "Vocabulario",
                    "Gramática",
                    "Pronunciación",
                    "Expresiones idiomáticas",
                    "Cultura",
                    "Comprensión general",
                    "Detalles específicos",
                  ].map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={area}
                        checked={quizConfig.focusAreas.includes(area)}
                        onCheckedChange={() => handleFocusAreaToggle(area)}
                      />
                      <Label htmlFor={area} className="text-sm">
                        {area}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resumen de configuración */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Resumen de tu Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <strong>Preguntas:</strong> {questionCount[0]}
                    </p>
                    <p>
                      <strong>Tipos:</strong> {getSelectedQuestionTypes().join(", ")}
                    </p>
                    <p>
                      <strong>Idioma del quiz:</strong> {quizConfig.language === "es" ? "Español" : "English"}
                    </p>
                    <p>
                      <strong>Idioma del video:</strong> {quizConfig.videoLanguage === "en" ? "English" : "Español"}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Nivel:</strong>{" "}
                      {quizConfig.difficultyLevel === "beginner"
                        ? "Principiante"
                        : quizConfig.difficultyLevel === "intermediate"
                          ? "Intermedio"
                          : "Avanzado"}
                    </p>
                    <p>
                      <strong>Vocabulario:</strong>{" "}
                      {quizConfig.includeVocabulary ? `Sí (${vocabularyCount[0]} palabras)` : "No"}
                    </p>
                    <p>
                      <strong>Áreas de enfoque:</strong>{" "}
                      {quizConfig.focusAreas.length > 0 ? quizConfig.focusAreas.length : "Ninguna"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Volver
              </Button>
              <Button
                onClick={handleGenerateQuiz}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!getSelectedQuestionTypes().length}
              >
                <Brain className="h-4 w-4 mr-2" />
                Generar Quiz
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Processing */}
        {step === 3 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                Procesando Video
              </CardTitle>
              <CardDescription>Nuestra IA está analizando tu video para crear el quiz perfecto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {progress < 10 && (videoSource === "file" ? "Subiendo video..." : "Accediendo al video...")}
                    {progress >= 10 && progress < 25 && "Detectando idioma del contenido..."}
                    {progress >= 25 && progress < 40 && "Extrayendo audio y transcribiendo..."}
                    {progress >= 40 && progress < 55 && "Analizando contenido educativo..."}
                    {progress >= 55 && progress < 70 && "Identificando vocabulario clave..."}
                    {progress >= 70 && progress < 85 && "Generando preguntas personalizadas..."}
                    {progress >= 85 && "Finalizando quiz..."}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{progress}% completado</p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">¿Qué está haciendo la IA?</h4>
                <ul className="space-y-1 text-sm text-purple-800">
                  <li>🎥 {videoSource === "url" ? "Descargando video desde la URL" : "Procesando archivo de video"}</li>
                  <li>🌍 Detectando idioma: {quizConfig.videoLanguage === "en" ? "Inglés" : "Español"}</li>
                  <li>📝 Transcribiendo el diálogo y narración</li>
                  <li>📚 Identificando vocabulario clave del nivel {quizConfig.difficultyLevel}</li>
                  <li>🧠 Generando preguntas de {getSelectedQuestionTypes().join(" y ")}</li>
                  {quizConfig.includeVocabulary && <li>📖 Creando lista de vocabulario con traducciones</li>}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Quiz Generated */}
        {step === 4 && quiz && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  ¡Quiz Generado Exitosamente!
                </CardTitle>
                <CardDescription>Tu quiz personalizado está listo para usar en clase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-3">
                    <Video className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Fuente del video:</p>
                      <p className="text-sm text-gray-600 break-all">{quiz.source.name}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary">{quiz.source.type}</Badge>
                        {quiz.source.platform && <Badge variant="outline">{quiz.source.platform}</Badge>}
                        <Badge variant="outline">{quiz.config.videoLanguage === "en" ? "English" : "Español"}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mb-6">
                  <Button onClick={downloadQuiz} className="bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Quiz
                  </Button>
                  {quiz.vocabulary.length > 0 && (
                    <Button onClick={downloadVocabulary} variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Descargar Vocabulario
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep(1)
                      setVideoFile(null)
                      setVideoUrl("")
                      setQuiz(null)
                      setProgress(0)
                    }}
                  >
                    Crear Otro Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Vocabulary List */}
            {quiz.vocabulary.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Lista de Vocabulario
                  </CardTitle>
                  <CardDescription>{quiz.vocabulary.length} palabras clave del video</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {quiz.vocabulary.slice(0, 6).map((item: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-lg">{item.word}</h4>
                          <Badge variant="outline">{quiz.config.videoLanguage === "en" ? "EN" : "ES"}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Traducción:</strong> {item.translation}
                        </p>
                        <p className="text-sm text-gray-500 italic">{item.definition}</p>
                      </div>
                    ))}
                  </div>
                  {quiz.vocabulary.length > 6 && (
                    <div className="text-center text-gray-500 mt-4">
                      ... y {quiz.vocabulary.length - 6} palabras más
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quiz Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Vista Previa del Quiz
                </CardTitle>
                <CardDescription>
                  {quiz.title} - {quiz.questions.length} preguntas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quiz.questions.slice(0, 3).map((question: any, index: number) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium flex-1">
                          {index + 1}. {question.question}
                        </h4>
                        <div className="flex gap-2 ml-2">
                          <Badge variant={question.type === "multiple-choice" ? "default" : "secondary"}>
                            {question.type === "multiple-choice" ? "Opción múltiple" : "V/F"}
                          </Badge>
                        </div>
                      </div>

                      {question.type === "multiple-choice" ? (
                        <div className="space-y-2">
                          {question.options.map((option: string, optIndex: number) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded border ${
                                optIndex === question.correct
                                  ? "bg-green-50 border-green-200"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              {String.fromCharCode(65 + optIndex)}. {option}
                              {optIndex === question.correct && (
                                <CheckCircle className="h-4 w-4 text-green-600 inline ml-2" />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div
                            className={`p-2 rounded border ${
                              question.correct ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            Verdadero{" "}
                            {question.correct && <CheckCircle className="h-4 w-4 text-green-600 inline ml-2" />}
                          </div>
                          <div
                            className={`p-2 rounded border ${
                              !question.correct ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            Falso {!question.correct && <CheckCircle className="h-4 w-4 text-green-600 inline ml-2" />}
                          </div>
                        </div>
                      )}

                      <p className="text-sm text-gray-600 mt-2 italic">{question.explanation}</p>
                    </div>
                  ))}
                  {quiz.questions.length > 3 && (
                    <div className="text-center text-gray-500">... y {quiz.questions.length - 3} preguntas más</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
