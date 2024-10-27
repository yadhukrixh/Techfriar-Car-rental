import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      // Payment is verified; update the order status in your database
      res.status(200).json({ success: true, message: 'Payment verified' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
