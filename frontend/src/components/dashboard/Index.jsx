// src/components/dashboard/Index.jsx
import React, { useEffect } from 'react';
import { RiShoppingCart2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { get_dashboard_index_data } from '../../store/reducers/dashboardReducer';

const Index = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const { recentOrders, totalOrder, pendingOrder, cancelledOrder } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(get_dashboard_index_data(userInfo.id));
  }, []);

  const redirect = (ord) => {
    let items = 0;
    for (let i = 0; i < ord.products.length; i++) {
      items += ord.products[i].quantity;
    }
    navigate('/payment', {
      state: {
        price: ord.price,
        items,
        orderId: ord._id
      }
    });
  };

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Total Orders */}
        <div className="flex justify-start items-center p-5 bg-white rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1">
          <div className="bg-green-100 w-12 h-12 rounded-full flex justify-center items-center text-green-800 text-2xl">
            <RiShoppingCart2Fill />
          </div>
          <div className="ml-4 flex flex-col justify-center text-slate-600">
            <h2 className="text-3xl font-bold">{totalOrder}</h2>
            <span className="text-sm">Orders</span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="flex justify-start items-center p-5 bg-white rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1">
          <div className="bg-yellow-100 w-12 h-12 rounded-full flex justify-center items-center text-yellow-800 text-2xl">
            <RiShoppingCart2Fill />
          </div>
          <div className="ml-4 flex flex-col justify-center text-slate-600">
            <h2 className="text-3xl font-bold">{pendingOrder}</h2>
            <span className="text-sm">Pending Orders</span>
          </div>
        </div>

        {/* Cancelled Orders */}
        <div className="flex justify-start items-center p-5 bg-white rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1">
          <div className="bg-red-100 w-12 h-12 rounded-full flex justify-center items-center text-red-800 text-2xl">
            <RiShoppingCart2Fill />
          </div>
          <div className="ml-4 flex flex-col justify-center text-slate-600">
            <h2 className="text-3xl font-bold">{cancelledOrder}</h2>
            <span className="text-sm">Cancelled Orders</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto rounded-md">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th className="px-6 py-3">Order Id</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Payment Status</th>
                <th className="px-6 py-3">Order Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o, i) => (
                <tr key={i} className="bg-white border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium whitespace-nowrap">#{o._id}</td>
                  <td className="px-6 py-4 font-medium whitespace-nowrap">${o.price}</td>
                  <td className="px-6 py-4 font-medium whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
                      o.payment_status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}>
                      {o.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
                      o.delivery_status === 'delivered' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {o.delivery_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium whitespace-nowrap flex items-center gap-2">
                    <Link to={`/dashboard/order/details/${o._id}`} className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition">
                      View
                    </Link>
                    {o.payment_status !== 'paid' && (
                      <button
                        onClick={() => redirect(o)}
                        className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200 transition"
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Index;
