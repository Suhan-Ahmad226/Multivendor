import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CompanyProfile = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-[90%] max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Company Profile</h1>
        <p className="text-slate-600 mb-4">
          Nittyonjoni is a Bangladeshi multivendor e‑commerce platform focused on speed, reliability,
          and seller growth.
        </p>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-700">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold mb-2">Basic Information</h2>
            <ul className="space-y-1">
              <li><span className="font-medium">Head Office:</span> New Market, Dhaka‑1205</li>
              <li><span className="font-medium">Email:</span> nittyonjoni@gmail.com</li>
              <li><span className="font-medium">Support:</span> +8801518947696</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold mb-2">What we do</h2>
            <p>
              We provide a full stack marketplace solution — customer web app, seller dashboard, and
              secure backend APIs — so sellers can focus on products instead of technology.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyProfile;

