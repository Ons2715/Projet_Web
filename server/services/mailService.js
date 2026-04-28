import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter;

function getTransporter() {
  if (!env.smtpHost) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: env.smtpUser
        ? {
            user: env.smtpUser,
            pass: env.smtpPass
          }
        : undefined
    });
  }

  return transporter;
}

function getMailFrom() {
  const from = String(env.smtpFrom || "").trim();
  const user = String(env.smtpUser || "").trim();

  if (!from || from.includes("no-reply@EduCar.local")) {
    return user ? `EduCar <${user}>` : "EduCar <no-reply@educar.local>";
  }

  return from;
}

export async function sendWelcomeEmail(user) {
  const mailer = getTransporter();

  if (!mailer) {
    console.warn("SMTP non configure: email de bienvenue ignore.");
    return;
  }

  const firstName = user.firstName || String(user.nom || "").split(" ")[0] || "EduCar";

  await mailer.sendMail({
    from: getMailFrom(),
    to: user.email,
    subject: "Bienvenue sur EduCar",
    text: `Bonjour ${firstName},

Bienvenue sur EduCar. Votre inscription est terminee et votre espace est pret.

A tres bientot,
L'equipe EduCar`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #0b1c30; line-height: 1.6;">
        <h2 style="margin: 0 0 12px;">Bienvenue sur EduCar</h2>
        <p>Bonjour ${firstName},</p>
        <p>Votre inscription est terminee et votre espace est pret.</p>
        <p style="margin-top: 24px;">A tres bientot,<br />L'equipe EduCar</p>
      </div>
    `
  });
}

export async function sendReclamationProcessingEmail({ email, nom, reservationRef }) {
  const mailer = getTransporter();

  if (!mailer) {
    console.warn("SMTP non configure: email de traitement reclamation ignore.");
    return;
  }

  const displayName = String(nom || "").trim() || "candidat EduCar";
  const reservationText = reservationRef ? ` concernant votre réservation ${reservationRef}` : "";

  await mailer.sendMail({
    from: getMailFrom(),
    to: email,
    subject: "Votre réclamation est en cours de traitement",
    text: `Bonjour ${displayName},

Nous avons bien reçu votre réclamation${reservationText} et nous vous en remercions.

Notre équipe prend en charge votre demande et met tout en œuvre pour y apporter une solution dans les meilleurs délais. Nous reviendrons vers vous très prochainement.

Nous vous remercions pour votre patience et restons à votre disposition pour toute question.

Cordialement,
L'équipe EduCar`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #0b1c30; line-height: 1.6;">
        <h2 style="margin: 0 0 12px;">Réclamation en cours de traitement</h2>
        <p>Bonjour ${displayName},</p>
        <p>Nous avons bien reçu votre réclamation${reservationText} et nous vous en remercions.</p>
        <p>Notre équipe prend en charge votre demande et met tout en œuvre pour y apporter une solution dans les meilleurs délais. Nous reviendrons vers vous très prochainement.</p>
        <p>Nous vous remercions pour votre patience et restons à votre disposition pour toute question.</p>
        <p style="margin-top: 24px;">Cordialement,<br />L'équipe EduCar</p>
      </div>
    `
  });
}

export async function sendBookingCancellationEmail({ email, nom, date, time, monitorName }) {
  const mailer = getTransporter();

  if (!mailer) {
    console.warn("SMTP non configure: email d'annulation de seance ignore.");
    return;
  }

  const firstName = String(nom || "").split(" ")[0] || "EduCar";
  const monitorText = monitorName ? ` par ${monitorName}` : "";
  const dateText = [date, time].filter(Boolean).join(" a ");

  await mailer.sendMail({
    from: getMailFrom(),
    to: email,
    subject: "Votre seance EduCar a été annulée",
    text: `Bonjour ${firstName},

Votre seance EduCar${dateText ? ` du ${dateText}` : ""} a ete annulee${monitorText}.

Vous pouvez réserver un nouveau creneau depuis votre espace EduCar.

Cordialement,
L'equipe EduCar`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #0b1c30; line-height: 1.6;">
        <h2 style="margin: 0 0 12px;">Seance annulee</h2>
        <p>Bonjour ${firstName},</p>
        <p>Votre seance EduCar${dateText ? ` du ${dateText}` : ""} a été annulée${monitorText}.</p>
        <p>Vous pouvez réserver un nouveau creneau depuis votre espace EduCar.</p>
        <p style="margin-top: 24px;">Cordialement,<br />L'équipe EduCar</p>
      </div>
    `
  });
}
