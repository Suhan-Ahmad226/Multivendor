import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { get_orders } from '../../store/reducers/orderReducer';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Orders = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const { myOrders } = useSelector(state => state.order);

  useEffect(() => {
    if (userInfo?.id) {
      dispatch(get_orders({ status: filterStatus, customerId: userInfo.id }));
    }
  }, [filterStatus, userInfo]);

  const redirectToPayment = (order) => {
    let items = order.products.reduce((acc, prod) => acc + prod.quantity, 0);
    navigate('/payment', { state: { price: order.price, items, orderId: order._id } });
  };

  return (
    <div className="bg-gray-100 p-4 md:p-6 rounded-lg">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">My Orders</h2>
        <select
          className="outline-none px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-green-400 transition"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">-- Order Status --</option>
          <option value="placed">Placed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="warehouse">Warehouse</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-4">
        {myOrders.map((order, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-4"
          >
            {/* Order Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-medium text-gray-700">#{order._id}</span>
                <span className="text-gray-500">${order.price}</span>
                <span className={`px-2 py-1 rounded text-sm font-semibold ${
                  order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>{order.payment_status}</span>
                <span className={`px-2 py-1 rounded text-sm font-semibold ${
                  order.delivery_status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
                }`}>{order.delivery_status}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="hover:text-green-600 transition">{expandedOrder === order._id ? <FaChevronUp /> : <FaChevronDown />}</span>
              </div>
            </div>

            {/* Expandable Content */}
            {expandedOrder === order._id && (
              <div className="mt-4 border-t pt-4 flex flex-col gap-4">
                {/* Products */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {order.products.map((prod, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 border rounded hover:shadow-sm transition">
                      <img src={prod.images[0]} alt={prod.name} className="w-16 h-16 object-cover rounded"/>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-gray-700">{prod.name}</span>
                        <span className="text-gray-500 text-sm">Brand: {prod.brand}</span>
                        <span className="text-gray-500 text-sm">Qty: {prod.quantity}</span>
                      </div>
                      <div className="ml-auto flex flex-col items-end">
                        <span className="text-green-700 font-semibold">${(prod.price * (1 - (prod.discount / 100))).toFixed(2)}</span>
                        {prod.discount > 0 && <span className="line-through text-gray-400 text-sm">${prod.price}</span>}
                        {prod.discount > 0 && <span className="text-xs text-red-600">-{prod.discount}%</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <Link to={`/dashboard/order/details/${order._id}`} className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition">
                    View Details
                  </Link>
                  {order.payment_status !== 'paid' && (
                    <button onClick={() => redirectToPayment(order)} className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition">
                      Pay Now
                    </button>
                  )}
                  <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition">
                    Track Order
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Note */}
      <p className="text-gray-400 text-xs mt-2 sm:hidden">
        Tap on an order to expand details.
      </p>
    </div>
  );
};

export default Orders;
