// src/lib/actions/checkout.actions.ts
'use server'
import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export async function createRazorpayOrder(cartItems: CartItem[], shippingDetails: any) {
  const supabase = createClient();
  
  // 1. Validate prices and stock securely from the database
  let totalAmount = 0;
  for (const item of cartItems) {
    const { data: variant } = await supabase
      .from('product_variants')
      .select('price_adjustment, stock_quantity, products(base_price)')
      .eq('id', item.variantId)
      .single();
      
    if (!variant || variant.stock_quantity < item.quantity) {
      throw new Error(`Item ${item.name} is out of stock.`);
    }
    totalAmount += (variant.products.base_price + variant.price_adjustment) * item.quantity;
  }

  // Add shipping logic here (e.g., + ₹100 if total < ₹999)
  const finalAmount = totalAmount < 999 ? totalAmount + 100 : totalAmount;

  // 2. Create Razorpay Order
  const rpOrder = await razorpay.orders.create({
    amount: finalAmount * 100, // Amount in paise
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
  });

  // 3. Create Pending Order in Database
  const { data: order } = await supabase.from('orders').insert({
    order_number: rpOrder.receipt,
    total_amount: finalAmount,
    razorpay_order_id: rpOrder.id,
    shipping_address: shippingDetails,
    customer_email: shippingDetails.email,
    customer_phone: shippingDetails.phone,
    status: 'pending',
    payment_status: 'pending'
  }).select().single();

  return { orderId: rpOrder.id, amount: rpOrder.amount, dbOrderId: order.id };
      }// src/lib/actions/checkout.actions.ts
import crypto from 'crypto';

export async function verifyPayment(
  razorpay_order_id: string, 
  razorpay_payment_id: string, 
  razorpay_signature: string,
  dbOrderId: string
) {
  const supabase = createClient();
  
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET!)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    // Payment is authentic. 
    // 1. Update Order Status
    await supabase.from('orders').update({ 
      payment_status: 'paid', 
      status: 'processing',
      razorpay_payment_id 
    }).eq('id', dbOrderId);

    // 2. Decrease Inventory (Using a Postgres RPC function for concurrency safety)
    await supabase.rpc('decrement_inventory_for_order', { order_id: dbOrderId });

    // 3. Trigger Resend Email Confirmation here
    
    return { success: true };
  } else {
    throw new Error("Invalid payment signature");
  }
}
