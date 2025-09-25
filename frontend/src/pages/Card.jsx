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
    const { userInfo } = useSelector(state => state.auth);
    const { 
        card_products,
        successMessage,
        price,
        buy_product_item,
        shipping_fee,
        outofstock_products 
    } = useSelector(state => state.card);

    const navigate = useNavigate();

    useEffect(() => {
        if(userInfo?.id) dispatch(get_card_products(userInfo.id));
    }, [userInfo]);

    useEffect(() => {
        if(successMessage){
            toast.success(successMessage);
            dispatch(messageClear());
            dispatch(get_card_products(userInfo.id));
        }
    }, [successMessage]);

    const redirect = () => {
        navigate('/shipping', {
            state: {
                products: card_products,
                price,
                shipping_fee,
                items: buy_product_item
            }
        });
    };

    const inc = (quantity, stock, card_id) => {
        if(quantity + 1 <= stock) dispatch(quantity_inc(card_id));
    };
    const dec = (quantity, card_id) => {
        if(quantity - 1 > 0) dispatch(quantity_dec(card_id));
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header/>

            {/* Banner */}
            <section className='relative h-[220px] bg-cover bg-no-repeat bg-left' style={{backgroundImage:'url("http://localhost:3000/images/banner/shop.png")'}}>
                <div className='absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white'>
                    <h2 className='text-3xl font-bold'>Card Page</h2>
                    <div className='flex items-center gap-2 text-lg mt-2'>
                        <Link to='/' className='hover:underline'>Home</Link>
                        <IoIosArrowForward className='text-xl'/>
                        <span>Card</span>
                    </div>
                </div>
            </section>

            <section className='py-16'>
                <div className='w-[90%] max-w-7xl mx-auto flex flex-col lg:flex-row gap-8'>

                    {/* Card Items */}
                    <div className='flex-1 flex flex-col gap-6'>
                        { (card_products.length > 0 || outofstock_products.length > 0) ? (
                            <>
                                {/* Stock Products */}
                                {card_products.length > 0 && (
                                    <div className='bg-white shadow-md rounded-lg overflow-hidden'>
                                        <div className='p-4 border-b'>
                                            <h2 className='text-green-600 font-semibold'>Stock Products ({card_products.length})</h2>
                                        </div>
                                        <div className='flex flex-col gap-4 p-4'>
                                            {card_products.map((p, i) => (
                                                <div key={i} className='flex flex-col gap-3 border-b pb-3'>
                                                    <h3 className='font-bold text-gray-700'>{p.shopName}</h3>
                                                    {p.products.map((pt, j) => (
                                                        <div key={j} className='flex flex-col sm:flex-row justify-between items-center gap-4'>
                                                            <div className='flex items-center gap-4'>
                                                                <img className='w-20 h-20 object-cover rounded' src={pt.productInfo.images[0]} alt={pt.productInfo.name} />
                                                                <div className='text-gray-600'>
                                                                    <h4 className='font-semibold'>{pt.productInfo.name}</h4>
                                                                    <p className='text-sm'>Brand: {pt.productInfo.brand}</p>
                                                                </div>
                                                            </div>
                                                            <div className='flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto justify-between'>
                                                                <div>
                                                                    <h4 className='text-lg text-orange-500 font-semibold'>
                                                                        ${pt.productInfo.price - Math.floor((pt.productInfo.price * pt.productInfo.discount)/100)}
                                                                    </h4>
                                                                    <p className='line-through text-gray-400 text-sm'>${pt.productInfo.price}</p>
                                                                    <p className='text-sm text-red-500'>-{pt.productInfo.discount}%</p>
                                                                </div>
                                                                <div className='flex flex-col gap-2 items-center'>
                                                                    <div className='flex items-center bg-gray-200 rounded'>
                                                                        <button onClick={() => dec(pt.quantity, pt._id)} className='px-3 py-1 hover:bg-gray-300 transition'>-</button>
                                                                        <span className='px-3'>{pt.quantity}</span>
                                                                        <button onClick={() => inc(pt.quantity, pt.productInfo.stock, pt._id)} className='px-3 py-1 hover:bg-gray-300 transition'>+</button>
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => dispatch(delete_card_product(pt._id))} 
                                                                        className='px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition'
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Out of Stock */}
                                {outofstock_products.length > 0 && (
                                    <div className='bg-white shadow-md rounded-lg overflow-hidden'>
                                        <div className='p-4 border-b'>
                                            <h2 className='text-red-500 font-semibold'>Out of Stock ({outofstock_products.length})</h2>
                                        </div>
                                        <div className='flex flex-col gap-4 p-4'>
                                            {outofstock_products.map((p, i) => (
                                                <div key={i} className='flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-3'>
                                                    <div className='flex items-center gap-4'>
                                                        <img className='w-20 h-20 object-cover rounded' src={p.products[0].images[0]} alt={p.products[0].name}/>
                                                        <div className='text-gray-600'>
                                                            <h4 className='font-semibold'>{p.products[0].name}</h4>
                                                            <p className='text-sm'>Brand: {p.products[0].brand}</p>
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto justify-between'>
                                                        <div>
                                                            <h4 className='text-lg text-orange-500 font-semibold'>
                                                                ${p.products[0].price - Math.floor((p.products[0].price * p.products[0].discount)/100)}
                                                            </h4>
                                                            <p className='line-through text-gray-400 text-sm'>${p.products[0].price}</p>
                                                            <p className='text-sm text-red-500'>-{p.products[0].discount}%</p>
                                                        </div>
                                                        <div className='flex flex-col gap-2 items-center'>
                                                            <div className='flex items-center bg-gray-200 rounded'>
                                                                <button onClick={() => dec(p.quantity, p._id)} className='px-3 py-1 hover:bg-gray-300 transition'>-</button>
                                                                <span className='px-3'>{p.quantity}</span>
                                                                <button onClick={() => inc(p.quantity, p.products[0].stock, p._id)} className='px-3 py-1 hover:bg-gray-300 transition'>+</button>
                                                            </div>
                                                            <button 
                                                                onClick={() => dispatch(delete_card_product(p._id))} 
                                                                className='px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition'
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className='text-center py-20'>
                                <Link className='px-6 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition' to='/shops'>
                                    Shop Now
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    {card_products.length > 0 && (
                        <div className='w-full lg:w-1/3 flex-shrink-0'>
                            <div className='bg-white shadow-md rounded-lg p-6 flex flex-col gap-4'>
                                <h2 className='text-xl font-bold text-gray-700'>Order Summary</h2>
                                <div className='flex justify-between'>
                                    <span>{buy_product_item} Items</span>
                                    <span>${price}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Shipping Fee</span>
                                    <span>${shipping_fee}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <input 
                                        type="text" 
                                        placeholder='Input Voucher Coupon' 
                                        className='flex-1 px-3 py-2 border border-gray-300 rounded focus:border-green-500 outline-none transition'
                                    />
                                    <button className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition'>Apply</button>
                                </div>
                                <div className='flex justify-between font-semibold text-lg'>
                                    <span>Total</span>
                                    <span className='text-green-600'>${price + shipping_fee}</span>
                                </div>
                                <button 
                                    onClick={redirect} 
                                    className='px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition uppercase'
                                >
                                    Proceed to Checkout ({buy_product_item})
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer/>
        </div>
    );
};

export default Card;
