import { validateMercadoPagoWebhook } from "@/lib/mercadopago";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        validateMercadoPagoWebhook(req);
        const body = await req.json();
        const { type, data } = body;

        // Webhook aqui
        
        return NextResponse.json( { received: true }, { status: 200 });

    } catch(error) {
        console.error(error);
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        );
    }
}
