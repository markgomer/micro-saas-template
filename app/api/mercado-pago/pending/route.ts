import { Payment } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";

import mpClient from "@/lib/mercadopago";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("payment_id");
    const testId = searchParams.get("external_reference")

    if(!paymentId || !testId) {
        return NextResponse.json(
            { error: "Payment ID or test Id not found"},
            { status: 404 }
        );
    }
    const payment = new Payment(mpClient);
    const paymentData = await payment.get({
        id: paymentId
    });
    if(
        paymentData.status === "approved" ||
        paymentData.date_approved !== null
    ) {
        return NextResponse.redirect(new URL(`/success`, req.url));
    }
    return NextResponse.redirect(new URL(`/`, req.url));
}
