"use client";

import { useStripe } from "@/hooks/useStripe";
import useMercadoPago from "@/hooks/useMercadoPago";

export default function Pagamentos() {
    const {
        createPaymentStripeCheckout,
        createSubscriptionStripeCheckout,
        handleCreateStripePortal,
    } = useStripe();

    const { createMercadoPagoCheckout } = useMercadoPago();

    return (
        <div className="flex flex-col gap-10 items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Pagamentos</h1>

            {/* Criar pagamento stripe */}
            <button
                className= "border rounded-md px-1"
                onClick={() => createPaymentStripeCheckout({testId: "123"})}
            >
                Criar Pagamento Stripe
            </button>

            {/* Criar inscrição pela Stripe */}
            <button
                className= "border rounded-md px-1"
                onClick={() => createSubscriptionStripeCheckout({
                    testId: "123",
                })}
            >
                Criar Assinatura Stripe
            </button>

            {/* Para cancelar assinaturas */}
            <button
                className= "border rounded-md px-1"
                onClick={handleCreateStripePortal}
            >
                Criar Portal de Pagamentos
            </button>

            {/* Pagar via mercado pago */}
            <button
                className= "border rounded-md px-1"
                onClick={() => createMercadoPagoCheckout({
                    testId: "123",
                    userEmail: "teste@teste.com"
                })}
            >
                Criar Pagamento Mercado Pago
            </button>
        </div>
    )
}
