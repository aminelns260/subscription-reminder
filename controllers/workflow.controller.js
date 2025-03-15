import dayjs from 'dayjs'
import { createRequire } from 'module';
const require = createRequire(import.meta.url); // Permet d'utiliser require dans un module ES
const { serve } = require("@upstash/workflow/express"); // Importation de la fonction serve pour gérer un workflow Upstash
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-emails.js'

// Délais avant l'expiration d'un abonnement où un rappel sera envoyé
const REMINDERS = [7, 5, 2, 1]

// Fonction principale qui exécute le workflow pour envoyer des rappels
export const sendReminders = serve(async (context) => {
  // Récupération de l'ID de l'abonnement depuis la requête
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if(!subscription || subscription.status !== 'active') return;

  const renewalDate = dayjs(subscription.renewalDate);

  // Si la date de renouvellement est déjà passée, on arrête le workflow
  if(renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');

    // Si la date du rappel est encore dans le futur, on programme une attente jusqu'à cette date
    if(reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
    }

    // Si la date du rappel correspond à aujourd'hui, on déclenche l'envoi du rappel
    if (dayjs().isSame(reminderDate, 'day')) {
      await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
    }
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  })
}

// Fonction qui suspend l'exécution jusqu'à la date du rappel
const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
}

// Fonction qui envoie un e-mail de rappel
const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);

    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    })
  })
}