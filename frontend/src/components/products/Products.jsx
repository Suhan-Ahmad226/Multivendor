import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { AiOutlineStar } from "react-icons/ai";

const Products = ({ title, products }) => {
    
    // Carousel-এর জন্য রেসপন্সিভ ব্রেকপয়েন্ট। সব ডিভাইসেই ১টি করে স্লাইড দেখাবে,
    // কিন্তু প্রতিটি স্লাইডের ভেতরে আমরা গ্রিড ব্যবহার করে একাধিক প্রোডাক্ট দেখাবো।
    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 1 },
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
    };

    // ক্যারোসেলের নেভিগেশন বাটনগুলোর নতুন ডিজাইন
    const ButtonGroup = ({ next, previous }) => {
        return (
            <div className='flex justify-between items-center w-full px-1 md:px-3'>
                <h2 className='text-2xl font-bold text-slate-800'>{title}</h2>
                <div className='flex gap-2'>
                    <button 
                        onClick={() => previous()} 
                        className='w-8 h-8 md:w-10 md:h-10 flex justify-center items-center bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-full transition-all duration-300'
                    >
                        <IoIosArrowBack size={20} />
                    </button>
                    <button 
                        onClick={() => next()} 
                        className='w-8 h-8 md:w-10 md:h-10 flex justify-center items-center bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-full transition-all duration-300'
                    >
                        <IoIosArrowForward size={20} />
                    </button>
                </div>
            </div>
        );
    };

    // রেটিং দেখানোর জন্য একটি ছোট ফাংশন
    const renderRating = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars.push(<FaStar key={i} className="text-yellow-500" />);
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
            } else {
                stars.push(<AiOutlineStar key={i} className="text-slate-400" />);
            }
        }
        return <div className="flex items-center gap-1">{stars}</div>;
    };

    return (
        <div className='w-full mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md'>
            <Carousel
                autoPlay={false}
                infinite={false}
                arrows={false}
                responsive={responsive}
                transitionDuration={500}
                renderButtonGroupOutside={true}
                customButtonGroup={<ButtonGroup />}
            >
                {/* products array-এর প্রতিটি এলিমেন্ট একটি স্লাইড হিসেবে কাজ করবে */}
                {products.map((slideProducts, i) => (
                    <div key={i} className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-6'>
                        {/* প্রতিটি স্লাইডের ভেতরে থাকা প্রোডাক্টগুলোকে গ্রিডে দেখানো হচ্ছে */}
                        {slideProducts.map((product, j) => (
                            <Link key={j} to={`/product/details/${product.slug}`} className='block group'>
                                <div className='bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col'>
                                    {/* Product Image */}
                                    <div className='relative w-full h-40 md:h-48'>
                                        <img className='w-full h-full object-cover' src={product.images[0]} alt={product.name} />
                                        {product.discount > 0 && (
                                            <div className='absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
                                                {product.discount}% OFF
                                            </div>
                                        )}
                                    </div>
                                    {/* Product Details */}
                                    <div className='p-3 flex flex-col flex-grow'>
                                        <h3 className='text-sm md:text-base font-semibold text-slate-700 truncate group-hover:text-blue-600 transition-colors'>
                                            {product.name}
                                        </h3>
                                        <div className='flex items-center gap-2 mt-2'>
                                            {renderRating(product.rating || 0)}
                                            <span className='text-xs text-slate-500'>({product.reviews || 0})</span>
                                        </div>
                                        <div className='mt-auto pt-2'>
                                            <span className='text-base md:text-lg font-bold text-slate-800'>${product.price}</span>
                                            {product.discount > 0 && (
                                                <span className='text-sm text-slate-400 line-through ml-2'>
                                                    ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default Products;

