import resend from "@/lib/resend";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
    const metadata = paymentData.metadata;
    const userEmail = metadata.user_email;
    const testId = metadata.test_id;
    console.log("PAGAMENTO COM SUCESSO", paymentData, userEmail, testId);
    // send email through resend
    const { data, error } = await resend.emails.send({
        from: 'Acme <aureliojuniorcmrj@hotmail.com>',
        to: [userEmail],
        subject: 'Assinatura realizada com sucesso',
        text: "Assinatura realizada com sucesso",
    });
    if (error) {
        console.error("User ID not found");
        return;
    }
    console.log(data);
}
