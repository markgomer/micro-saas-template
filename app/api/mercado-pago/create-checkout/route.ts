import mpClient from "@/lib/mercadopago";
import { Preference } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { testId, userEmail } = await req.json();

    try {
        const preference = new Preference(mpClient);
        const createdPreference = await preference.create({
            body: {
                // isso impacta na pontuação do mercado pago
                external_reference: testId,
                metadata: {
                    // essa variavel é convertida para snake_case -> teste_id
                    testId,
                },
                // também é importante para a pontuação do MP
                ...(userEmail && { payer: { email: userEmail } }),
                items: [
                    {
                        id: "",
                        description: "",
                        title: "",
                        quantity: 1,
                        unit_price: 1,
                        currency_id: "BRL",
                        category_id: "services",
                    }
                ],
                payment_methods: {
                    installments: 12,
                    // excluded_payment_methods: [
                    //     { id: "bolbradesco", }, { id: "pec", }
                    // ],
                    // excluded_payment_types: [
                    //     { id: "debit_card", }, { id: "credit_card", }
                    // ]
                },
                auto_return: "approved",
                back_urls: {
                    success: `${req.headers.get("origin")}/api/mercado-pago/success`,
                    failure: `${req.headers.get("origin")}/api/mercado-pago/failure`,
                    pending: `${req.headers.get("origin")}/api/mercado-pago/pending`,
                }
            }
        });
        if(!createdPreference.id) {
            return NextResponse.json(
                { error: "Erro ao criar checkout com Mercado Pago"},
                { status: 500 }
            );
        }
        return NextResponse.json({
            preferenceId: createdPreference.id,
            initPoint: createdPreference.init_point,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Erro ao criar checkout com Mercado Pago"},
            { status: 500 }
        );
    }
}
