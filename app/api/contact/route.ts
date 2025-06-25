import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Validar datos
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Enviar email a Miss Naty
    const { data, error } = await resend.emails.send({
      from: "Sitio Web <onboarding@resend.dev>", // Cambiar por tu dominio
      to: ["bonettanatalia@hotmail.com"],
      subject: `Nuevo mensaje de ${name} - Sitio Web Miss Naty`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">
            Nuevo mensaje desde tu sitio web
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
              Este mensaje fue enviado desde el formulario de contacto de tu sitio web Miss Naty.
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Error enviando email:", error)
      return NextResponse.json({ error: "Error al enviar el mensaje" }, { status: 500 })
    }

    // Email de confirmación al usuario
    await resend.emails.send({
      from: "Miss Naty <onboarding@resend.dev>", // Cambiar por tu dominio
      to: [email],
      subject: "Gracias por contactarme - Miss Naty",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">
            ¡Gracias por contactarme!
          </h2>
          
          <p>Hola ${name},</p>
          
          <p>He recibido tu mensaje y te responderé en menos de 24 horas.</p>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #065f46; margin-top: 0;">Tu mensaje:</h3>
            <p style="font-style: italic; color: #4b5563;">"${message}"</p>
          </div>
          
          <p>Mientras tanto, puedes:</p>
          <ul>
            <li>Explorar mis <a href="#productos" style="color: #059669;">proyectos educativos</a></li>
            <li>Conocer más sobre mis <a href="#servicios" style="color: #059669;">capacitaciones en IA</a></li>
            <li>Seguirme en redes sociales para tips educativos</li>
          </ul>
          
          <p>¡Saludos!</p>
          <p><strong>Miss Naty</strong><br>
          Especialista en Inglés e IA Educativa</p>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              📧 bonettanatalia@hotmail.com<br>
              📱 +549 11 3407 4531<br>
              📍 Buenos Aires, Argentina
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ message: "Mensaje enviado correctamente" }, { status: 200 })
  } catch (error) {
    console.error("Error en API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
