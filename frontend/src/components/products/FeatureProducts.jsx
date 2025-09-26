import React, { useEffect } from 'react';
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from '../Rating';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { add_to_card, add_to_wishlist, messageClear } from '../../store/reducers/cardReducer';
import toast from 'react-hot-toast';

const FeatureProducts = ({ products }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const { errorMessage, successMessage } = useSelector(state => state.card);

    const add_card = (id) => {
        if (userInfo) {
            dispatch(add_to_card({
                userId: userInfo.id,
                quantity: 1,
                productId: id
            }));
        } else {
            navigate('/login');
        }
    };

    const add_wishlist = (pro) => {
        if (!userInfo) {
            toast.error("Please login to add wishlist");
            navigate('/login');
            return;
        }
        dispatch(add_to_wishlist({
            userId: userInfo.id,
            productId: pro._id,
            name: pro.name,
            price: pro.price,
            image: pro.images[0],
            discount: pro.discount,
            rating: pro.rating,
            slug: pro.slug
        }));
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    return (
        <div className='w-[90%] mx-auto py-10'>
            {/* Section Title */}
            <div className='text-center mb-10'>
                <h2 className='text-4xl font-bold text-gray-700 relative inline-block pb-2'>
                    Feature Products
                    <span className='absolute left-1/2 transform -translate-x-1/2 bottom-0 w-16 h-1 bg-green-600 rounded-full'></span>
                </h2>
            </div>

            {/* Product Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {products.map((p, i) => (
                    <div
                        key={i}
                        className='group border rounded-lg overflow-hidden shadow hover:shadow-xl hover:-translate-y-2 transition-all duration-500 bg-white flex flex-col'
                    >
                        <div className='relative overflow-hidden'>
                            {/* Discount Badge */}
                            {p.discount && (
                                <div className='absolute top-2 left-2 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-semibold z-10'>
                                    {p.discount}%
                                </div>
                            )}

                            {/* Product Image */}
                            <img
                                src={p.images[0]}
                                alt={p.name}
                                className='w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500'
                            />

                            {/* Action Buttons */}
                            <ul className='absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500'>
                                <li
                                    onClick={() => add_wishlist(p)}
                                    className='w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer shadow hover:bg-green-600 hover:text-white hover:rotate-180 transition-all duration-500'
                                >
                                    <FaRegHeart />
                                </li>
                                <Link
                                    to={`/product/details/${p.slug}`}
                                    className='w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer shadow hover:bg-green-600 hover:text-white hover:rotate-180 transition-all duration-500'
                                >
                                    <FaEye />
                                </Link>
                                <li
                                    onClick={() => add_card(p._id)}
                                    className='w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer shadow hover:bg-green-600 hover:text-white hover:rotate-180 transition-all duration-500'
                                >
                                    <RiShoppingCartLine />
                                </li>
                            </ul>
                        </div>

                        {/* Product Info */}
                        <div className='p-4 flex flex-col flex-1 justify-between'>
                            <h3 className='font-semibold text-gray-700 text-lg hover:text-green-600 transition-colors duration-300 line-clamp-2'>{p.name}</h3>
                            <div className='flex justify-between items-center mt-2'>
                                <span className='font-bold text-green-600 text-lg'>${p.price}</span>
                                <div className='flex items-center'>
                                    <Rating ratings={p.rating} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureProducts;
