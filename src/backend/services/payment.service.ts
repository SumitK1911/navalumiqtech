import axios from "axios";

// Esewa Integration
export class EsewaPaymentService {
  private merchantCode: string;
  private apiKey: string;
  private baseUrl = "https://epay.esewa.com.np";

  constructor(merchantCode: string, apiKey: string) {
    this.merchantCode = merchantCode;
    this.apiKey = apiKey;
  }

  /**
   * Generate payment URL for user to redirect to Esewa
   */
  generatePaymentUrl(
    transactionUuid: string,
    amount: number,
    productName: string,
    productCode: string,
    successUrl: string,
    failureUrl: string
  ): string {
    const params = new URLSearchParams({
      amt: amount.toString(),
      psc: productCode,
      pid: transactionUuid,
      su: successUrl,
      fu: failureUrl,
    });

    return `${this.baseUrl}/epay/main?${params.toString()}`;
  }

  /**
   * Verify payment from Esewa response
   */
  async verifyPayment(transactionUuid: string, amount: number): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/epay/transaction/status/`, {
        params: {
          pidx: transactionUuid,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      const isSuccess = response.data?.status === "COMPLETE";
      const isAmountCorrect = response.data?.total_amount === amount;

      return isSuccess && isAmountCorrect;
    } catch (error) {
      console.error("Esewa verification error:", error);
      return false;
    }
  }
}

// Khalti Integration
export class KhaltiPaymentService {
  private publicKey: string;
  private secretKey: string;
  private baseUrl = "https://khalti.com/api/v2";

  constructor(publicKey: string, secretKey: string) {
    this.publicKey = publicKey;
    this.secretKey = secretKey;
  }

  /**
   * Initiate payment session with Khalti
   */
  async initiatePayment(
    amount: number,
    productName: string,
    transactionId: string,
    returnUrl: string,
    webhookUrl?: string
  ): Promise<{ pidx: string; paymentUrl: string }> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/epay/initiate/`,
        {
          return_url: returnUrl,
          website_url: process.env.NEXT_PUBLIC_APP_URL,
          amount: amount * 100, // Khalti expects amount in paisa (smallest unit)
          purchase_order_id: transactionId,
          purchase_order_name: productName,
          customer_email: "",
          customer_phone: "",
        },
        {
          headers: {
            Authorization: `Key ${this.secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        pidx: response.data.pidx,
        paymentUrl: response.data.payment_url,
      };
    } catch (error) {
      console.error("Khalti initiation error:", error);
      throw new Error("Failed to initiate Khalti payment");
    }
  }

  /**
   * Verify payment completion with Khalti
   */
  async verifyPayment(pidx: string): Promise<{ verified: boolean; amount: number }> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/epay/lookup/`,
        { pidx },
        {
          headers: {
            Authorization: `Key ${this.secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const isVerified = response.data.status === "Completed";
      const amount = response.data.total_amount / 100; // Convert from paisa to main unit

      return {
        verified: isVerified,
        amount,
      };
    } catch (error) {
      console.error("Khalti verification error:", error);
      return { verified: false, amount: 0 };
    }
  }
}
