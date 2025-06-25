"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, CheckCircle, AlertCircle } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus("idle")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setFormData({ name: "", email: "", message: "" })
      } else {
        setStatus("error")
        setErrorMessage(data.error || "Error al enviar el mensaje")
      }
    } catch (error) {
      setStatus("error")
      setErrorMessage("Error de conexión. Intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "success") {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-green-800">¡Mensaje enviado!</h3>
          <p className="text-gray-600 mb-4">Gracias por contactarme. Te responderé en menos de 24 horas.</p>
          <p className="text-sm text-gray-500 mb-4">También recibirás un email de confirmación.</p>
          <Button onClick={() => setStatus("idle")} variant="outline" className="mt-2">
            Enviar otro mensaje
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Envíame un mensaje
        </CardTitle>
        <CardDescription>Te responderé en menos de 24 horas</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "error" && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-700 text-sm">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="name"
              placeholder="Tu nombre *"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Input
              name="email"
              type="email"
              placeholder="Tu email *"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Textarea
              name="message"
              placeholder="Tu mensaje *"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              "Enviar Mensaje"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
