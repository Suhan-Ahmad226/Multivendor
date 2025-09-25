import React from 'react';
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from '../Rating';

const ShopProducts = ({ styles, products }) => {
    return (
        <div className={`w-full grid ${styles === 'grid' ? 'lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1' : 'grid-cols-1'} gap-6`}>
            {products.map((p, i) => (
                <div key={i} className={`flex transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${styles === 'grid' ? 'flex-col' : 'flex-row items-center'} bg-white rounded-md overflow-hidden relative`}>
                    
                    {/* Product Image */}
                    <div className={`${styles==='grid' ? 'w-full h-[270px]' : 'w-1/2 h-[200px]'} relative group overflow-hidden`}>
                        <img 
                            src={p.images[0]} 
                            alt={p.name} 
                            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' 
                        />
                        {/* Discount/New Badge */}
                        {p.discount > 0 && <span className='absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded'>-{p.discount}%</span>}
                        {p.isNew && <span className='absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded'>New</span>}
                        {/* Action Buttons */}
                        <ul className='absolute bottom-[-50px] group-hover:bottom-3 transition-all duration-500 w-full flex justify-center items-center gap-2'>
                            <li className='w-9 h-9 flex justify-center items-center rounded-full bg-white cursor-pointer hover:bg-green-600 hover:text-white hover:rotate-[720deg] transition-all'><FaRegHeart /></li>
                            <li className='w-9 h-9 flex justify-center items-center rounded-full bg-white cursor-pointer hover:bg-green-600 hover:text-white hover:rotate-[720deg] transition-all'><FaEye /></li>
                            <li className='w-9 h-9 flex justify-center items-center rounded-full bg-white cursor-pointer hover:bg-green-600 hover:text-white hover:rotate-[720deg] transition-all'><RiShoppingCartLine /></li>
                        </ul>
                    </div>

                    {/* Product Info */}
                    <div className={`flex flex-col justify-start ${styles==='grid' ? 'p-4 gap-2' : 'p-3 gap-1 w-1/2'}`}>
                        <h3 className='text-md font-semibold text-slate-700'>{p.name}</h3>
                        <p className='text-sm text-slate-500'>Brand: {p.brand}</p>
                        <div className='flex items-center justify-between'>
                            <span className='text-lg font-bold text-orange-500'>
                                ${p.price - Math.floor((p.price * p.discount) / 100)}
                            </span>
                            {p.discount > 0 && <span className='line-through text-sm text-gray-400'>${p.price}</span>}
                        </div>
                        <div className='mt-1'>
                            <Rating ratings={p.rating} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ShopProducts;
