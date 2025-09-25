import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useSearchParams } from 'react-router-dom';
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

const SearchProducts = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    const searchValue = searchParams.get('value');

    const dispatch = useDispatch();
    const { products, priceRange, latest_product, totalProduct, parPage } = useSelector(state => state.home);

    const [filter, setFilter] = useState(true);
    const [state, setState] = useState({ values: [priceRange.low, priceRange.high] });
    const [rating, setRating] = useState('');
    const [styles, setStyles] = useState('grid');
    const [pageNumber, setPageNumber] = useState(1);
    const [sortPrice, setSortPrice] = useState('');

    useEffect(() => {
        dispatch(price_range_product());
    }, []);

    useEffect(() => {
        setState({ values: [priceRange.low, priceRange.high] });
    }, [priceRange]);

    useEffect(() => {
        dispatch(
            query_products({
                low: state.values[0] || '',
                high: state.values[1] || '',
                category,
                rating,
                sortPrice,
                pageNumber,
                searchValue
            })
        );
    }, [state.values[0], state.values[1], category, rating, sortPrice, searchValue, pageNumber]);

    const resetRating = () => {
        setRating('');
        dispatch(
            query_products({
                low: state.values[0],
                high: state.values[1],
                category,
                rating: '',
                sortPrice,
                pageNumber
            })
        );
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            {/* Banner Section */}
            <section className="relative h-[220px] bg-cover bg-no-repeat bg-left mt-6" style={{ backgroundImage: 'url(/images/banner/shop.png)' }}>
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h2 className="text-3xl md:text-4xl font-bold">Category Page</h2>
                        <div className="flex justify-center items-center gap-2 text-lg md:text-xl mt-2">
                            <Link to="/" className="hover:text-indigo-500 transition-colors">Home</Link>
                            <IoIosArrowForward className="mt-1" />
                            <span>Category</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="py-16 w-[90%] max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8">
                {/* Filter Sidebar */}
                <aside className={`transition-all duration-500 ${filter ? 'hidden lg:block w-1/4' : 'w-full lg:w-1/4'}`}>
                    <button onClick={() => setFilter(!filter)} className="lg:hidden w-full py-2 mb-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Filter Products</button>

                    <div className="bg-white p-5 rounded-md shadow-md flex flex-col gap-6">
                        {/* Price Filter */}
                        <div>
                            <h3 className="text-xl font-semibold text-slate-700 mb-3">Price</h3>
                            <Range
                                step={5}
                                min={priceRange.low}
                                max={priceRange.high}
                                values={state.values}
                                onChange={(values) => setState({ values })}
                                renderTrack={({ props, children }) => (
                                    <div {...props} className="w-full h-2 bg-gray-300 rounded-full relative">{children}</div>
                                )}
                                renderThumb={({ props }) => (
                                    <div {...props} className="h-5 w-5 bg-green-500 rounded-full shadow-lg" />
                                )}
                            />
                            <div className="mt-2 text-slate-800 font-semibold">${Math.floor(state.values[0])} - ${Math.floor(state.values[1])}</div>
                        </div>

                        {/* Rating Filter */}
                        <div>
                            <h3 className="text-xl font-semibold text-slate-700 mb-3">Rating</h3>
                            <div className="flex flex-col gap-2">
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <div key={star} onClick={() => setRating(star)} className="flex items-center gap-1 cursor-pointer text-orange-500 hover:scale-105 transition-transform">
                                        {[...Array(5)].map((_, i) => i < star ? <AiFillStar key={i} /> : <CiStar key={i} />)}
                                    </div>
                                ))}
                                <div onClick={resetRating} className="flex items-center gap-1 cursor-pointer text-gray-400 hover:scale-105 transition-transform">
                                    {[...Array(5)].map((_, i) => <CiStar key={i} />)}
                                </div>
                            </div>
                        </div>

                        {/* Latest Products */}
                        <div className="lg:hidden">
                            <Products title="Latest Products" products={latest_product} />
                        </div>
                    </div>
                </aside>

                {/* Products List */}
                <main className="flex-1 flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-md shadow-md border">
                        <h3 className="font-semibold text-slate-700">({totalProduct}) Products</h3>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-2 md:mt-0">
                            <select onChange={(e) => setSortPrice(e.target.value)} className="border p-2 rounded-md text-slate-600 font-medium outline-none hover:border-indigo-500 transition-colors">
                                <option value="">Sort By</option>
                                <option value="low-to-high">Low to High Price</option>
                                <option value="high-to-low">High to Low Price</option>
                            </select>

                            {/* Toggle Grid/List */}
                            <div className="flex gap-2">
                                <div onClick={() => setStyles('grid')} className={`p-2 rounded-md cursor-pointer hover:bg-gray-200 transition-colors ${styles === 'grid' ? 'bg-gray-300' : ''}`}>
                                    <BsFillGridFill size={20} />
                                </div>
                                <div onClick={() => setStyles('list')} className={`p-2 rounded-md cursor-pointer hover:bg-gray-200 transition-colors ${styles === 'list' ? 'bg-gray-300' : ''}`}>
                                    <FaThList size={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-500">
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
            </section>

            <Footer />
        </div>
    );
};

export default SearchProducts;
