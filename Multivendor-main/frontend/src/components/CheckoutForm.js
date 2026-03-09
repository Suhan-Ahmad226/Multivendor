import React, { useState } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const CheckoutForm = ({ orderId }) => {
  localStorage.setItem("orderId", orderId);

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const paymentElementOptions = {
    layout: "tabs", // ✅ বানান ঠিক করা হয়েছে
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://multivendor-puce.vercel.app/order/confirm",
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      id="payment-form"
      className="w-full max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg space-y-5"
    >
      {/* Stripe Authentication */}
      <LinkAuthenticationElement id="link-authentication-element" />

      {/* Payment Options */}
      <PaymentElement
        id="payment-element"
        options={paymentElementOptions}
        className="mt-4"
      />

      {/* Submit Button */}
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full flex justify-center items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Pay Now"
        )}
      </button>

      {/* Error Message */}
      {message && (
        <div className="text-red-600 text-sm font-medium text-center mt-3">
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
