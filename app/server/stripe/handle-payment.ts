import { db } from "@/lib/firebase";
import "server-only";

import Stripe from "stripe";

export async function handleStripePayment(
    event: Stripe.CheckoutSessionCompletedEvent
) {
    if (event.data.object.payment_status === "paid") {
        console.log("Pagamento realizado com sucesso. Enviar um email liberar acesso");
        const metadata = event.data.object.metadata;
        const userId = metadata?.userId;
        if(!userId) {
            console.error("User ID not found");
            return;
        }
        await db.collection("users").doc(userId).update({
            stripeCustomerId: event.data.object.customer,
            stripeSubscriptionId: event.data.object.subscription,
            subscriptionStatus: "active"
        });
    }
}
