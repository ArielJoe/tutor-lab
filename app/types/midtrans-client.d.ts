declare module "midtrans-client" {
  export class Snap {
    createTransactionToken(parameter: {
      item_details: { price: any };
      transaction_details: { order_id: any; gross_amount: any };
    }) {
      throw new Error("Method not implemented.");
    }
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey?: string;
    });
    createTransaction(
      transaction: any
    ): Promise<{ token: string; redirect_url: string }>;
  }

  export class CoreApi {
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey?: string;
    });
    charge(transaction: any): Promise<any>;
  }
}
