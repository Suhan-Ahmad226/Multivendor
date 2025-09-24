// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaList, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { IoIosHome } from "react-icons/io";
import { FaBorderAll } from "react-icons/fa6";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";

import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api/api';
import { user_reset } from '../store/reducers/authReducer';
import { reset_count } from '../store/reducers/cardReducer';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      await api.get('/customer/logout');
      localStorage.removeItem('customerToken');
      dispatch(user_reset());
      dispatch(reset_count());
      navigate('/login');
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const sidebarLinks = [
    { icon: <IoIosHome />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FaBorderAll />, label: 'My Orders', path: '/dashboard/my-orders' },
    { icon: <FaHeart />, label: 'Wishlist', path: '/dashboard/my-wishlist' },
    { icon: <IoChatbubbleEllipsesSharp />, label: 'Chat', path: '/dashboard/chat' },
    { icon: <RiLockPasswordLine />, label: 'Change Password', path: '/dashboard/change-password' },
    { icon: <IoMdLogOut />, label: 'Logout', action: logout },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static w-64`}
        >
          <div className="p-5 flex justify-between items-center border-b">
            <h2 className="font-bold text-lg text-gray-700">Menu</h2>
            <button className="md:hidden text-xl" onClick={() => setSidebarOpen(false)}>×</button>
          </div>
          <ul className="mt-4">
            {sidebarLinks.map((link, idx) => (
              <li key={idx} className="hover:bg-green-50 transition rounded-md">
                {link.path ? (
                  <Link
                    to={link.path}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium hover:text-green-600"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="text-xl">{link.icon}</span>
                    {link.label}
                  </Link>
                ) : (
                  <button
                    onClick={link.action}
                    className="flex w-full items-center gap-3 px-4 py-3 text-gray-700 font-medium hover:text-red-600"
                  >
                    <span className="text-xl">{link.icon}</span>
                    {link.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile toggle button */}
        <div className="md:hidden fixed top-5 left-5 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-green-500 text-white p-3 rounded-md shadow flex items-center justify-center"
          >
            <FaList />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 md:ml-64 transition-all duration-300 p-5">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
            {[
              { label: 'Total Orders', value: 12, icon: <FaShoppingCart />, color: 'green' },
              { label: 'Pending Orders', value: 3, icon: <FaShoppingCart />, color: 'yellow' },
              { label: 'Cancelled Orders', value: 1, icon: <FaShoppingCart />, color: 'red' },
              { label: 'Wishlist Items', value: 5, icon: <FaHeart />, color: 'blue' },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`flex items-center p-4 bg-white rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1`}
              >
                <div className={`bg-${card.color}-100 w-14 h-14 rounded-full flex justify-center items-center text-2xl text-${card.color}-800`}>
                  {card.icon}
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold">{card.value}</h2>
                  <p className="text-gray-500">{card.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Nested Routes */}
          <div className="bg-white rounded-lg shadow p-5 min-h-[400px]">
            <Outlet />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
