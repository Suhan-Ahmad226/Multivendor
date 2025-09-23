import React from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa6";

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
          <span className="block w-20 h-[3px] bg-[#059473] mt-2 animate-pulse"></span>
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
        autoPlay={true}
        autoPlaySpeed={4000}
        infinite={true}
        arrows={false}
        responsive={responsive}
        transitionDuration={600}
        renderButtonGroupOutside={true}
        customButtonGroup={<ButtonGroup />}
        containerClass="pb-6"
      >
        {products.map((pl, i) => (
          <div
            key={i}
            className="group border rounded-lg p-4 bg-white hover:shadow-lg transition-all duration-500 relative"
          >
            {/* Product Image */}
            <div className="relative overflow-hidden rounded-md">
              {pl.discount && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-[2px] rounded-full shadow">
                  -{pl.discount}%
                </span>
              )}
              <img
                className="w-full h-[220px] object-cover rounded-md transform transition-transform duration-500 group-hover:scale-105"
                src={pl.images[0]}
                alt={pl.name}
              />

              {/* Hover Buttons */}
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex justify-center items-center gap-3 transition-all duration-500">
                <button className="w-10 h-10 bg-white rounded-full flex justify-center items-center hover:bg-[#059473] hover:text-white transition-all">
                  <FaRegHeart />
                </button>
                <Link
                  to={`/product/details/${pl.slug}`}
                  className="w-10 h-10 bg-white rounded-full flex justify-center items-center hover:bg-[#059473] hover:text-white transition-all"
                >
                  <FaEye />
                </Link>
                <button className="w-10 h-10 bg-white rounded-full flex justify-center items-center hover:bg-[#059473] hover:text-white transition-all">
                  <RiShoppingCartLine />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="mt-4 text-center">
              <h3 className="font-semibold text-slate-700 text-sm md:text-base truncate hover:text-[#059473] transition">
                {pl.name}
              </h3>
              <span className="text-lg font-bold text-[#059473] block mt-1">
                ${pl.price}
              </span>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Products;
