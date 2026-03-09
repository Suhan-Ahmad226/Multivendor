import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-[90%] max-w-5xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-slate-600 mb-4">
          Your privacy matters to us. This page gives a simple overview of how we handle your data.
        </p>
        <div className="space-y-5 text-sm text-slate-700">
          <section>
            <h2 className="font-semibold mb-1">Data we collect</h2>
            <p>
              We collect basic account details (name, email, phone), order information, and usage data
              to improve the shopping experience.
            </p>
          </section>
          <section>
            <h2 className="font-semibold mb-1">How we use your data</h2>
            <p>
              Data is used to process orders, provide customer support, personalize recommendations, and
              improve site performance.
            </p>
          </section>
          <section>
            <h2 className="font-semibold mb-1">Security</h2>
            <p>
              We use modern security best practices on top of our Node/Express backend and MongoDB
              database to protect your information.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

