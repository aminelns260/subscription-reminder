import { emailTemplates } from './email-template.js'
import dayjs from 'dayjs'
import transporter, { accountEmail } from '../config/nodemailer.js'

export const sendReminderEmail = async ({ to, type, subscription }) => {
    if (!to || !type) throw new Error('Missing required parameters');

    // Recherche du modèle d'email correspondant au type donné
    const template = emailTemplates.find((t) => t.label === type);

    if (!template) throw new Error('Invalid email type');

    // Préparation des informations dynamiques de l'email
    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod,
    }

    // Génération du contenu de l'email
    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

    // Configuration des options d'envoi de l'email
    const mailOptions = {
        from: accountEmail,
        to: to,
        subject: subject,
        html: message,
    }

    // Envoi de l'email via le transporteur Nodemailer
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.log(error, 'Error sending email');

        console.log('Email sent: ' + info.response);
    })
}