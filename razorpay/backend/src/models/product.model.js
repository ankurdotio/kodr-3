import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            required: true,
            enum: [ "INR", "USD", "EUR" ], // Add more currencies as needed
            default: "INR"
        }
    }
})

const Product = mongoose.model("Product", productSchema);

export default Product;