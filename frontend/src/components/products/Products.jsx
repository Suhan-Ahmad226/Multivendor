import React from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaStar } from "react-icons/fa"; // রেটিং এর জন্য স্টার আইকন

const Products = ({ title, products }) => {

    // বিভিন্ন স্ক্রিনের জন্য কতগুলো আইটেম দেখা যাবে তা নির্ধারণ করা হয়েছে
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 2000 },
            items: 6
        },
        desktop: {
            breakpoint: { max: 2000, min: 1024 },
            items: 5
        },
        tablet: {
            breakpoint: { max: 1024, min: 768 },
            items: 3
        },
        // medium tablet
        mdtablet: {
            breakpoint: { max: 768, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        },
    };

    // ক্যারোসেল নেভিগেশন বাটনের ডিজাইন
    const ButtonGroup = ({ next, previous }) => {
        return (
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-2xl font-bold text-slate-800'>{title}</h2>
                <div className='flex justify-center items-center gap-2'>
                    <button onClick={() => previous()} className='w-9 h-9 flex justify-center items-center bg-white text-slate-800 border border-slate-300 rounded-full hover:bg-slate-200 transition-all duration-300'>
                        <IoIosArrowBack size={20} />
                    </button>
                    <button onClick={() => next()} className='w-9 h-9 flex justify-center items-center bg-white text-slate-800 border border-slate-300 rounded-full hover:bg-slate-200 transition-all duration-300'>
                        <IoIosArrowForward size={20} />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className='w-full p-4 bg-white rounded-lg shadow-md'>
            <Carousel
                autoPlay={false}
                infinite={false}
                arrows={false}
                responsive={responsive}
                transitionDuration={500}
                renderButtonGroupOutside={true}
                customButtonGroup={<ButtonGroup />}
                itemClass="px-2" // প্রতিটি আইটেমের মধ্যে একটু ফাঁকা জায়গা
            >
                {
                    // এখন products একটি সাধারণ array হিসেবে কাজ করবে
                    products.map((p, i) => (
                        <Link key={i} to={`/product/details/${p.slug}`} className='block group'>
                            <div className='w-full h-full border border-slate-200 rounded-lg p-3 transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:border-transparent'>
                                <div className='relative overflow-hidden'>
                                    <img className='w-full h-[180px] object-cover rounded-lg transition-transform duration-500 ease-in-out group-hover:scale-110' src={p.images[0]} alt={p.name} />
                                    {/* ডিসকাউন্ট ট্যাগ */}
                                    {p.discount > 0 && (
                                        <span className='absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full'>
                                            {p.discount}% OFF
                                        </span>
                                    )}
                                </div>
                                <div className='py-3 flex flex-col gap-1'>
                                    {/* প্রোডাক্টের নাম */}
                                    <h3 className='text-md font-semibold text-slate-700 truncate'>{p.name}</h3>
                                    {/* দাম ও ডিসকাউন্ট */}
                                    <div className='flex items-center gap-2'>
                                        <span className='text-lg font-bold text-slate-800'>${(p.price - (p.price * p.discount / 100)).toFixed(2)}</span>
                                        {p.discount > 0 && (
                                            <span className='text-sm text-slate-500 line-through'>${p.price}</span>
                                        )}
                                    </div>
                                    {/* রেটিং */}
                                    <div className='flex items-center gap-1 text-orange-500'>
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                        <span className='text-xs text-slate-500 ml-1'>({p.rating || 0})</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </Carousel>
        </div>
    );
};

export default Products;
