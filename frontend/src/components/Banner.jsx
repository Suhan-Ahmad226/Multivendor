import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import { Link } from "react-router-dom";
import "react-multi-carousel/lib/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { get_banners } from "../store/reducers/homeReducer";

// Responsive breakpoints
const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const Banner = () => {
  const dispatch = useDispatch();
  const { banners } = useSelector((state) => state.home);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(get_banners());
  }, [dispatch]);

  useEffect(() => {
    if (banners.length > 0) {
      setLoading(false);
    }
  }, [banners]);

  return (
    <div className="w-full md:mt-6">
      <div className="w-[95%] lg:w-[90%] mx-auto">
        <div className="w-full flex flex-wrap">
          <div className="w-full">
            <div className="my-4 md:my-6">
              {loading ? (
                // Skeleton loader
                <div className="w-full h-[200px] md:h-[400px] bg-gray-200 animate-pulse rounded-lg"></div>
              ) : (
                <Carousel
                  autoPlay={true}
                  infinite={true}
                  arrows={true}
                  showDots={true}
                  responsive={responsive}
                  transitionDuration={600}
                  containerClass="rounded-lg overflow-hidden"
                  dotListClass="custom-dot-list-style"
                >
                  {banners.length > 0 &&
                    banners.map((b, i) => (
                      <Link
                        key={i}
                        to={`product/details/${b.link}`}
                        className="relative group block"
                      >
                        {/* Banner Image */}
                        <img
                          src={b.banner}
                          alt={`Banner ${i + 1}`}
                          className="w-full h-[200px] md:h-[400px] object-cover transform group-hover:scale-105 transition duration-700"
                          loading="lazy"
                        />

                        {/* Overlay Content */}
                        <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition duration-500">
                          <h2 className="text-white text-lg md:text-2xl font-bold mb-3">
                            Special Offer
                          </h2>
                          <button className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition">
                            Shop Now
                          </button>
                        </div>
                      </Link>
                    ))}
                </Carousel>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom dot style */}
      <style>{`
        .custom-dot-list-style {
          bottom: 15px;
        }
        .custom-dot-list-style li button {
          background: #d1d5db; /* gray-300 */
          border-radius: 50%;
          width: 10px;
          height: 10px;
        }
        .custom-dot-list-style li.slick-active button {
          background: #059473; /* green */
          width: 12px;
          height: 12px;
        }
      `}</style>
    </div>
  );
};

export default Banner;
