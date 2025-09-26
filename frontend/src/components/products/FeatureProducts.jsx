import React, { useEffect } from 'react';
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from '../Rating';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { add_to_card, add_to_wishlist, messageClear } from '../../store/reducers/cardReducer';
import toast from 'react-hot-toast';

const FeatureProducts = ({ products }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const { errorMessage, successMessage } = useSelector(state => state.card);

  const add_card = (id) => {
    if (userInfo) {
      dispatch(add_to_card({
        userId: userInfo.id,
        quantity: 1,
        productId: id
      }));
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  const add_wishlist = (pro) => {
    if (userInfo) {
      dispatch(add_to_wishlist({
        userId: userInfo.id,
        productId: pro._id,
        name: pro.name,
        price: pro.price,
        image: pro.images[0],
        discount: pro.discount,
        rating: pro.rating,
        slug: pro.slug
      }));
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="w-[90%] lg:w-[85%] mx-auto py-10">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-700 relative inline-block">
          Feature Products
          <span className="block w-20 h-[3px] bg-[#059473] mx-auto mt-3 animate-pulse"></span>
        </h2>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p, i) => (
          <div
            key={i}
            className="border rounded-lg group overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
          >
            {/* Product Image */}
            <div className="relative overflow-hidden">
              {p.discount ? (
                <div className="absolute left-3 top-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-bounce">
                  -{p.discount}%
                </div>
              ) : null}

              <img
                src={p.images[0]}
                alt={p.name}
                className="w-full h-[240px] object-cover transform group-hover:scale-105 transition-transform duration-500"
              />

              {/* Hover Action Buttons */}
              <ul className="absolute flex gap-3 justify-center items-center left-0 right-0 -bottom-12 group-hover:bottom-4 transition-all duration-500">
                <li
                  onClick={() => add_wishlist(p)}
                  className="w-10 h-10 bg-white shadow rounded-full flex justify-center items-center cursor-pointer hover:bg-[#059473] hover:text-white transition-all duration-500 transform hover:rotate-[360deg]"
                >
                  <FaRegHeart />
                </li>

                <Link
                  to={`/product/details/${p.slug}`}
                  className="w-10 h-10 bg-white shadow rounded-full flex justify-center items-center cursor-pointer hover:bg-[#059473] hover:text-white transition-all duration-500 transform hover:rotate-[360deg]"
                >
                  <FaEye />
                </Link>

                <li
                  onClick={() => add_card(p._id)}
                  className="w-10 h-10 bg-white shadow rounded-full flex justify-center items-center cursor-pointer hover:bg-[#059473] hover:text-white transition-all duration-500 transform hover:rotate-[360deg]"
                >
                  <RiShoppingCartLine />
                </li>
              </ul>
            </div>

            {/* Product Info */}
            <div className="px-4 py-4 text-center md:text-left">
              <h2 className="font-semibold text-lg text-slate-700 truncate hover:text-[#059473] transition">
                {p.name}
              </h2>
              <div className="flex justify-center md:justify-start items-center gap-3 mt-2">
                <span className="text-lg font-bold text-[#059473]">
                  ${p.price}
                </span>
                <div className="flex">
                  <Rating ratings={p.rating} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureProducts;
