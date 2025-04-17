import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import stripe from "@/lib/stripe";
import { handleStripePayment } from "@/server/stripe/handle-payment";
import { handleStripeSubscription } from "@/server/stripe/handle-subscription";
import { handleStripeCancelSubscription } from "@/server/stripe/handle-cancel";

const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const headersList = await headers();
        const signature = headersList.get("stripe-signature");
        if(!signature || !secret) {
            return NextResponse.json(
                { error: "No signature or secret" },
                { status: 400 }
            )
        }

        // isso vai ter que fazer manualmente pro mercado pago
        const event = stripe.webhooks.constructEvent(body, signature, secret);
        switch(event.type) {
            // pode ser tanto pg unico quanto assinatura
            case "checkout.session.completed": // pg realizado se status = paid
                const metadata = event.data.object.metadata;
                if(metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
                    await handleStripePayment(event)
                }
                if(metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
                    await handleStripeSubscription(event);
                }
                break;
            case "checkout.session.expired": // expirou tempo de pagamento
                console.log("Enviar um email para o usuário avisando que o pagamento expirou");
                break;
            case "checkout.session.async_payment_succeeded": // boleto pago
                console.log("Enviar um email para o usuário avisando que o pagamento foi realizado");
                break;
            case "checkout.session.async_payment_failed": // boleto falhou
                console.log("Enviar um email para o usuário avisando que o pagamento foi falhou");
                break;
            case "customer.subscription.created": // criou assinatura
                console.log("Mensagem de boas vindas porque acabou de assinar");
                break;
            // raro... pode apagar
            case "customer.subscription.updated": // atualizou assinatura
                console.log("Algo mudou na sua assinatura. Verifique");
                break;
            case "customer.subscription.deleted": // cancelou assinatura
                await handleStripeCancelSubscription(event);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        return NextResponse.json(
            { message: "Webhook received" },
            { status: 200 }
        )
    } catch(error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
