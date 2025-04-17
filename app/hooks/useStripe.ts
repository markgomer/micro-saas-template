import { useEffect, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js"

export function useStripe() {
    const [stripe, setStripe] = useState<Stripe | null>();

    useEffect(() => {
        async function loadStripeAsync() {
            const stripeInstance = await loadStripe(
                process.env.NEXT_PUBLIC_STRIPE_PUB_KEY!
            )
            setStripe(stripeInstance);
        }
        loadStripeAsync();
    }, []);

    async function createPaymentStripeCheckout(checkoutData: any) {
        if(!stripe) return;

        try {
            const response = await fetch("/api/stripe/create-pay-checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(checkoutData)
            })
            const data = await response.json();
            // recebe URL da requisição e redireciona pro checkout
            await stripe.redirectToCheckout({ sessionId: data.id });
        } catch (error) {
            console.error(error);
        }
    }
    return {
        createPaymentStripeCheckout
    }
}

const { createPaymentStripeCheckout } = useStripe()
