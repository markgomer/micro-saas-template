import stripe from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POS(req: NextRequest) {
    const body = await req.json();
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
        case "checkout.session.completed": // pg realizado se status = paid
            break;
        case "checkout.session.expired": // expirou tempo de pagamento
            break;
        case "checkout.session.async_payment_succeeded": // boleto pago
            break;
        case "checkout.session.async_payment_failed": // boleto falhou
            break;
        case "customer.subscription.created": // criou assinatura
            break;
        case "customer.subscription.updated": // atualizou assinatura
            break;
        case "customer.subscription.deleted": // cancelou assinatura
            break;
    }

}
