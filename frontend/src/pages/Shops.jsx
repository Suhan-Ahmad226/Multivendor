import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { Range } from 'react-range';
import { AiFillStar } from 'react-icons/ai';
import { CiStar } from 'react-icons/ci';
import Products from '../components/products/Products';
import { BsFillGridFill } from 'react-icons/bs';
import { FaThList } from 'react-icons/fa';
import ShopProducts from '../components/products/ShopProducts';
import Pagination from '../components/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { price_range_product, query_products } from '../store/reducers/homeReducer';

const Shops = () => {
    const dispatch = useDispatch();
    const { products, categorys, priceRange, latest_product, totalProduct, parPage } = useSelector(state => state.home);

    const [filter, setFilter] = useState(true);
    const [state, setState] = useState({ values: [priceRange.low, priceRange.high] });
    const [rating, setRating] = useState('');
    const [styles, setStyles] = useState('grid');
    const [pageNumber, setPageNumber] = useState(1);
    const [sortPrice, setSortPrice] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => { 
        dispatch(price_range_product());
    }, []);

    useEffect(() => { 
        setState({ values: [priceRange.low, priceRange.high] });
    }, [priceRange]);

    const queryCategory = (e, value) => {
        if (e.target.checked) setCategory(value);
        else setCategory('');
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
    }, [state.values[0], state.values[1], category, rating, sortPrice, pageNumber]);

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
        <div className='bg-gray-50'>
            <Header />

            {/* Banner Section */}
            <section className='relative h-[220px] mt-6 bg-cover bg-no-repeat bg-left' style={{ backgroundImage: 'url("/images/banner/shop.png")' }}>
                <div className='absolute inset-0 bg-black/60 flex justify-center items-center'>
                    <div className='text-center text-white'>
                        <h2 className='text-3xl md:text-4xl font-bold mb-2'>Shop Page</h2>
                        <div className='flex justify-center items-center gap-2 text-lg md:text-xl'>
                            <Link to='/' className='hover:underline'>Home</Link>
                            <IoIosArrowForward />
                            <span>Shop</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Shop Content */}
            <section className='py-16'>
                <div className='w-[90%] md:w-[85%] mx-auto flex flex-col md:flex-row gap-8'>
                    
                    {/* Sidebar Filter */}
                    <aside className={`md:w-1/4 bg-white p-5 rounded-md shadow-lg transition-all duration-300 ${filter ? 'max-h-[1000px]' : 'max-h-0 overflow-hidden'}`}>
                        <button onClick={() => setFilter(!filter)} className='md:hidden mb-5 w-full py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors'>
                            {filter ? 'Hide Filters' : 'Show Filters'}
                        </button>

                        {/* Category */}
                        <div className='mb-6'>
                            <h3 className='text-xl font-semibold text-slate-700 mb-3'>Category</h3>
                            {categorys.map((c, i) => (
                                <label key={i} className='flex items-center gap-2 mb-2 cursor-pointer'>
                                    <input 
                                        type="checkbox" 
                                        checked={category === c.name} 
                                        onChange={(e) => queryCategory(e, c.name)} 
                                        className='accent-indigo-500'
                                    />
                                    <span className='text-slate-700'>{c.name}</span>
                                </label>
                            ))}
                        </div>

                        {/* Price Range */}
                        <div className='mb-6'>
                            <h3 className='text-xl font-semibold text-slate-700 mb-3'>Price</h3>
                            <Range
                                step={5}
                                min={priceRange.low}
                                max={priceRange.high}
                                values={state.values}
                                onChange={(values) => setState({ values })}
                                renderTrack={({ props, children }) => (
                                    <div {...props} className='w-full h-2 bg-gray-300 rounded-lg'>
                                        {children}
                                    </div>
                                )}
                                renderThumb={({ props }) => (
                                    <div {...props} className='w-5 h-5 bg-indigo-500 rounded-full shadow-md'></div>
                                )}
                            />
                            <div className='mt-2 font-semibold text-slate-800'>
                                ${Math.floor(state.values[0])} - ${Math.floor(state.values[1])}
                            </div>
                        </div>

                        {/* Rating */}
                        <div className='mb-6'>
                            <h3 className='text-xl font-semibold text-slate-700 mb-3'>Rating</h3>
                            <div className='flex flex-col gap-2'>
                                {[5,4,3,2,1,0].map((r) => (
                                    <div 
                                        key={r} 
                                        onClick={r===0 ? resetRating : () => setRating(r)}
                                        className='flex items-center gap-1 cursor-pointer text-orange-500 hover:text-orange-600 transition-colors'
                                    >
                                        {Array.from({length: 5}).map((_, i) => (
                                            i < r ? <AiFillStar key={i}/> : <CiStar key={i}/>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Latest Product (Mobile) */}
                        <div className='md:hidden mt-6'>
                            <Products title='Latest Product' products={latest_product} />
                        </div>
                    </aside>

                    {/* Main Product Area */}
                    <main className='md:w-3/4 flex flex-col gap-5'>
                        {/* Sorting & View Toggle */}
                        <div className='flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-md shadow-md'>
                            <span className='text-slate-600 font-medium'>({totalProduct}) Products</span>
                            <div className='flex items-center gap-3 mt-3 md:mt-0'>
                                <select 
                                    onChange={(e) => setSortPrice(e.target.value)} 
                                    className='border p-2 rounded-md outline-none text-slate-600 font-semibold'
                                >
                                    <option value="">Sort By</option>
                                    <option value="low-to-high">Low to High Price</option>
                                    <option value="high-to-low">High to Low Price</option>
                                </select>
                                <div className='flex gap-2'>
                                    <div 
                                        onClick={() => setStyles('grid')} 
                                        className={`p-2 rounded-md cursor-pointer transition-colors ${styles === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                    >
                                        <BsFillGridFill />
                                    </div>
                                    <div 
                                        onClick={() => setStyles('list')} 
                                        className={`p-2 rounded-md cursor-pointer transition-colors ${styles === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                    >
                                        <FaThList />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        <div>
                            <ShopProducts products={products} styles={styles} />
                        </div>

                        {/* Pagination */}
                        {totalProduct > parPage && (
                            <Pagination 
                                pageNumber={pageNumber} 
                                setPageNumber={setPageNumber} 
                                totalItem={totalProduct} 
                                parPage={parPage} 
                                showItem={Math.floor(totalProduct / parPage)}
                            />
                        )}
                    </main>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Shops;
