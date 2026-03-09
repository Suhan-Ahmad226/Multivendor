import React, { useEffect, useState } from 'react';
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_wishlist_products, remove_wishlist, messageClear } from '../../store/reducers/cardReducer';
import toast from 'react-hot-toast';
import Rating from '../Rating';

const Wishlist = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const { wishlist, successMessage } = useSelector(state => state.card);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(userInfo?.id) {
            dispatch(get_wishlist_products(userInfo.id)).finally(() => setLoading(false));
        }
    }, [userInfo]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
    }, [successMessage]);

    const handleRemove = (id) => {
        dispatch(remove_wishlist(id));
    };

    if (loading) {
        return (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-white h-80 rounded-lg shadow"></div>
                ))}
            </div>
        );
    }

    if (!wishlist.length) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center p-4">
                <img src="/empty-wishlist.svg" alt="Empty Wishlist" className="w-48 mb-4 mx-auto" />
                <h2 className="text-xl font-semibold text-gray-600 mb-2">Your Wishlist is Empty</h2>
                <p className="text-gray-500 mb-4">Start adding your favorite products to your wishlist!</p>
                <Link to="/products" className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {wishlist.map((p) => (
                <div key={p._id} className="relative border rounded-lg bg-white group overflow-hidden shadow hover:shadow-xl transition-all duration-500">
                    {/* Discount Badge */}
                    {p.discount > 0 && (
                        <div className="absolute top-2 left-2 w-10 h-10 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full z-10">
                            -{p.discount}%
                        </div>
                    )}

                    {/* Product Image */}
                    <div className="relative overflow-hidden">
                        <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Action Buttons */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <button
                                onClick={() => handleRemove(p._id)}
                                title="Remove from Wishlist"
                                className="w-10 h-10 bg-white flex justify-center items-center rounded-full hover:bg-green-500 hover:text-white hover:rotate-[720deg] transition-all"
                            >
                                <FaRegHeart />
                            </button>
                            <Link
                                to={`/product/details/${p.slug}`}
                                title="View Product"
                                className="w-10 h-10 bg-white flex justify-center items-center rounded-full hover:bg-green-500 hover:text-white hover:rotate-[720deg] transition-all"
                            >
                                <FaEye />
                            </Link>
                            <button
                                title="Add to Cart"
                                className="w-10 h-10 bg-white flex justify-center items-center rounded-full hover:bg-green-500 hover:text-white hover:rotate-[720deg] transition-all"
                            >
                                <RiShoppingCartLine />
                            </button>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-3 text-gray-700">
                        <h3 className="font-semibold text-lg mb-1">{p.name}</h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="font-bold text-green-700 text-lg">${(p.price - (p.price * p.discount)/100).toFixed(2)}</span>
                                {p.discount > 0 && (
                                    <span className="text-gray-400 line-through text-sm ml-2">${p.price}</span>
                                )}
                            </div>
                            <Rating ratings={p.rating} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Wishlist;
