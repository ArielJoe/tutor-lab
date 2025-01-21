import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";

const snap = new Midtrans.Snap({
  isProduction: false, // Use sandbox environment
  serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
});

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { id, productName, price, quantity } = await request.json();

    // Construct the parameter object for Midtrans
    const parameter = {
      item_details: {
        name: productName,
        price: price,
        quantity: quantity,
      },
      transaction_details: {
        order_id: `order-${id}-${Date.now()}`, // Unique order ID
        gross_amount: price * quantity, // Total amount
      },
    };

    // Generate the transaction token
    const token = snap.createTransactionToken(parameter);
    console.log("Transaction Token:", token);

    // Return the token in the response
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error creating transaction token:", error);
    return NextResponse.json(
      { error: "Failed to create transaction token" },
      { status: 500 }
    );
  }
}
