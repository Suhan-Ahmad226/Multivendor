import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { Range } from 'react-range';
import { AiFillStar, AiOutlineHeart } from 'react-icons/ai';
import { CiStar } from 'react-icons/ci';
import { BsFillGridFill } from 'react-icons/bs';
import { FaThList, FaEye, FaShoppingCart } from 'react-icons/fa';
import Products from '../components/products/Products';
import ShopProducts from '../components/products/ShopProducts';
import Pagination from '../components/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { price_range_product, query_products } from '../store/reducers/homeReducer';

const Shops = () => {
    const dispatch = useDispatch();
    const { products, categorys, priceRange, latest_product, totalProduct, parPage } = useSelector(state => state.home);

    const [filter, setFilter] = useState(true);
    const [state, setState] = useState({ values: [0, 0] });
    const [rating, setRating] = useState('');
    const [styles, setStyles] = useState('grid');
    const [pageNumber, setPageNumber] = useState(1);
    const [sortPrice, setSortPrice] = useState('');
    const [category, setCategory] = useState('');

    // Load price range
    useEffect(() => { 
        dispatch(price_range_product());
    }, [dispatch]);

    useEffect(() => { 
        setState({ values: [priceRange.low, priceRange.high] });
    }, [priceRange]);

    const queryCategory = (e, value) => {
        setCategory(e.target.checked ? value : '');
    };

    useEffect(() => { 
        dispatch(query_products({
            low: state.values[0],
            high: state.values[1],
            category,
            rating,
            sortPrice,
            pageNumber
        }));
    }, [state.values, category, rating, sortPrice, pageNumber, dispatch]);

    const resetRating = () => {
        setRating('');
        dispatch(query_products({
            low: state.values[0],
            high: state.values[1],
            category,
            rating: '',
            sortPrice,
            pageNumber
        }));
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            {/* Banner */}
            <section className='relative h-[220px] bg-cover bg-no-repeat bg-left mt-6' style={{ backgroundImage: 'url("/images/banner/shop.png")' }}>
                <div className='absolute inset-0 bg-black/60 flex items-center justify-center'>
                    <div className='text-center text-white'>
                        <h2 className='text-3xl md:text-4xl font-bold'>Shop Page</h2>
                        <div className='flex justify-center items-center gap-2 text-lg md:text-xl mt-2'>
                            <Link to="/" className='hover:text-indigo-400 transition-colors'>Home</Link>
                            <IoIosArrowForward className='mt-1' />
                            <span>Shop</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Shop Content */}
            <section className='py-16'>
                <div className='w-[90%] max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8'>

                    {/* Sidebar Filter */}
                    <div className={`lg:w-1/4 w-full transition-all duration-300 ${filter ? 'h-auto opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
                        <div className='bg-white p-5 rounded-md shadow-md flex flex-col gap-6'>

                            {/* Category Filter */}
                            <div>
                                <h2 className='text-xl font-bold text-slate-600 mb-3'>Category</h2>
                                <div className='flex flex-col gap-2'>
                                    {categorys.map((c, i) => (
                                        <label key={i} className='flex items-center gap-2 cursor-pointer text-slate-700'>
                                            <input type="checkbox" checked={category === c.name} onChange={(e) => queryCategory(e, c.name)} />
                                            {c.name}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div>
                                <h2 className='text-xl font-bold text-slate-600 mb-3'>Price</h2>
                                <Range
                                    step={5}
                                    min={priceRange.low}
                                    max={priceRange.high}
                                    values={state.values}
                                    onChange={(values) => setState({ values })}
                                    renderTrack={({ props, children }) => (
                                        <div {...props} className='w-full h-2 bg-slate-200 rounded-full cursor-pointer'>
                                            {children}
                                        </div>
                                    )}
                                    renderThumb={({ props }) => (
                                        <div {...props} className='w-5 h-5 bg-green-600 rounded-full shadow-lg' />
                                    )}
                                />
                                <div className='mt-2 text-slate-700 font-semibold'>
                                    ${Math.floor(state.values[0])} - ${Math.floor(state.values[1])}
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div>
                                <h2 className='text-xl font-bold text-slate-600 mb-3'>Rating</h2>
                                <div className='flex flex-col gap-2'>
                                    {[5,4,3,2,1].map((r) => (
                                        <div key={r} onClick={() => setRating(r)} className='flex items-center gap-1 cursor-pointer text-orange-500'>
                                            {Array.from({length:5}, (_,i) => i < r ? <AiFillStar key={i}/> : <CiStar key={i}/> )}
                                        </div>
                                    ))}
                                    <div onClick={resetRating} className='flex items-center gap-1 cursor-pointer text-gray-400'>
                                        {Array.from({length:5}, (_,i) => <CiStar key={i}/> )}
                                    </div>
                                </div>
                            </div>

                            {/* Latest Products (mobile only) */}
                            <div className='md:hidden'>
                                <Products title='Latest Products' products={latest_product} />
                            </div>

                        </div>
                    </div>

                    {/* Main Products */}
                    <div className='flex-1'>
                        <div className='flex justify-between items-center mb-4 flex-wrap gap-4'>
                            <h2 className='text-lg font-semibold text-slate-600'>({totalProduct}) Products</h2>
                            <div className='flex items-center gap-4 flex-wrap'>
                                <select onChange={(e)=>setSortPrice(e.target.value)} className='p-1 border outline-none text-slate-700 font-semibold'>
                                    <option value="">Sort By</option>
                                    <option value="low-to-high">Low to High Price</option>
                                    <option value="high-to-low">High to Low Price</option>
                                </select>
                                <div className='flex gap-2'>
                                    <div onClick={()=> setStyles('grid')} className={`p-2 cursor-pointer rounded ${styles==='grid' ? 'bg-slate-300' : 'hover:bg-slate-200'}`}><BsFillGridFill/></div>
                                    <div onClick={()=> setStyles('list')} className={`p-2 cursor-pointer rounded ${styles==='list' ? 'bg-slate-300' : 'hover:bg-slate-200'}`}><FaThList/></div>
                                </div>
                                <button onClick={()=>setFilter(!filter)} className='lg:hidden bg-indigo-500 text-white px-3 py-1 rounded'>Filter</button>
                            </div>
                        </div>

                        <div className={styles==='grid' ? 'grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6' : 'flex flex-col gap-6'}>
                            {products.map((p, i) => (
                                <div key={i} className='bg-white rounded-md shadow-md overflow-hidden relative group'>
                                    {p.discount > 0 && <span className='absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded'>-{p.discount}%</span>}
                                    {p.isNew && <span className='absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded'>New</span>}

                                    <div className='relative'>
                                        <img src={p.images[0]} alt={p.name} className='w-full h-60 object-cover transition-transform group-hover:scale-105'/>
                                        <div className='absolute inset-0 flex justify-center items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20'>
                                            <FaEye className='text-white text-lg cursor-pointer'/>
                                            <FaShoppingCart className='text-white text-lg cursor-pointer'/>
                                            <AiOutlineHeart className='text-white text-lg cursor-pointer'/>
                                        </div>
                                    </div>

                                    <div className='p-4'>
                                        <h3 className='text-md font-semibold text-slate-700 mb-1'>{p.name}</h3>
                                        <p className='text-sm text-slate-500 mb-2'>Brand: {p.brand}</p>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-lg font-bold text-orange-500'>${p.price - Math.floor((p.price*p.discount)/100)}</span>
                                            {p.discount>0 && <span className='line-through text-sm text-gray-400'>${p.price}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalProduct > parPage && (
                            <div className='mt-6'>
                                <Pagination 
                                    pageNumber={pageNumber} 
                                    setPageNumber={setPageNumber} 
                                    totalItem={totalProduct} 
                                    parPage={parPage} 
                                    showItem={Math.ceil(totalProduct/parPage)} 
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Shops;
