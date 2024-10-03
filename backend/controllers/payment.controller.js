import crypto from "crypto";
import Razorpay from "razorpay";
import { Payment } from "../models/payment.modal.js";
import { Order } from "../models/order.modal.js";
import { User } from "../models/user.model.js";
import { sendOrderSuccessEmail } from "../email/emails.js";

const razorpayInstance = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

export const orderAPI = async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
};

export const veifyOrder = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    itemsInCart,
    deleveryAddress,
    clearCart,
  } = req.body;

  try {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.key_secret)
      .update(sign.toString())
      .digest("hex");

    const isAuthentic = expectedSign === razorpay_signature;

    if (isAuthentic) {
      const payment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      const savedPayment = await payment.save();

      const order = new Order({
        paymentId: savedPayment._id,
        userId: req.user.id,
        items: itemsInCart.map((item) => ({
          productId: item.productId,
          name: item.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price,
        })),
        address: deleveryAddress,
      });

      await order.save();

      const user = await User.findById(req.user.id);
      if (clearCart) {
        user.cartItems = [];
        await user.save();
      }

      await sendOrderSuccessEmail(user.email);

      res.status(201).json({
        message: "Order placed Successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
