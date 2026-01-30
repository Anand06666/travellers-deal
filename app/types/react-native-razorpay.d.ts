declare module 'react-native-razorpay' {
    export interface RazorpayOptions {
        description: string;
        image: string;
        currency: string;
        key: string;
        amount: number;
        name: string;
        order_id: string;
        prefill: {
            email: string;
            contact: string;
            name: string;
        };
        theme: { color: string };
    }

    export interface RazorpaySuccessResponse {
        razorpay_checkout_order_id?: string;
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_multilin_order_id?: string;
        razorpay_signature: string;
    }

    export interface RazorpayFailureResponse {
        code: number;
        description: string;
        source: string;
        step: string;
        reason: string;
        metadata: {
            order_id: string;
            payment_id?: string;
        };
    }

    const RazorpayCheckout: {
        open(options: RazorpayOptions): Promise<RazorpaySuccessResponse>;
        onExternalWalletSelection(callback: (data: any) => void): void;
    };

    export default RazorpayCheckout;
}
