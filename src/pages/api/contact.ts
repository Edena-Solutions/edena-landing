import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json();
    const { name, email, center, message, lang } = body;

    if (!name || !email || !message) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const subject =
        lang === "en"
            ? `Contact form - ${name}`
            : `Formulario de contacto - ${name}`;

    const html = `
        <h2>${lang === "en" ? "New contact form submission" : "Nuevo mensaje de contacto"}</h2>
        <p><strong>${lang === "en" ? "Name" : "Nombre"}:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${center ? `<p><strong>${lang === "en" ? "School" : "Centro"}:</strong> ${center}</p>` : ""}
        <p><strong>${lang === "en" ? "Message" : "Mensaje"}:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
    `;

    const resendApiKey = import.meta.env.RESEND_API_KEY;

    if (!resendApiKey) {
        return new Response(JSON.stringify({ error: "Email service not configured" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: "Edena Contact <noreply@edena.es>",
            to: ["hola@edena.es"],
            reply_to: email,
            subject,
            html,
        }),
    });

    if (!response.ok) {
        return new Response(JSON.stringify({ error: "Failed to send email" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
};
