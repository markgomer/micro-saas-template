import { NextRequest, NextResponse } from "next/server";

import stripe from "@/lib/stripe";

export async function POST(req: NextRequest) {
    // não passa preço de produto ou qualquer informação sensível
    // sob hipótese alguma
    const { testID, userEmail } = await req.json() // pega o body da requisição

    const price = process.env.STRIPE_PRODUCT_PRICE_ID;
    if(!price) {
        return NextResponse.json({ error: "Price not found" }, { status: 500 });
    }

    // metadata para passar info do chekcout até o webhook
    const metadata = { testID };

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [{ price, quantity: 1 }],
            mode: "payment",
            payment_method_types: ["card", "boleto"],
            success_url: `${req.headers.get("origin")}/success`,
            cancel_url: `${req.headers.get("origin")}/`,
            ...(userEmail && { customer_email: userEmail }),
            metadata
        })
        if(!session.url) {
            return NextResponse.json(
                { error: "Session URL not found" },
                { status: 500 }
            );
        }

        return NextResponse.json({ sessionId: session.id }, { status: 200 });
    } catch(error) {
        console.error(error);
        return NextResponse.error();
    }

}
