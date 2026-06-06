import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import axios from 'axios'
import './App.css'

function App() {


  const { Razorpay } = useRazorpay();

  async function handlePayment() {
    const response = await axios.post('/api/payments/order', {
      products: [
        {
          id: "6a23c340b0970f5424adf9ce",
          quantity: 1
        }
      ]
    })

    const order = response.data;

    const options = {
      key: "rzp_test_SyFcxS7jGdvGXI",
      amount: order.amount, // Amount in paise
      currency: order.currency,
      name: "Acme Corp",
      description: "Test Transaction",
      order_id: order.orderId, // Generate order_id on server
      handler: async (response) => {
        console.log(response);

        try {
          await axios.post('/api/payments/verify', {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          })
          alert("Payment Successful!");
        } catch (error) {
          console.error("Payment verification failed:", error);
          alert("Payment verification failed. Please try again.");
          return;
        }



      },
      prefill: {
        name: "Rohan Gupta",
        email: "rohan.gupta@gmail.com",
        contact: "7983012345",
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  }


  return (
    <section className="hero">
      <div className="container">

        <button onClick={handlePayment} className="btn">Pay Now</button>

      </div>
    </section>
  )
}

export default App
