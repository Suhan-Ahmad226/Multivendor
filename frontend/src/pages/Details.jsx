import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Rating from '../components/Rating';
import { FaHeart } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import Reviews from '../components/Reviews';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';
import { product_details } from '../store/reducers/homeReducer';
import toast from 'react-hot-toast';
import { add_to_card, messageClear, add_to_wishlist } from '../store/reducers/cardReducer';

/**
 * Details.jsx
 * Final polished product details page:
 * - skeleton image loader (lazy)
 * - sticky mobile CTA (Add to Cart / Buy Now)
 * - animations, hover, responsive
 *
 * Notes:
 * - keeps existing Redux dispatches & navigation logic unchanged
 * - uses tailwind classes for styling
 */

/* inline SVG placeholder (data URI) used when there's no image or while loading */
const PLACEHOLDER_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600' preserveAspectRatio='none'>
      <rect width='100%' height='100%' fill='#e2e8f0' />
      <g fill='#cbd5e1'>
        <rect x='20' y='20' rx='8' ry='8' width='120' height='80' />
        <rect x='160' y='20' rx='8' ry='8' width='620' height='80' />
      </g>
    </svg>`
  );

const Details = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { product = {}, relatedProducts = [], moreProducts = [] } = useSelector((state) => state.home || {});
  const { userInfo } = useSelector((state) => state.auth || {});
  const { errorMessage, successMessage } = useSelector((state) => state.card || {});

  // local UI state
  const [image, setImage] = useState(''); // selected main image
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('reviews'); // 'reviews' | 'description'
  const [imagesLoaded, setImagesLoaded] = useState({}); // track loaded images (by src)
  const [mainImageLoaded, setMainImageLoaded] = useState(false);

  // Fetch product details on mount or slug change
  useEffect(() => {
    if (slug) dispatch(product_details(slug));
  }, [slug, dispatch]);

  // Toast handling for messages from redux slice
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  // reset image selection when product changes
  useEffect(() => {
    setImage(''); // ensure it defaults to first image via render
    setMainImageLoaded(false);
    setImagesLoaded({});
    setQuantity(1);
  }, [product._id]);

  // helpers for quantity
  const inc = () => {
    const stock = product?.stock || 0;
    if (quantity >= stock) {
      toast.error('Out of Stock');
    } else {
      setQuantity((q) => q + 1);
    }
  };
  const dec = () => {
    setQuantity((q) => (q > 1 ? q - 1 : q));
  };

  // cart / wishlist actions
  const add_card = () => {
    if (userInfo) {
      dispatch(
        add_to_card({
          userId: userInfo.id,
          quantity,
          productId: product._id,
        })
      );
    } else {
      navigate('/login');
    }
  };

  const add_wishlist = () => {
    if (userInfo) {
      dispatch(
        add_to_wishlist({
          userId: userInfo.id,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          discount: product.discount,
          rating: product.rating,
          slug: product.slug,
        })
      );
    } else {
      navigate('/login');
    }
  };

  const buynow = () => {
    const price = product.discount
      ? product.price - Math.floor((product.price * product.discount) / 100)
      : product.price;

    const obj = [
      {
        sellerId: product.sellerId,
        shopName: product.shopName,
        price: quantity * (price - Math.floor((price * 5) / 100)),
        products: [
          {
            quantity,
            productInfo: product,
          },
        ],
      },
    ];

    navigate('/shipping', {
      state: {
        products: obj,
        price: price * quantity,
        shipping_fee: 50,
        items: 1,
      },
    });
  };

  /* Carousel responsive settings */
  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 4 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
  };

  /* Image loader helpers */
  const onThumbLoad = (src) => {
    setImagesLoaded((prev) => ({ ...prev, [src]: true }));
  };
  const onMainImageLoad = () => setMainImageLoaded(true);

  /* compute price display */
  const displayPrice = (() => {
    if (!product || !product.price) return 0;
    if (product.discount) {
      const discounted = product.price - Math.floor((product.price * product.discount) / 100);
      return discounted;
    }
    return product.price;
  })();

  /* fallback src helper */
  const safeImg = (src) => src || PLACEHOLDER_SVG;

  /* Small helper for responsive sticky price (mobile bar) */
  const MobileStickyBar = () => {
    // show only on small screens (md:hidden)
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white border-t shadow-lg p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={safeImg(product.images?.[0])}
              alt={product.name}
              className="w-12 h-12 object-cover rounded"
              loading="lazy"
            />
            <div>
              <div className="text-sm text-slate-700 font-semibold line-clamp-1">{product.name}</div>
              <div className="text-sm text-green-600 font-bold">${displayPrice}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={add_card}
              className="px-4 py-2 bg-[#059473] text-white rounded-md hover:bg-[#04735a] transition"
            >
              Add
            </button>
            <button
              onClick={buynow}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* hero/banner */}
      <section
        className="relative h-[220px] mt-6 bg-cover bg-no-repeat bg-left"
        style={{ backgroundImage: 'url("http://localhost:3000/images/banner/shop.png")' }}
      >
        <div className="absolute inset-0 bg-[#2422228a] flex items-center">
          <div className="w-[90%] mx-auto text-white">
            <h2 className="text-3xl font-bold">Product Details</h2>
            <div className="flex items-center gap-2 mt-2 text-lg">
              <Link to="/">Home</Link>
              <IoIosArrowForward />
              <span className="line-clamp-1 max-w-[60%]">{product.name || 'Product'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* breadcrumbs */}
      <section className="bg-slate-100 py-5">
        <div className="w-[90%] mx-auto">
          <div className="text-sm text-slate-600 flex items-center gap-2">
            <Link to="/">Home</Link>
            <IoIosArrowForward />
            <Link to="/">{product.category || 'Category'}</Link>
            <IoIosArrowForward />
            <span>{product.name || 'Product'}</span>
          </div>
        </div>
      </section>

      {/* main content */}
      <main className="w-[90%] max-w-7xl mx-auto py-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-1">
          {/* left: images */}
          <div>
            <div className="border rounded-md overflow-hidden bg-white shadow-sm">
              {/* main image area */}
              <div className="relative w-full h-[420px] bg-gray-50 flex items-center justify-center">
                {!mainImageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-gray-100">
                    <div className="w-3/4 h-3/4 bg-gray-200 rounded" />
                  </div>
                )}
                <img
                  src={safeImg(image || product.images?.[0])}
                  alt={product.name}
                  onLoad={onMainImageLoad}
                  className={`w-full h-full object-contain transition-transform duration-500 ${
                    mainImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  loading="lazy"
                />
              </div>

              {/* thumbnails carousel */}
              <div className="p-4">
                {product.images && product.images.length > 0 ? (
                  <Carousel
                    autoPlay={false}
                    infinite={false}
                    responsive={responsive}
                    transitionDuration={300}
                    containerClass="!px-1"
                    itemClass="px-1"
                  >
                    {product.images.map((img, idx) => {
                      const loaded = imagesLoaded[img];
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setImage(img);
                            setMainImageLoaded(false);
                          }}
                          className="cursor-pointer p-1"
                        >
                          <div
                            className={`relative w-full h-[110px] rounded overflow-hidden border ${
                              image === img ? 'ring-2 ring-[#059473]' : 'ring-0'
                            } hover:scale-105 transition-transform`}
                          >
                            {!loaded && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse" />
                            )}
                            <img
                              src={safeImg(img)}
                              onLoad={() => onThumbLoad(img)}
                              alt={`thumb-${idx}`}
                              className={`w-full h-full object-cover ${loaded ? 'opacity-100' : 'opacity-0'}`}
                              loading="lazy"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </Carousel>
                ) : (
                  <div className="text-center text-sm text-gray-500">No images available</div>
                )}
              </div>
            </div>
          </div>

          {/* right: details */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">{product.name || 'Product Name'}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  <Rating ratings={product.rating || 0} />
                </div>
                <div className="text-sm text-slate-600">{product.totalReview ? `(${product.totalReview} reviews)` : '(No reviews yet)'}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {product.discount ? (
                <>
                  <div className="text-2xl font-bold text-red-500">${displayPrice}</div>
                  <div className="line-through text-sm text-slate-400">${product.price}</div>
                  <div className="text-sm text-red-500">-{product.discount}%</div>
                </>
              ) : (
                <div className="text-2xl font-bold text-slate-800">${product.price || 0}</div>
              )}
            </div>

            <div className="text-slate-600 leading-relaxed">{product.description}</div>

            {/* quantity & actions */}
            <div className="flex flex-wrap items-center gap-4 border-b pb-4">
              {product.stock ? (
                <>
                  <div className="flex items-center bg-slate-200 rounded select-none">
                    <button onClick={dec} className="px-4 py-2 hover:bg-slate-300 transition">-</button>
                    <div className="px-5">{quantity}</div>
                    <button onClick={inc} className="px-4 py-2 hover:bg-slate-300 transition">+</button>
                  </div>

                  <button
                    onClick={add_card}
                    className="px-6 py-3 bg-[#059473] hover:bg-[#04735a] text-white rounded shadow transition"
                  >
                    Add To Cart
                  </button>
                </>
              ) : (
                <div className="text-red-600 font-semibold">Out of stock</div>
              )}

              <div
                onClick={add_wishlist}
                className="w-12 h-12 flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-white rounded cursor-pointer"
                title="Add to wishlist"
              >
                <FaHeart />
              </div>
            </div>

            {/* availability & share */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div>
                <div className={`font-semibold ${product.stock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock ? `In Stock (${product.stock})` : 'Out Of Stock'}
                </div>
                <div className="text-sm text-slate-600 mt-1">Shop: <span className="font-semibold">{product.shopName}</span></div>
              </div>

              <div className="flex items-center gap-3">
                <a className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center hover:bg-[#059473] transition" href="#" aria-label="share-facebook">
                  <FaFacebookF />
                </a>
                <a className="w-10 h-10 rounded-full bg-cyan-500 text-white flex items-center justify-center hover:bg-[#059473] transition" href="#" aria-label="share-twitter">
                  <FaTwitter />
                </a>
                <a className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-[#059473] transition" href="#" aria-label="share-linkedin">
                  <FaLinkedin />
                </a>
                <a className="w-10 h-10 rounded-full bg-slate-700 text-white flex items-center justify-center hover:bg-[#059473] transition" href="#" aria-label="share-github">
                  <FaGithub />
                </a>
              </div>
            </div>

            {/* buy + chat */}
            <div className="flex gap-3 flex-wrap">
              {product.stock && (
                <button onClick={buynow} className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded transition">
                  Buy Now
                </button>
              )}
              <Link to={`/dashboard/chat/${product.sellerId}`} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded transition">
                Chat Seller
              </Link>
            </div>
          </div>
        </div>

        {/* tabs: reviews / description */}
        <section className="mt-10">
          <div className="flex gap-2 flex-wrap mb-4">
            <button
              onClick={() => setTab('reviews')}
              className={`py-1 px-4 rounded ${tab === 'reviews' ? 'bg-[#059473] text-white' : 'bg-slate-200 text-slate-700'}`}
            >
              Reviews
            </button>
            <button
              onClick={() => setTab('description')}
              className={`py-1 px-4 rounded ${tab === 'description' ? 'bg-[#059473] text-white' : 'bg-slate-200 text-slate-700'}`}
            >
              Description
            </button>
          </div>

          <div className="bg-white border rounded p-5 shadow-sm">
            {tab === 'reviews' ? <Reviews product={product} /> : <p className="text-slate-600">{product.description}</p>}
          </div>
        </section>

        {/* From same shop: moreProducts */}
        <section className="mt-10">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">From {product.shopName}</h3>
          <div className="grid grid-cols-3 gap-5 md:grid-cols-2 sm:grid-cols-1">
            {moreProducts.map((p, i) => (
              <Link to={`/product/${p.slug || ''}`} key={i} className="block border rounded overflow-hidden hover:shadow-lg transition">
                <div className="relative h-64 bg-gray-100">
                  <img src={safeImg(p.images?.[0])} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                  {p.discount ? (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold w-9 h-9 rounded-full flex items-center justify-center">
                      {p.discount}%
                    </div>
                  ) : null}
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-slate-700 line-clamp-2">{p.name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-lg font-bold">${p.price}</div>
                    <Rating ratings={p.rating} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Related products swiper */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Related Products</h3>
          <Swiper
            slidesPerView={'auto'}
            breakpoints={{ 1280: { slidesPerView: 3 }, 768: { slidesPerView: 2 }, 0: { slidesPerView: 1 } }}
            spaceBetween={24}
            loop={true}
            pagination={{ clickable: true, el: '.custom_bullet' }}
            modules={[Pagination]}
            className="mySwiper"
          >
            {relatedProducts.map((p, i) => (
              <SwiperSlide key={i} className="h-auto">
                <Link to={`/product/${p.slug || ''}`} className="block border rounded overflow-hidden hover:shadow-lg transition">
                  <div className="relative h-64 bg-gray-100">
                    <img src={safeImg(p.images?.[0])} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                    {p.discount ? (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold w-9 h-9 rounded-full flex items-center justify-center">
                        {p.discount}%
                      </div>
                    ) : null}
                    <div className="absolute inset-0 bg-black opacity-0 hover:opacity-25 transition-all duration-300" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-slate-700">{p.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <div className="font-semibold">${p.price}</div>
                      <Rating ratings={p.rating} />
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="w-full flex justify-center items-center py-6">
            <div className="custom_bullet flex justify-center gap-3 !w-auto" />
          </div>
        </section>
      </main>

      {/* mobile sticky CTA */}
      <MobileStickyBar />

      <Footer />
    </div>
  );
};

export default Details;
