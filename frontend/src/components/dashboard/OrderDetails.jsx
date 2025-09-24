import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { get_order_details } from '../../store/reducers/orderReducer';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.auth);
  const { myOrder } = useSelector(state => state.order);
  const [expanded, setExpanded] = useState({}); // track which products are expanded

  useEffect(() => {
    dispatch(get_order_details(orderId));
  }, [orderId]);

  const toggleExpand = (index) => {
    setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const reorder = () => {
    navigate('/checkout', { state: { orderId: myOrder._id } });
  };

  const steps = ['Ordered', 'Shipped', 'Delivered'];

  const currentStep = steps.indexOf(myOrder.delivery_status);

  return (
    <div className="bg-white p-5 rounded-lg shadow space-y-6">

      {/* Header */}
      <h2 className="text-lg text-slate-700 font-semibold">
        Order <span className="font-bold">#{myOrder._id}</span> - <span className="text-sm text-gray-500">{myOrder.date}</span>
      </h2>

      {/* Order Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm flex flex-col gap-2">
          <h3 className="text-slate-600 font-semibold">Deliver To: {myOrder.shippingInfo?.name}</h3>
          <p className="text-sm text-slate-600">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Home</span>
            <span className="ml-2">{myOrder.shippingInfo?.address}, {myOrder.shippingInfo?.province}, {myOrder.shippingInfo?.city}</span>
          </p>
          <p className="text-sm text-slate-600">Email: <span className="font-medium">{userInfo.email}</span></p>
        </div>

        {/* Price & Status */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm flex flex-col gap-2">
          <h3 className="font-mono text-md text-slate-600">
            Price: <span className="font-bold text-green-700">${myOrder.price}</span>
          </h3>
          <p className="font-mono text-sm">
            Payment Status:
            <span className={`ml-2 py-1 px-3 rounded-full text-xs font-semibold transition ${
              myOrder.payment_status === 'paid' ? 'bg-green-300 text-green-800' : 'bg-red-300 text-red-800'
            }`}>{myOrder.payment_status}</span>
          </p>
          <p className="font-mono text-sm">
            Order Status:
            <span className={`ml-2 py-1 px-3 rounded-full text-xs font-semibold transition ${
              myOrder.delivery_status === 'delivered' ? 'bg-green-300 text-green-800' : 'bg-yellow-300 text-yellow-800'
            }`}>{myOrder.delivery_status}</span>
          </p>

          {/* Stepper */}
          <div className="flex justify-between items-center mt-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center relative">
                <div className={`w-6 h-6 rounded-full ${idx <= currentStep ? 'bg-green-500' : 'bg-gray-300'} transition`}></div>
                {idx < steps.length - 1 && (
                  <div className={`absolute top-3 left-1/2 w-full h-1 ${idx < currentStep ? 'bg-green-500' : 'bg-gray-300'} transform -translate-x-1/2`}></div>
                )}
                <span className="text-xs mt-2 text-slate-600">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-700">Order Products</h3>
        <div className="flex flex-col gap-3">
          {myOrder.products?.map((p, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded-md shadow-sm hover:shadow-md transition transform hover:-translate-y-1">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <img className="w-16 h-16 object-cover rounded-md" src={p.images[0]} alt={p.name} />
                  <div className="flex flex-col gap-1 text-slate-700">
                    <Link className="font-semibold hover:text-blue-600 transition">{p.name}</Link>
                    <p className="text-sm">Brand: {p.brand}</p>
                    <p className="text-sm">Quantity: {p.quantity}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <h2 className="text-green-800 font-semibold">${(p.price - Math.floor((p.price * p.discount) / 100)).toFixed(2)}</h2>
                  <p className="line-through text-gray-400 text-sm">${p.price}</p>
                  <p className="text-xs text-red-500">-{p.discount}%</p>
                </div>
                <button onClick={() => toggleExpand(i)} className="ml-4 text-gray-500 hover:text-gray-700 transition">
                  {expanded[i] ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>

              {expanded[i] && (
                <div className="mt-3 p-2 bg-white border rounded-md text-sm text-slate-600">
                  <p>Full product description and details can go here. Add any info needed.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <button onClick={reorder} className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition">Reorder</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition">Leave Review</button>
      </div>
    </div>
  );
};

export default OrderDetails;
