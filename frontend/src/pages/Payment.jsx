import React, { useState } from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import { useLocation, Navigate } from 'react-router-dom';
import Stripe from '../components/Stripe';
import { motion, AnimatePresence } from 'framer-motion';

const Payment = () => {
    const location = useLocation();
    const state = location.state || {};
    const { price = 0, items = 0, orderId = '' } = state;
    const [paymentMethod, setPaymentMethod] = useState('stripe');

    const cardVariant = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 }
    };

    
    if (!state || !orderId) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />

            <section className="w-[95%] lg:w-[85%] mx-auto py-12 flex-1">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

                    {/* Payment Options & Form */}
                    <div className="lg:w-7/12 w-full bg-gray-100 p-6 rounded-xl shadow-lg flex flex-col">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Select Payment Method</h2>

                        {/* Payment Method Buttons */}
                        <div className="flex flex-col sm:flex-row border-b border-gray-300 mb-6 rounded-lg overflow-hidden">
                            {/* Stripe */}
                            <div
                                onClick={() => setPaymentMethod('stripe')}
                                className={`flex-1 cursor-pointer py-6 px-4 flex flex-col items-center justify-center transition-all duration-300 transform ${
                                    paymentMethod === 'stripe'
                                        ? 'bg-white shadow-xl scale-105'
                                        : 'bg-gray-200 hover:bg-gray-300 hover:scale-105'
                                }`}
                            >
                                <img src="/images/payment/stripe.png" alt="Stripe" className="h-14 mb-2" />
                                <span className="text-gray-700 font-medium">Stripe</span>
                            </div>

                            {/* COD */}
                            <div
                                onClick={() => setPaymentMethod('cod')}
                                className={`flex-1 cursor-pointer py-6 px-4 flex flex-col items-center justify-center transition-all duration-300 transform ${
                                    paymentMethod === 'cod'
                                        ? 'bg-white shadow-xl scale-105'
                                        : 'bg-gray-200 hover:bg-gray-300 hover:scale-105'
                                }`}
                            >
                                <img src="/images/payment/cod.jpg" alt="COD" className="h-14 mb-2 rounded-md" />
                                <span className="text-gray-700 font-medium">Cash on Delivery</span>
                            </div>
                        </div>

                        {/* Payment Form */}
                        <div className="relative min-h-[150px]">
                            <AnimatePresence mode="wait">
                                {paymentMethod === 'stripe' && (
                                    <motion.div
                                        key="stripe"
                                        variants={cardVariant}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        transition={{ duration: 0.4 }}
                                        className="bg-white p-6 rounded-xl shadow-lg"
                                    >
                                        <Stripe orderId={orderId} price={price} />
                                    </motion.div>
                                )}

                                {paymentMethod === 'cod' && (
                                    <motion.div
                                        key="cod"
                                        variants={cardVariant}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        transition={{ duration: 0.4 }}
                                        className="bg-white p-6 rounded-xl shadow-lg flex justify-center items-center"
                                    >
                                        <button className="px-14 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg hover:shadow-green-500/40 transition-all duration-300 text-lg font-medium">
                                            Pay Now
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-5/12 w-full flex-shrink-0">
                        <div className="bg-white shadow-lg rounded-xl p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                            <div className="flex justify-between mb-2 text-gray-600">
                                <span>{items} Items</span>
                                <span>${price}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 mb-2">
                                <span>Shipping</span>
                                <span>$0</span>
                            </div>
                            <div className="border-t border-gray-300 mt-4 pt-4 flex justify-between font-semibold text-gray-800 text-lg">
                                <span>Total Amount</span>
                                <span className="text-green-600">${price}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Payment;
