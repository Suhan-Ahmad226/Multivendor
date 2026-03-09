import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-[90%] max-w-6xl mx-auto py-10">
        <section className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">About Nittyonjoni</h1>
          <p className="text-slate-600 max-w-2xl">
            Nittyonjoni is a modern multivendor marketplace where trusted sellers and happy customers
            meet. We focus on fast experience, secure checkout, and a simple, clean shopping journey.
          </p>
        </section>
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-2">For Customers</h2>
            <p className="text-sm text-slate-600">
              Discover thousands of products, powerful search & filters, wishlists, and real-time order
              tracking in a smooth experience.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-2">For Sellers</h2>
            <p className="text-sm text-slate-600">
              A full-featured dashboard for managing products, orders, payments, campaigns, and customer
              conversations in one place.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-2">Performance</h2>
            <p className="text-sm text-slate-600">
              Built with React, code-splitting, and a Node backend so pages load fast even on slower
              networks and mobile devices.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;

