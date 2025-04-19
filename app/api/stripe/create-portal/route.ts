import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"
import { db } from "@/lib/firebase";
import stripe from "@/lib/stripe";

export async function POST(req: NextRequest) {
    const session = await auth();
    const userId = session?.user?.id;
    
    if(!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // pegar usuário lá do banco de dados do firebase. Com base no ID.
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();
        // se usuário não existir, cortamos a rota
        if(!userDoc.exists) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        /**
         * stripeCustomerId:
         * precisamos fazer um cliente na stripe no create-subscription-checkout
         * pra ter referecência dele quando for criar o portal
        **/
        const customerId = userDoc.data()?.stripeCustomerId;
        if(!customerId) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${req.headers.get("origin")}/success`
        });

        return NextResponse.json({ url: portalSession.url }, { status: 200 });
    } catch(error) {
        console.error(error);
        return NextResponse.error();
    }
}
