import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DeliveryInfo = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-[90%] max-w-5xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Delivery Information</h1>
        <p className="text-slate-600 mb-6 max-w-2xl">
          We work with trusted logistics partners to deliver your products quickly and safely. Exact
          delivery times depend on your location and the seller&apos;s handling time.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold mb-2">Standard Delivery</h2>
            <p className="text-sm text-slate-600">
              Typical delivery within 3–7 working days in major cities. Tracking is available from your
              dashboard under &quot;My Orders&quot;.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold mb-2">Shipping Fees</h2>
            <p className="text-sm text-slate-600">
              Shipping fees are calculated at checkout based on your address, order weight, and seller.
              Any promotions will be shown before you confirm payment.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeliveryInfo;

