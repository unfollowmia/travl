/**
 * travl — Payment Service
 *
 * Clean interface for payment processing so real Apple Pay / Stripe
 * can be swapped in later with zero changes to the UI layer.
 */

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface PaymentService {
  requestPayment(amount: number, currency: string): Promise<PaymentResult>;
}

/**
 * Mock Apple Pay implementation.
 *
 * Simulates a successful payment after a short delay. In production,
 * replace this with real Apple Pay via expo-apple-pay or Stripe SDK.
 */
export class MockApplePayService implements PaymentService {
  async requestPayment(amount: number, currency: string): Promise<PaymentResult> {
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      success: true,
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    };
  }
}

/** Singleton instance — swap for real implementation later */
export const paymentService: PaymentService = new MockApplePayService();
