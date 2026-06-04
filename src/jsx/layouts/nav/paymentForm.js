import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js"; // Stripe loader
import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

// Load Stripe public key
const stripePromise = loadStripe("pk_live_51Q9pepP9YE5TMcZPcE3MSMauCQCy2CjCgRVEtKazyCDmC5FDxYIicB2iZk8lpi0NRff1SoVOgbjHgrjzA1xWGT3e00KOiECVOW");

const PaymentForm = () => {
  const stripe = useStripe(); // Initialize Stripe
  const elements = useElements(); // Initialize Stripe elements
  const [clientSecret, setClientSecret] = useState(""); // Store clientSecret
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch clientSecret from backend when the component mounts
  useEffect(() => {
    // Fetch clientSecret from your backend
    fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 5000 }), // Example payload
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret); // Store clientSecret for initializing Elements
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Disable form during payment processing

    if (!stripe || !elements) {
      return; // Stripe.js hasn't loaded yet
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL after payment completion (can be your success page)
        return_url: "https://yourdomain.com/order-confirmation",
      },
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else {
      setMessage("Payment succeeded!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Complete Payment</h3>
      {/* Display the PaymentElement only if clientSecret is available */}
      {clientSecret && <PaymentElement />}
      <button type="submit" disabled={!stripe || isLoading}>
        {isLoading ? "Processing..." : "Pay"}
      </button>
      <p>{message}</p>
    </form>
  );
};

// Initialize Stripe Elements with clientSecret and wrap your component
const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    // Call backend to get clientSecret for a payment or setup intent
    fetch("/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: 5000 }), // Example payload
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm />
        </Elements>
      )}
    </>
  );
};

export default PaymentPage;
