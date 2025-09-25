import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useSearchParams } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import { AiFillStar } from 'react-icons/ai';
import { CiStar } from 'react-icons/ci';
import { BsFillGridFill } from 'react-icons/bs';
import { FaThList } from 'react-icons/fa';
import { Range } from 'react-range';
import { useDispatch, useSelector } from 'react-redux';
import ShopProducts from '../components/products/ShopProducts';
import Products from '../components/products/Products';
import Pagination from '../components/Pagination';
import { price_range_product, query_products } from '../store/reducers/homeReducer';

const CategoryShop = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  const dispatch = useDispatch();
  const { products, latest_product, totalProduct, parPage, priceRange } = useSelector(state => state.home);

  const [filterOpen, setFilterOpen] = useState(true);
  const [state, setState] = useState({ values: [priceRange.low, priceRange.high] });
  const [rating, setRating] = useState('');
  const [viewStyle, setViewStyle] = useState('grid');
  const [pageNumber, setPageNumber] = useState(1);
  const [sortPrice, setSortPrice] = useState('');

  useEffect(() => {
    dispatch(price_range_product());
  }, [dispatch]);

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
        pageNumber
      })
    );
  }, [state.values, category, rating, sortPrice, pageNumber, dispatch]);

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
    <div className="bg-gray-100 min-h-screen">
      <Header />

      {/* Banner */}
      <section
        className="relative h-[220px] bg-cover bg-no-repeat bg-left"
        style={{ backgroundImage: 'url("http://localhost:3000/images/banner/shop.png")' }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white">
          <h2 className="text-3xl font-bold">Category Page</h2>
          <div className="flex items-center gap-2 text-lg mt-2">
            <Link to="/" className="hover:underline">Home</Link>
            <IoIosArrowForward className="text-xl" />
            <span>{category || 'Category'}</span>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-16">
        <div className="w-[90%] max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <div className={`w-full lg:w-1/4 transition-all ${filterOpen ? 'h-auto' : 'h-0 overflow-hidden'}`}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="lg:hidden w-full bg-indigo-500 text-white py-2 mb-4 rounded hover:bg-indigo-600 transition"
            >
              {filterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>

            <div className="bg-white p-5 rounded shadow-md flex flex-col gap-6">
              {/* Price Filter */}
              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Price</h3>
                <Range
                  step={5}
                  min={priceRange.low}
                  max={priceRange.high}
                  values={state.values}
                  onChange={(values) => setState({ values })}
                  renderTrack={({ props, children }) => (
                    <div {...props} className="h-2 w-full bg-gray-300 rounded-full">{children}</div>
                  )}
                  renderThumb={({ props }) => (
                    <div {...props} className="w-4 h-4 bg-green-600 rounded-full" />
                  )}
                />
                <div className="mt-2 text-gray-800 font-semibold">
                  ${Math.floor(state.values[0])} - ${Math.floor(state.values[1])}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Rating</h3>
                <div className="flex flex-col gap-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div
                      key={star}
                      onClick={() => setRating(star)}
                      className="flex items-center gap-1 text-orange-500 cursor-pointer hover:text-orange-600 transition"
                    >
                      {Array.from({ length: 5 }, (_, i) => i < star ? <AiFillStar key={i}/> : <CiStar key={i}/>)}
                    </div>
                  ))}
                  <button onClick={resetRating} className="text-gray-500 text-sm underline mt-2">Reset Rating</button>
                </div>
              </div>

              {/* Latest Products (mobile) */}
              <div className="block lg:hidden">
                <Products title="Latest Products" products={latest_product} />
              </div>
            </div>
          </div>

          {/* Product Listing */}
          <div className="flex-1">
            <div className="bg-white p-4 mb-6 rounded flex flex-col md:flex-row md:justify-between items-start md:items-center border shadow-sm">
              <span className="font-medium text-gray-700">({totalProduct}) Products</span>
              <div className="flex items-center gap-3 mt-2 md:mt-0">
                <select
                  onChange={(e) => setSortPrice(e.target.value)}
                  className="p-1 border rounded text-gray-700 outline-none"
                >
                  <option value="">Sort By</option>
                  <option value="low-to-high">Low to High Price</option>
                  <option value="high-to-low">High to Low Price</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewStyle('grid')}
                    className={`p-2 rounded hover:bg-gray-200 transition ${viewStyle === 'grid' ? 'bg-gray-200' : ''}`}
                  >
                    <BsFillGridFill />
                  </button>
                  <button
                    onClick={() => setViewStyle('list')}
                    className={`p-2 rounded hover:bg-gray-200 transition ${viewStyle === 'list' ? 'bg-gray-200' : ''}`}
                  >
                    <FaThList />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            <ShopProducts products={products} styles={viewStyle} />

            {/* Pagination */}
            {totalProduct > parPage && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  totalItem={totalProduct}
                  parPage={parPage}
                  showItem={Math.ceil(totalProduct / parPage)}
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

export default CategoryShop;
