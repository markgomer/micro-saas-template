import stripe from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { getOrCreateCustomer } from "@/server/stripe/get-customer-id";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    // não passa preço de produto ou qualquer informação sensível
    // sob hipótese alguma
    const { testID, userEmail } = await req.json() // pega o body da requisição

    const price = process.env.STRIPE_PRODUCT_PRICE_ID;
    if(!price) {
        return NextResponse.json({ error: "Price not found" }, { status: 500 });
    }


    /**
     * stripeCustomerId:
     * precisamos fazer um cliente NA STRIPE pra ter referecência dele quando
     * for criar o portal
    **/
    const session = await auth();
    const userId = session?.user?.id;
    const usrMail = session?.user?.email;

    if(!userId || !usrMail) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerId = await getOrCreateCustomer(userId, usrMail);

    // metadata para passar info do chekcout até o webhook
    const metadata = { testID };

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [{ price, quantity: 1 }],
            mode: "subscription",
            payment_method_types: ["card"],
            success_url: `${req.headers.get("origin")}/success`,
            cancel_url: `${req.headers.get("origin")}/`,
            ...(userEmail && { customer_email: userEmail }),
            metadata,
            customer: customerId
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
