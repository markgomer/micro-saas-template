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
    return {
    }
}
