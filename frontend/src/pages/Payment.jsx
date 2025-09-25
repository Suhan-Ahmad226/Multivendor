import React, { useState } from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import { useLocation } from 'react-router-dom';
import Stripe from '../components/Stripe';
import { motion, AnimatePresence } from 'framer-motion';

const Payment = () => {

    const { state: { price, items, orderId } } = useLocation();
    const [paymentMethod, setPaymentMethod] = useState('stripe');

    const cardVariant = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />

            <section className="w-[90%] lg:w-[85%] mx-auto py-12">
                <div className="flex flex-wrap md:flex-col-reverse gap-6">
                    
                    {/* Payment Options & Form */}
                    <div className="w-7/12 md:w-full bg-gray-100 md:bg-gray-50 p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-6 text-gray-700">Select Payment Method</h2>
                        <div className="flex flex-wrap border-b border-gray-300 mb-6">
                            {/* Stripe */}
                            <div
                                onClick={() => setPaymentMethod('stripe')}
                                className={`flex-1 cursor-pointer py-6 px-4 md:px-2 flex flex-col items-center justify-center transition-all duration-300 ${
                                    paymentMethod === 'stripe' ? 'bg-white shadow-md rounded-t-md scale-105' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            >
                                <img src="http://localhost:3000/images/payment/stripe.png" alt="Stripe" className="h-12 mb-2" />
                                <span className="text-gray-600 font-medium">Stripe</span>
                            </div>

                            {/* COD */}
                            <div
                                onClick={() => setPaymentMethod('cod')}
                                className={`flex-1 cursor-pointer py-6 px-4 md:px-2 flex flex-col items-center justify-center transition-all duration-300 ${
                                    paymentMethod === 'cod' ? 'bg-white shadow-md rounded-t-md scale-105' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            >
                                <img src="http://localhost:3000/images/payment/cod.jpg" alt="COD" className="h-12 mb-2" />
                                <span className="text-gray-600 font-medium">COD</span>
                            </div>
                        </div>

                        {/* Payment Form with animation */}
                        <div className="relative min-h-[120px]">
                            <AnimatePresence exitBeforeEnter>
                                {paymentMethod === 'stripe' && (
                                    <motion.div
                                        key="stripe"
                                        variants={cardVariant}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        transition={{ duration: 0.4 }}
                                        className="bg-white p-6 rounded-md shadow-md"
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
                                        className="bg-white p-6 rounded-md shadow-md flex justify-center"
                                    >
                                        <button className="px-12 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-lg hover:shadow-green-500/40 transition-all duration-300">
                                            Pay Now
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-5/12 md:w-full">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="font-bold text-lg text-gray-700 mb-4">Order Summary</h2>
                            <div className="flex justify-between mb-2 text-gray-600">
                                <span>{items} Items (Shipping Included)</span>
                                <span>${price}</span>
                            </div>
                            <div className="flex justify-between mt-4 font-semibold text-gray-700">
                                <span>Total Amount</span>
                                <span className="text-green-600 text-lg">${price}</span>
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
