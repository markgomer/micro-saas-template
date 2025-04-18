import { useRouter } from "next/navigation";

export default function useMercadoPago() {
    const router = useRouter();

    async function createMercadoPagoCheckout({
        testId,
        userEmail,
    }: {
        testId: string;
        userEmail: string;
    }) {
        try {
            const response = await fetch(
                "/api/mercado-pago/create-checkout",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        testId,
                        userEmail
                    })
                }
            )
            const data = await response.json()

            router.push(data.initPoint)
        } catch(error) {
            console.error(error);
            throw error;
        }
    }
}
