// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaList } from 'react-icons/fa';
import { IoIosHome } from "react-icons/io";
import { FaBorderAll, FaHeart } from "react-icons/fa6";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api/api';
import { user_reset } from '../store/reducers/authReducer';
import { reset_count } from '../store/reducers/cardReducer';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile open
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop collapse
  const [hovered, setHovered] = useState(false); // Hover expand
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
    <div className="flex flex-col min-h-screen bg-gray-100 overflow-x-hidden">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 transform transition-all duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 md:static
            ${sidebarCollapsed && !hovered ? 'w-20' : 'w-64'}
          `}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="flex justify-between items-center p-5 border-b">
            <AnimatePresence>
              {(!sidebarCollapsed || hovered) && (
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="text-lg font-bold text-gray-700"
                >
                  Menu
                </motion.h2>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2">
              <button
                className="hidden md:flex text-gray-600 hover:text-green-600 transition"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
              </button>
              <button
                className="md:hidden text-2xl font-bold text-gray-600 hover:text-red-500 transition"
                onClick={() => setSidebarOpen(false)}
              >
                ×
              </button>
            </div>
          </div>

          <ul className="mt-4 text-gray-700">
            {sidebarLinks.map((link, idx) => (
              <li key={idx} className="hover:bg-green-50 transition rounded-md">
                {link.path ? (
                  <Link
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 hover:text-green-600 font-medium transition
                      ${sidebarCollapsed && !hovered ? 'justify-center' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <AnimatePresence>
                      {(!sidebarCollapsed || hovered) && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {link.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                ) : (
                  <button
                    onClick={link.action}
                    className={`flex items-center w-full gap-3 px-4 py-3 text-gray-700 font-medium hover:text-red-600 transition
                      ${sidebarCollapsed && !hovered ? 'justify-center' : ''}`}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <AnimatePresence>
                      {(!sidebarCollapsed || hovered) && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {link.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </aside>

        {/* Mobile toggle button */}
        <div className="md:hidden fixed top-5 left-5 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-green-500 text-white p-3 rounded-md shadow-lg flex items-center justify-center hover:bg-green-600 transition"
          >
            <FaList />
          </button>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main
          className={`flex-1 transition-all duration-300 p-5
            ${sidebarCollapsed && !hovered ? 'md:ml-20'}
          `}
        >
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
