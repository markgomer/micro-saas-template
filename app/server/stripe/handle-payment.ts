import { db } from "@/lib/firebase";
import resend from "@/lib/resend";
import "server-only";

import Stripe from "stripe";

export async function handleStripePayment(
    event: Stripe.CheckoutSessionCompletedEvent
) {
    if (event.data.object.payment_status === "paid") {
        const metadata = event.data.object.metadata;
        const userEmail = event.data.object.customer_email ||
            event.data.object.customer_details?.email;
        const userId = metadata?.userId;
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
            from: 'Acme <aureliojuniorcmrj@hotmail.com>',
            to: [userEmail],
            subject: 'Hello world',
            text: "Pagamento realizado com sucesso!",
        });
        if (error) {
            console.error("User ID not found");
            return;
        }
        console.log(data);
    };
}
