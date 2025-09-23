import React from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Products = ({ title, products }) => {
  // Responsive breakpoints
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1600 },
      items: 5,
      slidesToSlide: 5
    },
    desktop: {
      breakpoint: { max: 1600, min: 1024 },
      items: 4,
      slidesToSlide: 4
    },
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 2,
      slidesToSlide: 2
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 1,
      slidesToSlide: 1
    },
  };

  // Custom Buttons
  const ButtonGroup = ({ next, previous }) => {
    return (
      <div className="flex justify-between items-center mb-6 px-2">
        {/* Section Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-700 relative">
          {title}
          <span className="block w-16 h-[3px] bg-[#059473] mt-2 animate-pulse"></span>
        </h2>

        {/* Navigation Arrows */}
        <div className="flex gap-3">
          <button
            onClick={() => previous()}
            className="w-10 h-10 flex justify-center items-center bg-gray-200 rounded-full hover:bg-[#059473] hover:text-white transition-all shadow"
          >
            <IoIosArrowBack size={20} />
          </button>
          <button
            onClick={() => next()}
            className="w-10 h-10 flex justify-center items-center bg-gray-200 rounded-full hover:bg-[#059473] hover:text-white transition-all shadow"
          >
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-[90%] lg:w-[85%] mx-auto py-10">
      <Carousel
        autoPlay={false}
        infinite={false}
        arrows={false}
        responsive={responsive}
        transitionDuration={500}
        renderButtonGroupOutside={true}
        customButtonGroup={<ButtonGroup />}
        containerClass="pb-6"
      >
        {products.map((group, i) => (
          <div key={i} className="flex flex-col gap-4">
            {group.map((pl, j) => (
              <Link
                key={j}
                to={`/product/details/${pl.slug}`}
                className="flex items-center gap-3 border rounded-lg p-3 bg-white hover:shadow-md transition-all duration-500 hover:-translate-y-1"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-md">
                  <img
                    className="w-[100px] h-[100px] object-cover rounded-md transform transition-transform duration-500 hover:scale-110"
                    src={pl.images[0]}
                    alt={pl.name}
                  />
                  {pl.discount && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-[2px] rounded-full shadow">
                      -{pl.discount}%
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-between">
                  <h3 className="font-semibold text-slate-700 truncate hover:text-[#059473] transition">
                    {pl.name}
                  </h3>
                  <span className="text-lg font-bold text-[#059473]">
                    ${pl.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Products;
