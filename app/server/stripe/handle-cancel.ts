import { db } from "@/lib/firebase";
import "server-only";

import Stripe from "stripe";

export async function handleStripeCancelSubscription(
    event: Stripe.CustomerSubscriptionDeletedEvent
) {
    console.log("Pagamento realizado com sucesso. Enviar um email liberar acesso");
    const customerId = event.data.object.customer;
    // buscar id do banco de dados da firebase
    const userRef = await db
        .collection("users")
        .where("stripeCustomerId", "==", customerId)
        .get();

    if(userRef.empty) {
        console.error("User not found");
        return;
    }
    const userId = userRef.docs[0].id;

    await db.collection("users").doc(userId).update({
        subscriptionStatus: "inactive"
    });
}
