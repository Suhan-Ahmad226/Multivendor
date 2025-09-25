import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { place_order } from '../store/reducers/orderReducer';

const Shipping = () => {
    const { state: { products, price, shipping_fee, items } } = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector(state => state.auth);

    const [res, setRes] = useState(false);
    const [stateForm, setStateForm] = useState({
        name: '',
        address: '',
        phone: '',
        post: '',
        province: '',
        city: '',
        area: ''
    });

    const inputHandle = (e) => {
        setStateForm({ ...stateForm, [e.target.name]: e.target.value });
    };

    const save = (e) => {
        e.preventDefault();
        const { name, address, phone, post, province, city, area } = stateForm;
        if (name && address && phone && post && province && city && area) {
            setRes(true);
        }
    };

    const placeOrder = () => {
        dispatch(place_order({
            price,
            products,
            shipping_fee,
            items,
            shippingInfo: stateForm,
            userId: userInfo.id,
            navigate
        }));
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            {/* Banner */}
            <section className="relative h-[220px] bg-cover bg-no-repeat bg-left mt-6" style={{ backgroundImage: 'url(/images/banner/shop.png)' }}>
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h2 className="text-3xl md:text-4xl font-bold">Shipping Page</h2>
                        <div className="flex justify-center items-center gap-2 text-lg md:text-xl mt-2">
                            <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
                            <IoIosArrowForward className="mt-1" />
                            <span>Shipping</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Shipping & Order Summary */}
            <section className="bg-gray-100 py-16">
                <div className="w-[90%] max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8">
                    
                    {/* Shipping Form */}
                    <div className="flex-1">
                        <div className="bg-white p-6 shadow-md rounded-md flex flex-col gap-5">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-700">Shipping Information</h2>

                            {!res ? (
                                <form onSubmit={save} className="flex flex-col gap-4">
                                    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <label className="text-slate-600 font-medium">Name</label>
                                            <input name="name" value={stateForm.name} onChange={inputHandle} placeholder="Name" className="border p-2 rounded-md focus:border-green-500 outline-none" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-slate-600 font-medium">Address</label>
                                            <input name="address" value={stateForm.address} onChange={inputHandle} placeholder="Address" className="border p-2 rounded-md focus:border-green-500 outline-none" />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <label className="text-slate-600 font-medium">Phone</label>
                                            <input name="phone" value={stateForm.phone} onChange={inputHandle} placeholder="Phone" className="border p-2 rounded-md focus:border-green-500 outline-none" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-slate-600 font-medium">Post</label>
                                            <input name="post" value={stateForm.post} onChange={inputHandle} placeholder="Post" className="border p-2 rounded-md focus:border-green-500 outline-none" />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <label className="text-slate-600 font-medium">Province</label>
                                            <input name="province" value={stateForm.province} onChange={inputHandle} placeholder="Province" className="border p-2 rounded-md focus:border-green-500 outline-none" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-slate-600 font-medium">City</label>
                                            <input name="city" value={stateForm.city} onChange={inputHandle} placeholder="City" className="border p-2 rounded-md focus:border-green-500 outline-none" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-slate-600 font-medium">Area</label>
                                        <input name="area" value={stateForm.area} onChange={inputHandle} placeholder="Area" className="border p-2 rounded-md focus:border-green-500 outline-none" />
                                    </div>

                                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors shadow-md hover:shadow-lg">Save Changes</button>
                                </form>
                            ) : (
                                <div className="flex flex-col gap-3 text-slate-700">
                                    <h3 className="text-lg font-semibold">Deliver To {stateForm.name}</h3>
                                    <p className="flex flex-wrap gap-2 items-center">
                                        <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm font-medium">Home</span>
                                        <span>{stateForm.phone}, {stateForm.address}, {stateForm.province}, {stateForm.city}, {stateForm.area}</span>
                                        <span onClick={() => setRes(false)} className="text-indigo-500 cursor-pointer hover:underline">Change</span>
                                    </p>
                                    <p className="text-sm text-slate-600">Email: ariyan@gmail.com</p>
                                </div>
                            )}
                        </div>

                        {/* Products */}
                        {products.map((p, i) => (
                            <div key={i} className="bg-white mt-5 p-4 shadow-md rounded-md flex flex-col gap-4">
                                <h4 className="font-semibold text-slate-700">{p.shopName}</h4>
                                {p.products.map((pt, idx) => (
                                    <div key={idx} className="flex flex-wrap items-center justify-between gap-4 border-b py-2">
                                        <div className="flex gap-4 items-center sm:w-full w-7/12">
                                            <img className="w-20 h-20 object-cover rounded-md" src={pt.productInfo.images[0]} alt={pt.productInfo.name} />
                                            <div className="text-slate-700">
                                                <h5 className="font-semibold">{pt.productInfo.name}</h5>
                                                <p className="text-sm">Brand: {pt.productInfo.brand}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start sm:w-full w-5/12 gap-1">
                                            <span className="text-orange-500 font-semibold text-lg">${pt.productInfo.price - Math.floor((pt.productInfo.price * pt.productInfo.discount) / 100)}</span>
                                            <span className="line-through text-sm text-gray-400">${pt.productInfo.price}</span>
                                            <span className="text-red-500 text-sm">-{pt.productInfo.discount}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-4">
                        <div className="bg-white p-5 shadow-md rounded-md flex flex-col gap-4 text-slate-700">
                            <h3 className="text-xl font-bold">Order Summary</h3>
                            <div className="flex justify-between">
                                <span>Items Total ({items})</span>
                                <span>${price}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span>${shipping_fee}</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                                <span>Total Payment</span>
                                <span>${price + shipping_fee}</span>
                            </div>
                            <div className="flex justify-between text-lg text-green-600 font-bold">
                                <span>Total</span>
                                <span>${price + shipping_fee}</span>
                            </div>

                            <button
                                onClick={placeOrder}
                                disabled={!res}
                                className={`px-5 py-2 rounded-md uppercase text-white font-semibold transition-colors ${res ? 'bg-red-500 hover:bg-red-600 shadow-lg' : 'bg-red-300 cursor-not-allowed'}`}
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Shipping;
