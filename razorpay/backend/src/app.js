import express from "express";
import productModel from "./models/product.model.js";
import paymentModel from "./models/payment.model.js";
import Razorpay from "razorpay";
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils.js'


const app = express();
app.use(express.json());
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/api/payments/order", async (req, res) => {

    const { products } = req.body;

    /**
     * products = [{ id: "product_id", quantity: 2 }, ...]
     */
    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: "Products array is required and cannot be empty." });
    }

    const productsDetails = await productModel.find({
        _id: {
            $in: products
                .filter((p) => !!p.id && typeof p.quantity === "number" && p.quantity > 0)
                .map((p) => p.id)
        }
    });

    if (productsDetails.length === 0) {
        return res.status(400).json({ error: "No valid products found for the provided IDs." });
    }

    const totalAmount = productsDetails.reduce((total, product) => {
        const quantity = products.find((p) => p.id === product._id.toString())?.quantity || 0;
        return total + (product.price.amount * quantity);
    }, 0);

    const orderOptions = {
        amount: totalAmount * 100, // Convert to smallest currency unit (e.g., paise for INR)
        currency: "INR", // Assuming all products have the same currency
    };

    const order = await razorpay.orders.create(orderOptions);

    const paymentRecord = await paymentModel.create({
        razorpayOrderId: order.id,
        price: {
            amount: totalAmount,
            currency: "INR"
        },
        products: products.map((p) => ({
            product: p.id,
            quantity: p.quantity
        })),
        status: "pending"
    })

    res.status(201).json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
    });
})


app.post("/api/payments/verify", async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const isPaymentValid = validatePaymentVerification(
        {
            order_id: razorpayOrderId,
            payment_id: razorpayPaymentId,
        },
        razorpaySignature,
        process.env.RAZORPAY_KEY_SECRET
    );

    if (!isPaymentValid) {
        await paymentModel.findOneAndUpdate(
            { razorpayOrderId },
            { status: "failed" }
        );
        return res.status(400).json({ error: "Payment verification failed." });
    }

    await paymentModel.findOneAndUpdate(
        { razorpayOrderId },
        {
            status: "completed",
            razorpayPaymentId,
            razorpaySignature
        }
    );

    /**
     * Here, you can also implement additional logic such as:
     * - Updating inventory based on the products purchased
     * - Sending a confirmation email to the user
     * - Generating an invoice or receipt
     */

    res.json({ message: "Payment verified successfully." });
})


export default app;