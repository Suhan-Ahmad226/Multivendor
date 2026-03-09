import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import errorImg from '../assets/error.png';
import successImg from '../assets/success.png';
import { Link } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import axios from 'axios';

const stripePromise = loadStripe(
  'pk_test_51Oml5cGAwoXiNtjJgPPyQngDj9WTjawya4zCsqTn3LPFhl4VvLZZJIh9fW9wqVweFYC5f0YEb9zjUqRpXbkEKT7T00eU1xQvjp'
);

const ConfirmOrder = () => {
  const [stripe, setStripe] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading', 'succeeded', 'processing', 'failed'
  const [updating, setUpdating] = useState(false);

  // Initialize Stripe
  useEffect(() => {
    stripePromise.then((stripeInstance) => setStripe(stripeInstance));
  }, []);

  // Check Payment Status
  useEffect(() => {
    if (!stripe) return;
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );
    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) {
        setStatus('failed');
        return;
      }
      switch (paymentIntent.status) {
        case 'succeeded':
          setStatus('succeeded');
          break;
        case 'processing':
          setStatus('processing');
          break;
        case 'requires_payment_method':
        default:
          setStatus('failed');
      }
    });
  }, [stripe]);

  // Update payment in backend
  useEffect(() => {
    const updatePayment = async () => {
      const orderId = localStorage.getItem('orderId');
      if (!orderId) return;

      try {
        setUpdating(true);
        await axios.get(`http://localhost:5000/api/order/confirm/${orderId}`);
        localStorage.removeItem('orderId');
      } catch (error) {
        console.error(error.response?.data || error.message);
      } finally {
        setUpdating(false);
      }
    };

    if (status === 'succeeded') {
      updatePayment();
    }
  }, [status]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-6 bg-gray-100 px-4 text-center">
      {status === 'loading' || (status === 'succeeded' && updating) ? (
        <FadeLoader color="#059473" />
      ) : status === 'succeeded' ? (
        <>
          <img src={successImg} alt="Payment Successful" className="w-32 h-32" />
          <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
          <Link
            to="/dashboard/my-orders"
            className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
          >
            Back to Dashboard
          </Link>
        </>
      ) : (
        <>
          <img src={errorImg} alt="Payment Failed" className="w-32 h-32" />
          <h2 className="text-2xl font-bold text-red-600">
            Payment {status === 'processing' ? 'Processing' : 'Failed'}!
          </h2>
          <Link
            to="/dashboard/my-orders"
            className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
          >
            Back to Dashboard
          </Link>
        </>
      )}
    </div>
  );
};

export default ConfirmOrder;
