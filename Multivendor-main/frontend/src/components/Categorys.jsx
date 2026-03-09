import React from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import { useSelector } from 'react-redux';

const Categorys = () => {
  const { categorys } = useSelector(state => state.home);

  // ✅ Carousel responsive breakpoints
  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 6 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 4 },
    mobile: { breakpoint: { max: 768, min: 464 }, items: 2 },
    smallMobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <div className='w-[87%] mx-auto relative'>
      {/* 🔹 Section Title */}
      <div className='w-full'>
        <div className='text-center flex justify-center items-center flex-col text-3xl text-slate-600 font-bold relative pb-[35px]'>
          <h2>Top Category</h2>
          <div className='w-[100px] h-[2px] bg-[#059473] mt-4'></div>
        </div>
      </div>

      {/* 🔹 Carousel View */}
      <Carousel
        autoPlay={true}
        infinite={true}
        arrows={true}
        responsive={responsive}
        transitionDuration={500}
      >
        {categorys.map((c, i) => (
          <Link
            key={i}
            to={`/products?category=${c.name}`}
            className='h-[185px] border block rounded-lg shadow-md hover:shadow-xl transition'
          >
            <div className='w-full h-full relative p-3 flex flex-col items-center justify-center'>
              <img
                src={c.image}
                alt={c.name}
                className='w-full h-[120px] object-contain'
              />
              <div className='absolute bottom-6 w-full mx-auto font-bold left-0 flex justify-center items-center'>
                <span className='py-[2px] px-6 bg-[#333030a1] text-white rounded-md'>
                  {c.name}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </Carousel>

      {/* 🔹 Grid View (Daraz style) */}
      <div className='mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
        {categorys.map((c, i) => (
          <Link
            key={i}
            to={`/products?category=${c.name}`}
            className='border rounded-lg p-4 shadow hover:shadow-lg flex flex-col items-center transition'
          >
            <img
              src={c.image}
              alt={c.name}
              className='w-[100px] h-[100px] object-contain'
            />
            <div className='mt-3 font-semibold text-slate-700 text-center'>
              {c.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categorys;
