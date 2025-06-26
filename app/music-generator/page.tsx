"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Music,
  Brain,
  CheckCircle,
  Download,
  ArrowLeft,
  FileText,
  Loader2,
  Volume2,
  Settings,
  X,
  Mic,
  Guitar,
  Piano,
} from "lucide-react"
import Link from "next/link"
import React from "react"

interface MusicConfig {
  theme: string
  customTheme: string
  musicStyle: string
  language: string
  difficultyLevel: string
  duration: string
  includeChorus: boolean
  vocabularyFocus: string[]
  customVocabulary: string[]
  mood: string
  tempo: string
}

// Función mejorada para generar audio con melodía y voz
const generateAdvancedAudio = async (song: any) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const sampleRate = audioContext.sampleRate
  const duration = 30 // 30 segundos para demo
  const length = sampleRate * duration
  const buffer = audioContext.createBuffer(2, length, sampleRate)

  // Obtener melodía y configuración
  const melody = getMelodyForSong(song)
  const tempo = getTempo(song.musicalNotes.tempo)
  const beatDuration = 60 / tempo // duración de cada beat en segundos

  for (let channel = 0; channel < 2; channel++) {
    const channelData = buffer.getChannelData(channel)

    for (let i = 0; i < length; i++) {
      const time = i / sampleRate
      let sample = 0

      // Generar melodía principal
      const currentBeat = Math.floor(time / beatDuration)
      const noteIndex = currentBeat % melody.length
      const frequency = melody[noteIndex].frequency
      const noteTime = time % beatDuration

      // Envolvente ADSR para cada nota
      let envelope = 1
      if (noteTime < 0.05) {
        // Attack
        envelope = noteTime / 0.05
      } else if (noteTime > beatDuration - 0.1) {
        // Release
        envelope = (beatDuration - noteTime) / 0.1
      } else {
        // Sustain con decay
        envelope = 0.8 * Math.exp(-2 * (noteTime - 0.05))
      }

      // Onda principal (melodía)
      sample += Math.sin(2 * Math.PI * frequency * time) * envelope * 0.3

      // Agregar armónicos para riqueza tonal
      sample += Math.sin(2 * Math.PI * frequency * 2 * time) * envelope * 0.1
      sample += Math.sin(2 * Math.PI * frequency * 3 * time) * envelope * 0.05

      // Bajo simple (fundamental)
      const bassFreq = frequency / 2
      sample += Math.sin(2 * Math.PI * bassFreq * time) * envelope * 0.2

      // Acordes de acompañamiento
      const chordFreqs = getChordFrequencies(song.musicalNotes.chords[noteIndex % song.musicalNotes.chords.length])
      chordFreqs.forEach((freq) => {
        sample += Math.sin(2 * Math.PI * freq * time) * envelope * 0.1
      })

      // Percusión simple
      if (Math.floor(time * 4) % 4 === 0) {
        const kickTime = (time * 4) % 1
        if (kickTime < 0.1) {
          sample += (Math.random() - 0.5) * 0.3 * (1 - kickTime * 10)
        }
      }

      // Hi-hat
      if (Math.floor(time * 8) % 2 === 1) {
        const hihatTime = (time * 8) % 1
        if (hihatTime < 0.05) {
          sample += (Math.random() - 0.5) * 0.1 * (1 - hihatTime * 20)
        }
      }

      channelData[i] = Math.max(-1, Math.min(1, sample))
    }
  }

  return buffer
}

// Función para obtener melodía específica por tema
const getMelodyForSong = (song: any) => {
  const melodies = {
    animals: [
      { note: "C4", frequency: 261.63 },
      { note: "E4", frequency: 329.63 },
      { note: "G4", frequency: 392.0 },
      { note: "E4", frequency: 329.63 },
      { note: "F4", frequency: 349.23 },
      { note: "D4", frequency: 293.66 },
      { note: "G4", frequency: 392.0 },
      { note: "C4", frequency: 261.63 },
    ],
    family: [
      { note: "C4", frequency: 261.63 },
      { note: "F4", frequency: 349.23 },
      { note: "G4", frequency: 392.0 },
      { note: "C5", frequency: 523.25 },
      { note: "A4", frequency: 440.0 },
      { note: "F4", frequency: 349.23 },
      { note: "G4", frequency: 392.0 },
      { note: "C4", frequency: 261.63 },
    ],
    colors: [
      { note: "C4", frequency: 261.63 },
      { note: "D4", frequency: 293.66 },
      { note: "E4", frequency: 329.63 },
      { note: "F4", frequency: 349.23 },
      { note: "G4", frequency: 392.0 },
      { note: "A4", frequency: 440.0 },
      { note: "B4", frequency: 493.88 },
      { note: "C5", frequency: 523.25 },
    ],
    default: [
      { note: "C4", frequency: 261.63 },
      { note: "G4", frequency: 392.0 },
      { note: "A4", frequency: 440.0 },
      { note: "F4", frequency: 349.23 },
      { note: "C4", frequency: 261.63 },
      { note: "G4", frequency: 392.0 },
      { note: "F4", frequency: 349.23 },
      { note: "C4", frequency: 261.63 },
    ],
  }

  return melodies[song.theme as keyof typeof melodies] || melodies.default
}

// Función para obtener frecuencias de acordes
const getChordFrequencies = (chordName: string) => {
  const chords = {
    C: [261.63, 329.63, 392.0], // C-E-G
    G: [392.0, 493.88, 587.33], // G-B-D
    Am: [220.0, 261.63, 329.63], // A-C-E
    F: [174.61, 220.0, 261.63], // F-A-C
  }

  return chords[chordName as keyof typeof chords] || chords["C"]
}

// Función para síntesis de voz (Text-to-Speech)
const synthesizeVoice = async (text: string, language = "en-US") => {
  return new Promise<void>((resolve, reject) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === "es" ? "es-ES" : "en-US"
      utterance.rate = 0.8
      utterance.pitch = 1.2
      utterance.volume = 0.8

      utterance.onend = () => resolve()
      utterance.onerror = () => reject()

      speechSynthesis.speak(utterance)
    } else {
      reject(new Error("Speech synthesis not supported"))
    }
  })
}

// Función para obtener tempo en BPM
const getTempo = (tempoString: string) => {
  const match = tempoString.match(/(\d+)/)
  return match ? Number.parseInt(match[1]) : 100
}

// Función para convertir AudioBuffer a WAV (mejorada)
const audioBufferToWav = (buffer: AudioBuffer) => {
  const length = buffer.length
  const numberOfChannels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2)
  const view = new DataView(arrayBuffer)

  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  writeString(0, "RIFF")
  view.setUint32(4, 36 + length * numberOfChannels * 2, true)
  writeString(8, "WAVE")
  writeString(12, "fmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, numberOfChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * numberOfChannels * 2, true)
  view.setUint16(32, numberOfChannels * 2, true)
  view.setUint16(34, 16, true)
  writeString(36, "data")
  view.setUint32(40, length * numberOfChannels * 2, true)

  // Audio data
  let offset = 44
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]))
      view.setInt16(offset, sample * 0x7fff, true)
      offset += 2
    }
  }

  return arrayBuffer
}

// Función para configurar mejor la síntesis de voz
const configureSpeechSynthesis = () => {
  if ("speechSynthesis" in window) {
    // Cargar voces disponibles
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices()
      console.log(
        "Voces disponibles:",
        voices.map((v) => `${v.name} (${v.lang})`),
      )
    }

    speechSynthesis.onvoiceschanged = loadVoices
    loadVoices()
  }
}

// Función para probar la síntesis de voz
const testVoice = async () => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance("Hello, this is a voice test. Can you hear me clearly?")
    utterance.lang = "en-US"
    utterance.rate = 0.8
    utterance.pitch = 1.2
    utterance.volume = 1.0

    const voices = speechSynthesis.getVoices()
    console.log(
      "Voces disponibles:",
      voices.map((v) => `${v.name} (${v.lang})`),
    )

    speechSynthesis.speak(utterance)
  } else {
    alert("Tu navegador no soporta síntesis de voz")
  }
}

// Función completamente rediseñada para reproducir con voz clara
const handlePlayPause = async () => {
  if (!generatedSong) return

  if (isPlaying) {
    // Parar reproducción
    if (audioSourceRef.current) {
      audioSourceRef.current.stop()
    }
    speechSynthesis.cancel()
    setIsPlaying(false)
    setCurrentTime(0)
    setAudioProgress(0)
  } else {
    try {
      setIsPlaying(true)
      setCurrentTime(0)
      setAudioProgress(0)
      startTimeRef.current = Date.now()

      // Crear contexto de audio para instrumental
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext

      // Generar audio instrumental con volumen muy bajo
      const audioBuffer = await generateAdvancedAudio(generatedSong)
      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer

      // Crear gain node para volumen muy bajo del instrumental
      const instrumentalGain = audioContext.createGain()
      instrumentalGain.gain.value = 0.15 // Volumen muy bajo para que predomine la voz

      source.connect(instrumentalGain)
      instrumentalGain.connect(audioContext.destination)
      audioSourceRef.current = source

      // Iniciar instrumental
      source.start(0)

      // Función para reproducir texto con voz clara
      const speakText = (text: string, delay = 0): Promise<void> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (!isPlaying) {
              resolve()
              return
            }

            if ("speechSynthesis" in window) {
              // Cancelar cualquier síntesis anterior
              speechSynthesis.cancel()

              const utterance = new SpeechSynthesisUtterance(text)

              // Configuración optimizada para claridad
              utterance.lang = generatedSong.config.language === "es" ? "es-ES" : "en-US"
              utterance.rate = 0.6 // Más lento para mejor comprensión
              utterance.pitch = 1.4 // Más agudo para destacar sobre la música
              utterance.volume = 1.0 // Volumen máximo

              // Buscar la mejor voz disponible
              const voices = speechSynthesis.getVoices()
              const targetLang = generatedSong.config.language === "es" ? "es" : "en"

              // Priorizar voces de calidad
              const preferredVoice =
                voices.find(
                  (voice) =>
                    voice.lang.startsWith(targetLang) &&
                    (voice.name.includes("Google") ||
                      voice.name.includes("Microsoft") ||
                      voice.name.includes("Female") ||
                      voice.name.includes("Samantha") ||
                      voice.name.includes("Karen")),
                ) || voices.find((voice) => voice.lang.startsWith(targetLang))

              if (preferredVoice) {
                utterance.voice = preferredVoice
                console.log(`Usando voz: ${preferredVoice.name} (${preferredVoice.lang})`)
              }

              utterance.onend = () => {
                console.log(`Terminó de decir: "${text}"`)
                resolve()
              }

              utterance.onerror = (error) => {
                console.error("Error en síntesis de voz:", error)
                resolve()
              }

              utterance.onstart = () => {
                console.log(`Comenzó a decir: "${text}"`)
              }

              speechSynthesis.speak(utterance)
            } else {
              console.log("Síntesis de voz no disponible")
              resolve()
            }
          }, delay)
        })
      }

      // Secuencia de reproducción con timing claro
      const playSequence = async () => {
        try {
          // Intro instrumental (3 segundos)
          console.log("🎵 Intro instrumental...")
          await new Promise((resolve) => setTimeout(resolve, 3000))

          if (!isPlaying) return

          // Anuncio del título
          console.log("🎤 Anunciando título...")
          await speakText(`${generatedSong.title}`)
          await new Promise((resolve) => setTimeout(resolve, 1000))

          if (!isPlaying) return

          // Verso 1 - línea por línea con pausas
          console.log("🎤 Cantando verso 1...")
          const verse1Lines = generatedSong.structure.verse1.split("\n").filter((line) => line.trim())
          for (const line of verse1Lines) {
            if (!isPlaying) break
            await speakText(line.trim())
            await new Promise((resolve) => setTimeout(resolve, 800)) // Pausa entre líneas
          }

          if (!isPlaying) return

          // Pausa musical
          console.log("🎵 Pausa musical...")
          await new Promise((resolve) => setTimeout(resolve, 1500))

          if (!isPlaying) return

          // Coro - más enfático
          console.log("🎤 Cantando coro...")
          const chorusLines = generatedSong.structure.chorus.split("\n").filter((line) => line.trim())
          for (const line of chorusLines.slice(0, 2)) {
            // Solo primeras 2 líneas del coro
            if (!isPlaying) break
            await speakText(line.trim())
            await new Promise((resolve) => setTimeout(resolve, 600))
          }

          console.log("🎵 Finalizando canción...")
        } catch (error) {
          console.error("Error en secuencia de reproducción:", error)
        }
      }

      // Iniciar secuencia
      playSequence()

      // Actualizar progreso visual
      const updateProgress = () => {
        if (isPlaying) {
          const elapsed = (Date.now() - startTimeRef.current) / 1000
          const progress = (elapsed / duration) * 100
          setCurrentTime(Math.floor(elapsed))
          setAudioProgress(Math.min(progress, 100))

          if (elapsed >= duration) {
            setIsPlaying(false)
            setCurrentTime(0)
            setAudioProgress(0)
            speechSynthesis.cancel()
          } else {
            requestAnimationFrame(updateProgress)
          }
        }
      }
      updateProgress()

      // Manejar fin del audio instrumental
      source.onended = () => {
        if (isPlaying) {
          setIsPlaying(false)
          setCurrentTime(0)
          setAudioProgress(0)
          speechSynthesis.cancel()
        }
      }
    } catch (error) {
      console.error("Error al reproducir audio:", error)
      setIsPlaying(false)
      alert(
        "Error al reproducir el audio. Verifica que tu navegador soporte síntesis de voz y que el volumen esté activado.",
      )
    }
  }
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
}

export default function MusicGeneratorPage() {
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedSong, setGeneratedSong] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(30) // 30 segundos para demo
  const [audioProgress, setAudioProgress] = useState(0)

  const [musicConfig, setMusicConfig] = useState<MusicConfig>({
    theme: "",
    customTheme: "",
    musicStyle: "pop",
    language: "en",
    difficultyLevel: "intermediate",
    duration: "short",
    includeChorus: true,
    vocabularyFocus: [],
    customVocabulary: [],
    mood: "happy",
    tempo: "medium",
  })

  const [newVocabWord, setNewVocabWord] = useState("")
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const startTimeRef = useRef<number>(0)

  const themes = [
    { id: "animals", name: "Animales", icon: "🐾" },
    { id: "family", name: "Familia", icon: "👨‍👩‍👧‍👦" },
    { id: "colors", name: "Colores", icon: "🌈" },
    { id: "numbers", name: "Números", icon: "🔢" },
    { id: "food", name: "Comida", icon: "🍎" },
    { id: "weather", name: "Clima", icon: "☀️" },
    { id: "school", name: "Escuela", icon: "🏫" },
    { id: "emotions", name: "Emociones", icon: "😊" },
    { id: "transportation", name: "Transporte", icon: "🚗" },
    { id: "nature", name: "Naturaleza", icon: "🌳" },
    { id: "friendship", name: "Amistad", icon: "🤝" },
    { id: "custom", name: "Tema personalizado", icon: "✨" },
  ]

  const musicStyles = [
    { id: "pop", name: "Pop", icon: "🎤", description: "Pegadizo y fácil de recordar" },
    { id: "folk", name: "Folk", icon: "🪕", description: "Acústico y narrativo" },
    { id: "rock", name: "Rock", icon: "🎸", description: "Energético y dinámico" },
    { id: "rap", name: "Rap", icon: "🎤", description: "Rítmico, ideal para vocabulario" },
    { id: "reggae", name: "Reggae", icon: "🌴", description: "Relajado y repetitivo" },
    { id: "country", name: "Country", icon: "🤠", description: "Storytelling y simple" },
    { id: "jazz", name: "Jazz", icon: "🎺", description: "Sofisticado y creativo" },
    { id: "children", name: "Infantil", icon: "🧸", description: "Divertido y educativo" },
  ]

  const vocabularyFocusAreas = [
    "Verbos de acción",
    "Adjetivos descriptivos",
    "Sustantivos básicos",
    "Preposiciones",
    "Expresiones cotidianas",
    "Phrasal verbs",
    "Conectores",
    "Vocabulario específico del tema",
  ]

  const addVocabularyWord = () => {
    if (newVocabWord.trim() && !musicConfig.customVocabulary.includes(newVocabWord.trim())) {
      setMusicConfig((prev) => ({
        ...prev,
        customVocabulary: [...prev.customVocabulary, newVocabWord.trim()],
      }))
      setNewVocabWord("")
    }
  }

  const removeVocabularyWord = (word: string) => {
    setMusicConfig((prev) => ({
      ...prev,
      customVocabulary: prev.customVocabulary.filter((w) => w !== word),
    }))
  }

  const handleVocabularyFocusToggle = (area: string) => {
    setMusicConfig((prev) => ({
      ...prev,
      vocabularyFocus: prev.vocabularyFocus.includes(area)
        ? prev.vocabularyFocus.filter((a) => a !== area)
        : [...prev.vocabularyFocus, area],
    }))
  }

  const canProceed = () => {
    return musicConfig.theme !== "" && (musicConfig.theme !== "custom" || musicConfig.customTheme.trim() !== "")
  }

  const getSelectedTheme = () => {
    if (musicConfig.theme === "custom") {
      return musicConfig.customTheme
    }
    return themes.find((t) => t.id === musicConfig.theme)?.name || ""
  }

  const getSelectedStyle = () => {
    return musicStyles.find((s) => s.id === musicConfig.musicStyle)
  }

  const handleGenerateMusic = async () => {
    if (!canProceed()) return

    setIsProcessing(true)
    setStep(2)

    // Simular progreso de generación
    const intervals = [
      { progress: 15, message: "Analizando tema y vocabulario..." },
      { progress: 30, message: "Seleccionando estructura musical..." },
      { progress: 45, message: "Generando letra con IA..." },
      { progress: 60, message: "Adaptando al estilo musical..." },
      { progress: 75, message: "Creando melodía y acordes..." },
      { progress: 90, message: "Optimizando para enseñanza..." },
      { progress: 100, message: "Finalizando canción..." },
    ]

    for (const interval of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setProgress(interval.progress)
    }

    // Generar canción simulada
    const mockSong = generateMockSong()
    setGeneratedSong(mockSong)
    setIsProcessing(false)
    setStep(3)
  }

  const generateMockSong = () => {
    const theme = getSelectedTheme()
    const style = getSelectedStyle()

    // Generar letras basadas en el tema y configuración
    const songTemplates = {
      animals: {
        title: "Animal Friends",
        verses: [
          "In the jungle, in the zoo\nAnimals are waiting for you\nElephants are big and gray\nMonkeys love to swing and play",
          "Lions roar so loud and strong\nBirds can sing a pretty song\nFish can swim, and cats can climb\nAnimals are fun all the time",
        ],
        chorus:
          "Animals, animals, everywhere we go\nAnimals, animals, help us learn and grow\nBig and small, short and tall\nWe love animals, one and all",
      },
      family: {
        title: "My Family Tree",
        verses: [
          "Mother, father, sister, brother\nWe all love and help each other\nGrandma tells us stories sweet\nGrandpa makes our day complete",
          "Uncle, aunt, and cousin too\nFamily love will see us through\nTogether we laugh, together we play\nFamily love grows every day",
        ],
        chorus:
          "Family, family, close to me\nFamily, family, happy we'll be\nLove and care, always there\nFamily bonds beyond compare",
      },
      colors: {
        title: "Rainbow Colors",
        verses: [
          "Red like roses, blue like sky\nYellow sun up way up high\nGreen like grass beneath our feet\nColors make our world complete",
          "Orange pumpkins, purple grapes\nColors come in many shapes\nPink like flowers, brown like trees\nColors dancing in the breeze",
        ],
        chorus:
          "Colors, colors, all around\nColors, colors, can be found\nBright and bold, stories told\nColors worth their weight in gold",
      },
    }

    const defaultTemplate = {
      title: `Song About ${theme}`,
      verses: [
        `Learning about ${theme.toLowerCase()} today\nIn a fun and special way\nWords and music, rhythm and rhyme\nMaking learning a good time`,
        `${theme} helps us understand\nThe world around us, isn't it grand?\nSinging, dancing, having fun\nLearning has just begun`,
      ],
      chorus: `${theme}, ${theme}, let's explore\n${theme}, ${theme}, and so much more\nSing along, learn the song\nWith ${theme.toLowerCase()}, we can't go wrong`,
    }

    const template = songTemplates[musicConfig.theme as keyof typeof songTemplates] || defaultTemplate

    // Adaptar según el estilo musical
    let adaptedLyrics = template
    if (musicConfig.musicStyle === "rap") {
      adaptedLyrics = {
        ...template,
        title: `${template.title} (Rap Version)`,
        verses: template.verses.map((verse) =>
          verse.replace(/\n/g, " / ").replace(/,/g, " yeah,").replace(/\./g, " uh-huh."),
        ),
      }
    }

    // Generar vocabulario destacado
    const vocabularyWords = generateVocabularyForTheme(musicConfig.theme)

    return {
      title: adaptedLyrics.title,
      theme: theme,
      style: style?.name,
      config: musicConfig,
      structure: {
        intro: "Instrumental intro (8 beats)",
        verse1: adaptedLyrics.verses[0],
        chorus: adaptedLyrics.chorus,
        verse2: adaptedLyrics.verses[1],
        chorus2: adaptedLyrics.chorus,
        bridge: musicConfig.includeChorus ? "Musical bridge (4 beats)" : null,
        outro: "Fade out with chorus",
      },
      vocabulary: vocabularyWords,
      musicalNotes: {
        key: "C Major",
        tempo: musicConfig.tempo === "slow" ? "70 BPM" : musicConfig.tempo === "fast" ? "130 BPM" : "100 BPM",
        timeSignature: "4/4",
        chords: style?.id === "folk" ? ["C", "G", "Am", "F"] : ["C", "G", "F", "Am"],
      },
      teachingTips: [
        "Encourage students to clap along with the rhythm",
        "Practice pronunciation of key vocabulary words",
        "Use gestures and movements to reinforce meaning",
        "Repeat the chorus multiple times for memorization",
        "Create simple choreography for engagement",
      ],
    }
  }

  const generateVocabularyForTheme = (theme: string) => {
    const vocabularyByTheme = {
      animals: [
        { word: "elephant", translation: "elefante", category: "noun" },
        { word: "monkey", translation: "mono", category: "noun" },
        { word: "roar", translation: "rugir", category: "verb" },
        { word: "swing", translation: "balancearse", category: "verb" },
        { word: "big", translation: "grande", category: "adjective" },
        { word: "small", translation: "pequeño", category: "adjective" },
      ],
      family: [
        { word: "mother", translation: "madre", category: "noun" },
        { word: "father", translation: "padre", category: "noun" },
        { word: "sister", translation: "hermana", category: "noun" },
        { word: "brother", translation: "hermano", category: "noun" },
        { word: "love", translation: "amar", category: "verb" },
        { word: "care", translation: "cuidar", category: "verb" },
      ],
      colors: [
        { word: "red", translation: "rojo", category: "adjective" },
        { word: "blue", translation: "azul", category: "adjective" },
        { word: "yellow", translation: "amarillo", category: "adjective" },
        { word: "green", translation: "verde", category: "adjective" },
        { word: "bright", translation: "brillante", category: "adjective" },
        { word: "colorful", translation: "colorido", category: "adjective" },
      ],
    }

    return (
      vocabularyByTheme[theme as keyof typeof vocabularyByTheme] || [
        { word: "learn", translation: "aprender", category: "verb" },
        { word: "sing", translation: "cantar", category: "verb" },
        { word: "fun", translation: "divertido", category: "adjective" },
        { word: "music", translation: "música", category: "noun" },
        { word: "song", translation: "canción", category: "noun" },
        { word: "rhythm", translation: "ritmo", category: "noun" },
      ]
    )
  }

  const downloadLyrics = () => {
    const lyricsText = `${generatedSong.title}
Tema: ${generatedSong.theme}
Estilo: ${generatedSong.style}

ESTRUCTURA:

Intro: ${generatedSong.structure.intro}

Verso 1:
${generatedSong.structure.verse1}

Coro:
${generatedSong.structure.chorus}

Verso 2:
${generatedSong.structure.verse2}

Coro:
${generatedSong.structure.chorus2}

${generatedSong.structure.bridge ? `Bridge: ${generatedSong.structure.bridge}` : ""}

Outro: ${generatedSong.structure.outro}

INFORMACIÓN MUSICAL:
- Tonalidad: ${generatedSong.musicalNotes.key}
- Tempo: ${generatedSong.musicalNotes.tempo}
- Compás: ${generatedSong.musicalNotes.timeSignature}
- Acordes sugeridos: ${generatedSong.musicalNotes.chords.join(" - ")}

VOCABULARIO CLAVE:
${generatedSong.vocabulary.map((v: any) => `${v.word} (${v.translation}) - ${v.category}`).join("\n")}

CONSEJOS PARA ENSEÑAR:
${generatedSong.teachingTips.map((tip: string, index: number) => `${index + 1}. ${tip}`).join("\n")}

Generado por Miss Naty - English & AI Education`

    const blob = new Blob([lyricsText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${generatedSong.title.replace(/[^a-z0-9]/gi, "_")}_lyrics.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAudio = async () => {
    if (!generatedSong) return

    try {
      const audioBuffer = await generateAdvancedAudio(generatedSong)
      const wavArrayBuffer = audioBufferToWav(audioBuffer)
      const blob = new Blob([wavArrayBuffer], { type: "audio/wav" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${generatedSong.title.replace(/[^a-z0-9]/gi, "_")}.wav`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error al generar audio:", error)
      alert("Error al generar el archivo de audio. Tu navegador podría no soportar esta funcionalidad.")
    }
  }

  // Llamar esta función cuando se monta el componente
  React.useEffect(() => {
    configureSpeechSynthesis()
  }, [])

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
              <Music className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Generador de Música Educativa</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= stepNumber ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 ${step > stepNumber ? "bg-purple-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Configure Music */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Music className="h-6 w-6" />
                  Crear Canción Educativa
                </CardTitle>
                <CardDescription>
                  Genera canciones personalizadas para enseñar vocabulario y conceptos en inglés
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Selección de tema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Tema de la Canción
                </CardTitle>
                <CardDescription>Elige el tema principal que quieres enseñar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {themes.map((theme) => (
                    <Card
                      key={theme.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        musicConfig.theme === theme.id ? "ring-2 ring-purple-500 bg-purple-50" : ""
                      }`}
                      onClick={() => setMusicConfig((prev) => ({ ...prev, theme: theme.id }))}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">{theme.icon}</div>
                        <h4 className="font-medium text-sm">{theme.name}</h4>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {musicConfig.theme === "custom" && (
                  <div className="mt-4">
                    <Label htmlFor="custom-theme">Describe tu tema personalizado</Label>
                    <Textarea
                      id="custom-theme"
                      placeholder="Ej: Los planetas del sistema solar, profesiones, deportes..."
                      value={musicConfig.customTheme}
                      onChange={(e) => setMusicConfig((prev) => ({ ...prev, customTheme: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Estilo musical */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Guitar className="h-5 w-5" />
                    Estilo Musical
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {musicStyles.map((style) => (
                    <div
                      key={style.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        musicConfig.musicStyle === style.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                      onClick={() => setMusicConfig((prev) => ({ ...prev, musicStyle: style.id }))}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{style.icon}</span>
                        <div>
                          <h4 className="font-medium">{style.name}</h4>
                          <p className="text-sm text-gray-600">{style.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Configuración básica */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="language">Idioma de la canción</Label>
                    <Select
                      value={musicConfig.language}
                      onValueChange={(value) => setMusicConfig((prev) => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="bilingual">Bilingüe (EN/ES)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Nivel de dificultad</Label>
                    <Select
                      value={musicConfig.difficultyLevel}
                      onValueChange={(value) => setMusicConfig((prev) => ({ ...prev, difficultyLevel: value }))}
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

                  <div>
                    <Label htmlFor="duration">Duración</Label>
                    <Select
                      value={musicConfig.duration}
                      onValueChange={(value) => setMusicConfig((prev) => ({ ...prev, duration: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Corta (30 seg demo)</SelectItem>
                        <SelectItem value="medium">Media (1 min demo)</SelectItem>
                        <SelectItem value="long">Larga (2 min demo)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="mood">Estado de ánimo</Label>
                      <Select
                        value={musicConfig.mood}
                        onValueChange={(value) => setMusicConfig((prev) => ({ ...prev, mood: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="happy">Alegre</SelectItem>
                          <SelectItem value="calm">Tranquilo</SelectItem>
                          <SelectItem value="energetic">Energético</SelectItem>
                          <SelectItem value="playful">Juguetón</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="tempo">Tempo</Label>
                      <Select
                        value={musicConfig.tempo}
                        onValueChange={(value) => setMusicConfig((prev) => ({ ...prev, tempo: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slow">Lento</SelectItem>
                          <SelectItem value="medium">Medio</SelectItem>
                          <SelectItem value="fast">Rápido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-chorus"
                      checked={musicConfig.includeChorus}
                      onCheckedChange={(checked) => setMusicConfig((prev) => ({ ...prev, includeChorus: !!checked }))}
                    />
                    <Label htmlFor="include-chorus">Incluir coro pegadizo</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enfoque de vocabulario */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Enfoque de Vocabulario
                </CardTitle>
                <CardDescription>Selecciona qué tipo de vocabulario quieres enfatizar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {vocabularyFocusAreas.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={area}
                        checked={musicConfig.vocabularyFocus.includes(area)}
                        onCheckedChange={() => handleVocabularyFocusToggle(area)}
                      />
                      <Label htmlFor={area} className="text-sm">
                        {area}
                      </Label>
                    </div>
                  ))}
                </div>

                <div>
                  <Label htmlFor="custom-vocab">Palabras específicas a incluir (opcional)</Label>
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
                  {musicConfig.customVocabulary.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {musicConfig.customVocabulary.map((word, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {word}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeVocabularyWord(word)} />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Resumen */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Resumen de tu Canción</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <strong>Tema:</strong> {getSelectedTheme()}
                    </p>
                    <p>
                      <strong>Estilo:</strong> {getSelectedStyle()?.name}
                    </p>
                    <p>
                      <strong>Idioma:</strong>{" "}
                      {musicConfig.language === "en"
                        ? "English"
                        : musicConfig.language === "es"
                          ? "Español"
                          : "Bilingüe"}
                    </p>
                    <p>
                      <strong>Duración:</strong>{" "}
                      {musicConfig.duration === "short"
                        ? "Corta"
                        : musicConfig.duration === "medium"
                          ? "Media"
                          : "Larga"}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Nivel:</strong>{" "}
                      {musicConfig.difficultyLevel === "beginner"
                        ? "Principiante"
                        : musicConfig.difficultyLevel === "intermediate"
                          ? "Intermedio"
                          : "Avanzado"}
                    </p>
                    <p>
                      <strong>Estado de ánimo:</strong> {musicConfig.mood}
                    </p>
                    <p>
                      <strong>Tempo:</strong> {musicConfig.tempo}
                    </p>
                    <p>
                      <strong>Vocabulario personalizado:</strong> {musicConfig.customVocabulary.length} palabras
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                onClick={handleGenerateMusic}
                disabled={!canProceed()}
                className="bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                <Music className="h-5 w-5 mr-2" />
                Generar Canción
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Processing */}
        {step === 2 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                Creando tu Canción
              </CardTitle>
              <CardDescription>Nuestra IA está componiendo una canción educativa personalizada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {progress < 15 && "Analizando tema y vocabulario..."}
                    {progress >= 15 && progress < 30 && "Seleccionando estructura musical..."}
                    {progress >= 30 && progress < 45 && "Generando letra con IA..."}
                    {progress >= 45 && progress < 60 && "Adaptando al estilo musical..."}
                    {progress >= 60 && progress < 75 && "Creando melodía y acordes..."}
                    {progress >= 75 && progress < 90 && "Optimizando para enseñanza..."}
                    {progress >= 90 && "Finalizando canción..."}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{progress}% completado</p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">¿Qué está haciendo la IA?</h4>
                <ul className="space-y-1 text-sm text-purple-800">
                  <li>🎵 Analizando el tema "{getSelectedTheme()}"</li>
                  <li>🎸 Adaptando al estilo {getSelectedStyle()?.name}</li>
                  <li>📝 Generando letra educativa y pegadiza</li>
                  <li>🎼 Creando estructura musical apropiada</li>
                  <li>📚 Incorporando vocabulario específico</li>
                  <li>🎯 Optimizando para nivel {musicConfig.difficultyLevel}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Generated Song */}
        {step === 3 && generatedSong && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  ¡Canción Generada Exitosamente!
                </CardTitle>
                <CardDescription>Tu canción educativa está lista para usar en clase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-3">
                    <Music className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-lg">{generatedSong.title}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary">{generatedSong.theme}</Badge>
                        <Badge variant="outline">{generatedSong.style}</Badge>
                        <Badge variant="outline">{generatedSong.musicalNotes.tempo}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mb-6">
                  <Button onClick={downloadLyrics} className="bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Letra
                  </Button>
                  <Button onClick={handlePlayPause} variant="outline">
                    {isPlaying ? (
                      <>
                        <div className="w-4 h-4 mr-2 flex items-center justify-center">
                          <div className="w-1 h-3 bg-current mr-0.5"></div>
                          <div className="w-1 h-3 bg-current"></div>
                        </div>
                        Pausar
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-4 w-4 mr-2" />
                        Escuchar Preview
                      </>
                    )}
                  </Button>
                  <Button onClick={downloadAudio} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Audio
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep(1)
                      setGeneratedSong(null)
                      setProgress(0)
                      setIsPlaying(false)
                      setCurrentTime(0)
                      setAudioProgress(0)
                    }}
                  >
                    Crear Otra Canción
                  </Button>
                  <Button onClick={testVoice} variant="outline" size="sm">
                    🎤 Probar Voz
                  </Button>
                </div>

                {/* Información sobre el audio */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-blue-900 mb-2">🎵 Sobre el Audio Generado</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>
                      • <strong>Melodía instrumental:</strong> Generada con síntesis musical avanzada
                    </li>
                    <li>
                      • <strong>Voz cantada:</strong> Síntesis de voz sincronizada con la música
                    </li>
                    <li>
                      • <strong>Reproducción:</strong> Instrumental + letra cantada línea por línea
                    </li>
                    <li>
                      • <strong>Duración:</strong> 30 segundos con melodía y letra completas
                    </li>
                    <li>
                      • <strong>Tip:</strong> Asegúrate de tener el volumen activado y permisos de audio
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Audio Player */}
            {(isPlaying || currentTime > 0) && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Button size="sm" onClick={handlePlayPause} className="bg-purple-600 hover:bg-purple-700">
                      {isPlaying ? (
                        <div className="w-4 h-4 flex items-center justify-center">
                          <div className="w-1 h-3 bg-white mr-0.5"></div>
                          <div className="w-1 h-3 bg-white"></div>
                        </div>
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>

                    <div className="flex-1">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${audioProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      {isPlaying && (
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-3 bg-purple-600 animate-pulse"></div>
                          <div className="w-1 h-2 bg-purple-600 animate-pulse" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-1 h-4 bg-purple-600 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-1 h-2 bg-purple-600 animate-pulse" style={{ animationDelay: "0.3s" }}></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 text-center">
                    <p className="text-sm text-gray-600">
                      🎵 Reproduciendo: <span className="font-medium">{generatedSong.title}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Estilo: {generatedSong.style} • Tempo: {generatedSong.musicalNotes.tempo}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Song Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Estructura de la Canción
                </CardTitle>
                <CardDescription>Letra completa con estructura musical</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Intro</h4>
                    <p className="text-gray-600 italic">{generatedSong.structure.intro}</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-700 mb-2">Verso 1</h4>
                    <p className="whitespace-pre-line">{generatedSong.structure.verse1}</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-700 mb-2">Coro</h4>
                    <p className="whitespace-pre-line font-medium">{generatedSong.structure.chorus}</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-700 mb-2">Verso 2</h4>
                    <p className="whitespace-pre-line">{generatedSong.structure.verse2}</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-700 mb-2">Coro (Repetir)</h4>
                    <p className="whitespace-pre-line font-medium">{generatedSong.structure.chorus2}</p>
                  </div>

                  {generatedSong.structure.bridge && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-700 mb-2">Bridge</h4>
                      <p className="text-yellow-600 italic">{generatedSong.structure.bridge}</p>
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Outro</h4>
                    <p className="text-gray-600 italic">{generatedSong.structure.outro}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Musical Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Piano className="h-5 w-5" />
                    Información Musical
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Tonalidad:</span>
                    <span>{generatedSong.musicalNotes.key}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Tempo:</span>
                    <span>{generatedSong.musicalNotes.tempo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Compás:</span>
                    <span>{generatedSong.musicalNotes.timeSignature}</span>
                  </div>
                  <div>
                    <span className="font-medium">Acordes sugeridos:</span>
                    <div className="flex gap-2 mt-2">
                      {generatedSong.musicalNotes.chords.map((chord: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {chord}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Vocabulario Clave
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {generatedSong.vocabulary.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{item.word}</span>
                          <span className="text-gray-600 ml-2">({item.translation})</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Teaching Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Consejos para Enseñar
                </CardTitle>
                <CardDescription>Sugerencias para usar esta canción en clase</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedSong.teachingTips.map((tip: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
