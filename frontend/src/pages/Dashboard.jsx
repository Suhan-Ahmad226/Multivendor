// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
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
import { get_dashboard_index_data } from '../store/reducers/dashboardReducer';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const { recentOrders, totalOrder, pendingOrder, cancelledOrder } = useSelector(state => state.dashboard);

  useEffect(() => {
    if(userInfo?.id) dispatch(get_dashboard_index_data(userInfo.id));
  }, [userInfo]);

  const logout = async () => {
    if(window.confirm("Are you sure you want to logout?")){
      try {
        await api.get('/customer/logout');
        localStorage.removeItem('customerToken');
        dispatch(user_reset());
        dispatch(reset_count());
        navigate('/login');
        toast.success("Logged out successfully!");
      } catch (error) {
        console.log(error.response?.data);
        toast.error("Logout failed!");
      }
    }
  };

  const redirectToPayment = (ord) => {
    let items = ord.products.reduce((sum, p) => sum + p.quantity, 0);
    navigate('/payment', { state: { price: ord.price, items, orderId: ord._id } });
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
        <div className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static w-64`}>
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

        {/* Mobile toggle */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-5">
            {[
              { label: 'Total Orders', value: totalOrder, icon: <FaShoppingCart />, color: 'green' },
              { label: 'Pending Orders', value: pendingOrder, icon: <FaShoppingCart />, color: 'yellow' },
              { label: 'Cancelled Orders', value: cancelledOrder, icon: <FaShoppingCart />, color: 'red' },
              { label: 'Recent Orders', value: recentOrders?.length, icon: <FaHeart />, color: 'blue' }
            ].map((card, idx) => (
              <div key={idx} className={`flex items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition`}>
                <div className={`bg-${card.color}-100 w-12 h-12 rounded-full flex justify-center items-center text-xl text-${card.color}-800`}>
                  {card.icon}
                </div>
                <div className="ml-3">
                  <h2 className="text-2xl font-bold">{card.value || 0}</h2>
                  <p className="text-gray-500">{card.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white p-5 rounded-lg shadow overflow-x-auto">
            <h2 className="font-bold text-lg mb-3">Recent Orders</h2>
            <table className="w-full text-left text-gray-600 min-w-max">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Payment Status</th>
                  <th className="px-4 py-2">Order Status</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders?.map((ord, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-2 font-medium">#{ord._id}</td>
                    <td className="px-4 py-2">${ord.price}</td>
                    <td className={`px-4 py-2 font-medium ${ord.payment_status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>{ord.payment_status}</td>
                    <td className={`px-4 py-2 font-medium ${ord.delivery_status === 'delivered' ? 'text-green-600' : 'text-red-600'}`}>{ord.delivery_status}</td>
                    <td className="px-4 py-2 flex gap-2 flex-wrap">
                      <Link to={`/dashboard/order/details/${ord._id}`} className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition">View</Link>
                      {ord.payment_status !== 'paid' && (
                        <button onClick={() => redirectToPayment(ord)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition">Pay Now</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
