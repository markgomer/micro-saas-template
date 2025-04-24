import "server-only";

import Stripe from "stripe";

import { db } from "@/lib/firebase";
import resend from "@/lib/resend";


export async function handleStripePayment(
    event: Stripe.CheckoutSessionCompletedEvent
) {
    if (event.data.object.payment_status === "paid") {
        const metadata = event.data.object.metadata;
        const userEmail = metadata?.userEmail;
        const userId = metadata?.testId;
        if(!userId || !userEmail) {
            console.error("User ID or email not found");
            return;
        }
        await db.collection("users").doc(userId).update({
            stripeCustomerId: event.data.object.customer,
            stripeSubscriptionId: event.data.object.subscription,
            subscriptionStatus: "active"
        });
        // send email through resend
        const { data, error } = await resend.emails.send({
            from: 'Marco Souza <aureliojuniorcmrj@hotmail.com>',
            to: [userEmail],
            subject: 'Hello world',
            text: "Pagamento realizado com sucesso!",
        });
        if (error) {
            console.error("User ID not found");
            return;
        }
        console.log("[DEBUG] EMAIL ENVIADO COM SUCESSO", data);
    };
}
