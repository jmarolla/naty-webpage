import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY no está configurada")
      return NextResponse.json({ error: "Configuración del servidor incompleta" }, { status: 500 })
    }

    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    console.log("Enviando email con Resend...")

    // TEMPORALMENTE: Enviar a tu email en lugar de al de Miss Naty
    const { data, error } = await resend.emails.send({
      from: "Sitio Web <onboarding@resend.dev>",
      to: ["jmarolla@gs1.org.ar"], // Tu email temporalmente
      subject: `Nuevo mensaje de ${name} - Sitio Web Miss Naty`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">
            Nuevo mensaje desde el sitio web de Miss Naty
          </h2>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #065f46; margin-top: 0;">Información del contacto:</h3>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #d1d5db; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Mensaje:</h3>
            <p style="line-height: 1.6; color: #4b5563;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              <strong>IMPORTANTE:</strong> Este mensaje debe ser reenviado a Miss Naty (bonettanatalia@hotmail.com)
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Error de Resend:", error)
      return NextResponse.json(
        {
          error: "Error al enviar el mensaje",
          details: error.message,
        },
        { status: 500 },
      )
    }

    console.log("Email enviado exitosamente")

    // Email de confirmación al usuario (solo si su email es válido)
    try {
      await resend.emails.send({
        from: "Miss Naty <onboarding@resend.dev>",
        to: ["jmarolla@gs1.org.ar"], // También a tu email por ahora
        subject: `Confirmación: Mensaje de ${name} recibido`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">Confirmación de mensaje recibido</h2>
            
            <p>Se recibió un mensaje de <strong>${name}</strong> (${email})</p>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #065f46; margin-top: 0;">Mensaje:</h3>
              <p style="font-style: italic; color: #4b5563;">"${message}"</p>
            </div>
            
            <p><strong>Acción requerida:</strong> Reenviar este mensaje a Miss Naty (bonettanatalia@hotmail.com)</p>
          </div>
        `,
      })
    } catch (confirmationError) {
      console.error("Error enviando confirmación:", confirmationError)
    }

    return NextResponse.json({ message: "Mensaje enviado correctamente" }, { status: 200 })
  } catch (error) {
    console.error("Error general en API:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
