import React from "react";
import Carousel from "react-multi-carousel";
import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "react-multi-carousel/lib/styles.css";

// Responsive breakpoints
const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1280 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 1280, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 1,
  },
};

// Custom next/prev button group
const ButtonGroup = ({ next, previous }) => (
  <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 z-10">
    <button
      onClick={previous}
      className="bg-white shadow-md hover:bg-gray-100 p-2 rounded-full"
    >
      <IoIosArrowBack size={22} />
    </button>
    <button
      onClick={next}
      className="bg-white shadow-md hover:bg-gray-100 p-2 rounded-full"
    >
      <IoIosArrowForward size={22} />
    </button>
  </div>
);

// Helper function to chunk array
const chunkArray = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const Products = ({ title, products }) => {
  const productsPerSlide = 5; // প্রতি স্লাইডে কয়টা প্রোডাক্ট দেখাবে
  const slides = chunkArray(products, productsPerSlide);

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm p-4 my-6 relative">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-3 px-2">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <Link
          to="/products"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          See All
        </Link>
      </div>

      {/* Carousel */}
      <Carousel
        responsive={responsive}
        arrows={false}
        renderButtonGroupOutside
        customButtonGroup={<ButtonGroup />}
        infinite={false}
        transitionDuration={500}
      >
        {slides.map((slideProducts, index) => (
          <div
            key={index}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {slideProducts.map((product, idx) => (
              <Link
                key={idx}
                to={`/product/details/${product.slug}`}
                className="group border rounded-xl p-3 bg-white shadow-sm hover:shadow-lg transition duration-300"
              >
                <div className="w-full aspect-square flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-700 line-clamp-2 group-hover:text-blue-600">
                  {product.name}
                </h3>
                <p className="mt-1 text-base font-bold text-gray-900">
                  ৳{product.price}
                </p>
              </Link>
            ))}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Products;
