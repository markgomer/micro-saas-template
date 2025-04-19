import { db } from "@/lib/firebase";
import resend from "@/lib/resend";
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
    const userEmail = userRef.docs[0].data().email;

    await db.collection("users").doc(userId).update({
        subscriptionStatus: "inactive"
    });
    // send email through resend
    const { data, error } = await resend.emails.send({
        from: 'Acme <aureliojuniorcmrj@hotmail.com>',
        to: [userEmail],
        subject: 'Assinatura cancelada com sucesso',
        text: "Assinatura cancelada com sucesso",
    });
    if (error) {
        console.error("User ID not found");
        return;
    }
    console.log(data);
}
