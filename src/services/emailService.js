import { sendEmail } from "../config/mailer.config.js";

class EmailService {
  async sendPasswordResetEmail(email, token) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const html = `
            <h1>Restablecer Contraseña</h1>
            <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
            <a href="${resetLink}" style="
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            ">Restablecer Contraseña</a>
            <p>Este enlace expirará en 1 hora.</p>
            <p>Si no solicitaste este cambio, ignora este correo.</p>
        `;

    return await sendEmail(email, "Restablecer Contraseña", html);
  }

  async sendPurchaseConfirmation(email, ticket) {
    const html = `
            <h1>¡Compra Confirmada!</h1>
            <p>Gracias por tu compra. Aquí están los detalles:</p>
            <ul>
                <li><strong>Código de Ticket:</strong> ${ticket.code}</li>
                <li><strong>Fecha:</strong> ${new Date(
                  ticket.purchase_datetime
                ).toLocaleString()}</li>
                <li><strong>Total:</strong> $${ticket.amount}</li>
            </ul>
            <p>Puedes ver el detalle completo en tu cuenta.</p>
        `;

    return await sendEmail(email, "Confirmación de Compra", html);
  }

  async sendRoleChangeEmail(email, newRole) {
    const html = `
            <h1>Cambio de Rol</h1>
            <p>Tu rol ha sido actualizado a: <strong>${newRole}</strong></p>
            <p>Ahora tienes acceso a nuevas funcionalidades en la plataforma.</p>
        `;

    return await sendEmail(email, "Cambio de Rol en la Plataforma", html);
  }
}

export default new EmailService();
