import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { 
    get_card_products,
    delete_card_product,
    messageClear,
    quantity_inc,
    quantity_dec 
} from '../store/reducers/cardReducer';
import toast from 'react-hot-toast';

const Card = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux State থেকে ডাটা আনা
    const { userInfo } = useSelector(state => state.auth);
    const { 
        card_products,
        successMessage,
        errorMessage,
        price,
        buy_product_item,
        shipping_fee,
        outofstock_products 
    } = useSelector(state => state.card);

    // ইউজার লগইন থাকলে কার্ড ডাটা ফেচ করা
    useEffect(() => {
        if (userInfo?.id) {
            dispatch(get_card_products(userInfo.id));
        }
    }, [userInfo, dispatch]);

    // সাকসেস বা এরর মেসেজ হ্যান্ডেল করা
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            dispatch(get_card_products(userInfo.id));
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch, userInfo]);

    // শিপিং পেজে রিডাইরেক্ট
    const redirect = () => {
        navigate('/shipping', {
            state: {
                products: card_products,
                price: price,
                shipping_fee: shipping_fee,
                items: buy_product_item
            }
        });
    };

    // কোয়ান্টিটি বাড়ানো
    const inc = (quantity, stock, card_id) => {
        const temp = quantity + 1;
        if (temp <= stock) {
            dispatch(quantity_inc(card_id));
        } else {
            toast.error('Out of stock limit');
        }
    };

    // কোয়ান্টিটি কমানো
    const dec = (quantity, card_id) => {
        const temp = quantity - 1;
        if (temp > 0) {
            dispatch(quantity_dec(card_id));
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />

            {/* Banner Section */}
            <section className='relative h-[220px] bg-cover bg-no-repeat bg-left' style={{ backgroundImage: 'url("/images/banner/shop.png")' }}>
                <div className='absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white'>
                    <h2 className='text-3xl font-bold'>Shopping Card</h2>
                    <div className='flex items-center gap-2 text-lg mt-2'>
                        <Link to='/' className='hover:underline'>Home</Link>
                        <IoIosArrowForward className='text-xl' />
                        <span>Card</span>
                    </div>
                </div>
            </section>

            <section className='py-16'>
                <div className='w-[90%] max-w-7xl mx-auto flex flex-col lg:flex-row gap-8'>
                    
                    {/* Left Side: Product List */}
                    <div className='flex-1 flex flex-col gap-6'>
                        {(card_products.length > 0 || outofstock_products.length > 0) ? (
                            <>
                                {/* In Stock Products */}
                                {card_products.length > 0 && (
                                    <div className='bg-white shadow-sm rounded-lg p-4'>
                                        <h2 className='text-green-600 font-semibold mb-4'>Stock Products ({card_products.length})</h2>
                                        {card_products.map((p, i) => (
                                            <div key={i} className='mb-6 last:mb-0 border-b pb-4 last:border-0'>
                                                <h3 className='font-bold text-gray-700 mb-3'>{p.shopName}</h3>
                                                {p.products.map((pt, j) => (
                                                    <div key={j} className='flex flex-col sm:flex-row justify-between items-center gap-4 mb-4'>
                                                        <div className='flex items-center gap-4 w-full'>
                                                            <img className='w-20 h-20 object-cover rounded shadow-sm' src={pt.productInfo.images[0]} alt="" />
                                                            <div>
                                                                <h4 className='font-semibold text-gray-800'>{pt.productInfo.name}</h4>
                                                                <p className='text-sm text-gray-500'>Brand: {pt.productInfo.brand}</p>
                                                            </div>
                                                        </div>
                                                        <div className='flex items-center justify-between w-full sm:w-auto gap-8'>
                                                            <div className='text-center'>
                                                                <h4 className='text-lg text-orange-500 font-bold'>
                                                                    ${(pt.productInfo.price - Math.floor((pt.productInfo.price * pt.productInfo.discount) / 100)).toFixed(2)}
                                                                </h4>
                                                                {pt.productInfo.discount > 0 && (
                                                                    <p className='line-through text-gray-400 text-sm'>${pt.productInfo.price}</p>
                                                                )}
                                                            </div>
                                                            <div className='flex flex-col items-center gap-2'>
                                                                <div className='flex items-center bg-gray-100 rounded-full border'>
                                                                    <button onClick={() => dec(pt.quantity, pt._id)} className='px-3 py-1 hover:text-red-500 font-bold'>-</button>
                                                                    <span className='px-3 font-semibold text-gray-700'>{pt.quantity}</span>
                                                                    <button onClick={() => inc(pt.quantity, pt.productInfo.stock, pt._id)} className='px-3 py-1 hover:text-green-500 font-bold'>+</button>
                                                                </div>
                                                                <button 
                                                                    onClick={() => dispatch(delete_card_product(pt._id))} 
                                                                    className='text-xs text-red-500 hover:underline'
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Out of Stock Products */}
                                {outofstock_products.length > 0 && (
                                    <div className='bg-white shadow-sm rounded-lg p-4 opacity-70'>
                                        <h2 className='text-red-500 font-semibold mb-4'>Out of Stock ({outofstock_products.length})</h2>
                                        {outofstock_products.map((p, i) => (
                                            <div key={i} className='flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-3 mb-3 last:border-0'>
                                                <div className='flex items-center gap-4 w-full'>
                                                    <img className='w-20 h-20 object-cover rounded grayscale' src={p.products[0].images[0]} alt="" />
                                                    <div>
                                                        <h4 className='font-semibold text-gray-600'>{p.products[0].name}</h4>
                                                        <span className='text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded'>Unavailable</span>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => dispatch(delete_card_product(p._id))}
                                                    className='p-2 bg-gray-200 rounded text-gray-600 hover:bg-red-500 hover:text-white transition'
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className='bg-white p-10 rounded-lg shadow-sm text-center'>
                                <p className='text-xl text-gray-600 mb-4'>Your card is empty!</p>
                                <Link className='px-8 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition inline-block' to='/shops'>
                                    Shop Now
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Order Summary */}
                    {card_products.length > 0 && (
                        <div className='w-full lg:w-[350px]'>
                            <div className='bg-white shadow-md rounded-lg p-6 sticky top-24'>
                                <h2 className='text-xl font-bold text-gray-800 border-b pb-3 mb-4'>Order Summary</h2>
                                <div className='flex flex-col gap-3'>
                                    <div className='flex justify-between text-gray-600'>
                                        <span>Items ({buy_product_item})</span>
                                        <span>${price.toFixed(2)}</span>
                                    </div>
                                    <div className='flex justify-between text-gray-600'>
                                        <span>Shipping Fee</span>
                                        <span>${shipping_fee.toFixed(2)}</span>
                                    </div>
                                    <div className='mt-2'>
                                        <div className='flex gap-2'>
                                            <input 
                                                type="text" 
                                                placeholder='Voucher Code' 
                                                className='w-full px-3 py-2 border rounded focus:ring-1 focus:ring-green-500 outline-none text-sm'
                                            />
                                            <button className='px-4 py-2 bg-slate-800 text-white rounded text-sm hover:bg-black transition'>Apply</button>
                                        </div>
                                    </div>
                                    <div className='flex justify-between font-bold text-lg border-t pt-4 mt-2'>
                                        <span>Total</span>
                                        <span className='text-green-600'>${(price + shipping_fee).toFixed(2)}</span>
                                    </div>
                                    <button 
                                        onClick={redirect} 
                                        className='w-full mt-4 py-3 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 transition shadow-lg active:scale-95'
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Card;
                    
