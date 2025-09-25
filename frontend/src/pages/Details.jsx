Import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io"; 
import Carousel from 'react-multi-carousel'; 
import 'react-multi-carousel/lib/styles.css';
import Rating from '../components/Rating';
import { FaHeart } from "react-icons/fa6";
import { FaFacebookF, FaLinkedin } from "react-icons/fa";
import { FaTwitter, FaGithub } from "react-icons/fa6";
import Reviews from '../components/Reviews';
import { Pagination } from 'swiper/modules';
import 'swiper/css'; 
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';
import { product_details } from '../store/reducers/homeReducer';
import toast from 'react-hot-toast';
import { add_to_card, messageClear, add_to_wishlist } from '../store/reducers/cardReducer';

const Details = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { product, relatedProducts, moreProducts } = useSelector(state => state.home);
  const { userInfo } = useSelector(state => state.auth);
  const { errorMessage, successMessage } = useSelector(state => state.card);

  const [image, setImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('reviews');

  useEffect(() => { dispatch(product_details(slug)); }, [slug]);
  useEffect(() => { 
    if (successMessage) { toast.success(successMessage); dispatch(messageClear()); } 
    if (errorMessage) { toast.error(errorMessage); dispatch(messageClear()); }
  }, [successMessage, errorMessage]);

  const inc = () => { if(quantity < product.stock) setQuantity(quantity+1); else toast.error('Out of Stock'); };
  const dec = () => { if(quantity > 1) setQuantity(quantity-1); };

  const add_card = () => {
    if(userInfo) dispatch(add_to_card({ userId: userInfo.id, quantity, productId: product._id }));
    else navigate('/login');
  };

  const add_wishlist = () => {
    if(userInfo) dispatch(add_to_wishlist({ userId: userInfo.id, productId: product._id, name: product.name, price: product.price, image: product.images[0], discount: product.discount, rating: product.rating, slug: product.slug }));
    else navigate('/login');
  };

  const buynow = () => {
    let price = product.discount ? product.price - Math.floor((product.price * product.discount)/100) : product.price;
    const obj = [{ sellerId: product.sellerId, shopName: product.shopName, price: quantity*price, products:[{quantity, productInfo: product}]}];
    navigate('/shipping', { state: { products: obj, price: price*quantity, shipping_fee: 50, items: 1 } });
  };

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 4 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
  };

  return (
    <div>
      <Header />
      {/* Banner */}
      <section className='bg-[url("http://localhost:3000/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a] flex justify-center items-center'>
          <div className='text-white text-center'>
            <h2 className='text-3xl font-bold'>Product Details</h2>
            <div className='flex justify-center items-center gap-2 text-xl mt-2'>
              <Link to='/'>Home</Link> <IoIosArrowForward /> <span>{product.name}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Product Section */}
      <section className='w-[85%] md:w-[90%] mx-auto py-10 grid grid-cols-2 gap-10 md:grid-cols-1'>
        {/* Left: Images */}
        <div>
          <div className='border p-5'>
            <img className='w-full h-[400px] object-cover' src={image || product.images?.[0]} alt="" />
          </div>
          {product.images && (
            <Carousel responsive={responsive} infinite autoPlay transitionDuration={500}>
              {product.images.map((img,i) => (
                <div key={i} onClick={()=>setImage(img)} className='p-1 cursor-pointer'>
                  <img className='h-[120px] object-cover w-full' src={img} alt="" />
                </div>
              ))}
            </Carousel>
          )}
        </div>

        {/* Right: Details */}
        <div className='flex flex-col gap-5'>
          <h2 className='text-3xl font-bold text-slate-700'>{product.name}</h2>
          <div className='flex gap-4 items-center'>
            <Rating ratings={product.rating || 4.5} />
            <span className='text-green-500'>(24 reviews)</span>
          </div>
          <div className='text-2xl font-bold text-red-500 flex gap-3'>
            {product.discount ? <>
              <span className='line-through text-slate-500'>${product.price}</span>
              <span>${product.price - Math.floor((product.price*product.discount)/100)} (-{product.discount}%)</span>
            </> : <span>${product.price}</span>}
          </div>
          <p className='text-slate-600'>{product.description}</p>
          <p className='font-bold text-slate-600'>Shop Name: {product.shopName}</p>

          {/* Quantity + Cart */}
          {product.stock && (
            <div className='flex gap-3 items-center border-b pb-4'>
              <div className='flex bg-slate-200 h-[50px]'>
                <div onClick={dec} className='px-6 cursor-pointer select-none'>-</div>
                <div className='px-6'>{quantity}</div>
                <div onClick={inc} className='px-6 cursor-pointer select-none'>+</div>
              </div>
              <button onClick={add_card} className='px-6 py-2 bg-[#059473] hover:bg-[#04735a] text-white rounded shadow transition'>Add To Cart</button>
              <div onClick={add_wishlist} className='w-[50px] h-[50px] flex justify-center items-center bg-cyan-500 hover:bg-cyan-600 text-white rounded cursor-pointer'>
                <FaHeart />
              </div>
            </div>
          )}

          {/* Buy Now + Chat */}
          <div className='flex gap-3 mt-4 flex-wrap'>
            {product.stock && <button onClick={buynow} className='px-6 py-2 bg-green-700 hover:bg-green-800 text-white rounded shadow transition'>Buy Now</button>}
            <Link to={`/dashboard/chat/${product.sellerId}`} className='px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow transition'>Chat Seller</Link>
          </div>

          {/* Social Share */}
          <div className='flex gap-3 mt-5'>
            {[FaFacebookF, FaTwitter, FaLinkedin, FaGithub].map((Icon,i)=>(
              <a key={i} href="#" className='w-10 h-10 flex justify-center items-center rounded-full bg-indigo-500 hover:bg-[#059473] text-white transition'>
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className='w-[85%] md:w-[90%] mx-auto py-10'>
        <div className='flex gap-2 flex-wrap mb-4'>
          <button onClick={()=>setTab('reviews')} className={`py-1 px-5 rounded ${tab==='reviews'?'bg-[#059473] text-white':'bg-slate-200 text-slate-700'}`}>Reviews</button>
          <button onClick={()=>setTab('description')} className={`py-1 px-5 rounded ${tab==='description'?'bg-[#059473] text-white':'bg-slate-200 text-slate-700'}`}>Description</button>
        </div>
        <div>
          {tab==='reviews' ? <Reviews product={product} /> : <p className='text-slate-600'>{product.description}</p>}
        </div>
      </section>

      {/* More Products */}
      <section className='w-[85%] md:w-[90%] mx-auto py-10'>
        <h2 className='text-2xl font-bold text-slate-700 mb-4'>From {product.shopName}</h2>
        <div className='grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5'>
          {moreProducts.map((p,i)=>(
            <Link key={i} className='border rounded overflow-hidden hover:shadow-lg transition'>
              <div className='relative h-[250px]'>
                <img className='w-full h-full object-cover' src={p.images[0]} alt="" />
                {p.discount!==0 && <div className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold w-8 h-8 flex justify-center items-center rounded-full'>{p.discount}%</div>}
              </div>
              <div className='p-2'>
                <h3 className='text-slate-700 font-bold'>{p.name}</h3>
                <div className='flex items-center justify-between mt-1'>
                  <span className='font-bold text-slate-700'>${p.price}</span>
                  <Rating ratings={p.rating} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Related Products */}
      <section className='w-[85%] md:w-[90%] mx-auto py-10'>
        <h2 className='text-2xl font-bold text-slate-700 mb-4'>Related Products</h2>
        <Swiper
          slidesPerView={'auto'}
          breakpoints={{
            1280: { slidesPerView: 3 },
            768: { slidesPerView: 2 },
            0: { slidesPerView: 1 },
          }}
          spaceBetween={20}
          loop={true}
          pagination={{ clickable: true, el: '.custom_bullet' }}
          modules={[Pagination]}
          className='mySwiper'
        >
          {relatedProducts.map((p, i) => (
            <SwiperSlide key={i} className='cursor-pointer'>
              <Link className='block border rounded overflow-hidden hover:shadow-lg transition'>
                <div className='relative h-[250px]'>
                  <img className='w-full h-full object-cover' src={p.images[0]} alt={p.name} />
                  {p.discount !== 0 && (
                    <div className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold w-8 h-8 flex justify-center items-center rounded-full'>
                      {p.discount}%
                    </div>
                  )}
                  <div className='absolute top-0 left-0 w-full h-full bg-black opacity-0 hover:opacity-25 transition-all duration-300'></div>
                </div>
                <div className='p-3 flex flex-col gap-1'>
                  <h3 className='text-slate-700 font-bold'>{p.name}</h3>
                  <div className='flex items-center justify-between mt-1'>
                    <span className='font-bold text-slate-700'>${p.price}</span>
                    <Rating ratings={p.rating} />
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className='w-full flex justify-center items-center py-5'>
          <div className='custom_bullet flex justify-center gap-3 !w-auto'></div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Details;
