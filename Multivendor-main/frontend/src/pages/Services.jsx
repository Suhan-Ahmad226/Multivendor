import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-[90%] max-w-5xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Our Services</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold mb-2">Multivendor Marketplace</h2>
            <p className="text-sm text-slate-600">
              Multiple sellers, one fast storefront. Customers can easily compare products and shops.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold mb-2">Real-time Chat</h2>
            <p className="text-sm text-slate-600">
              Integrated customer–seller and admin chat to solve issues faster and increase trust.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold mb-2">Analytics Dashboard</h2>
            <p className="text-sm text-slate-600">
              Seller and admin dashboards show orders, payments, and key metrics at a glance.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;

