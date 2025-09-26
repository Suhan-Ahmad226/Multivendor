import React, { useEffect } from "react";
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from "../Rating";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  add_to_card,
  add_to_wishlist,
  messageClear,
} from "../../store/reducers/cardReducer";
import toast from "react-hot-toast";

/**
 * FeatureProducts
 * - Backend structure preserved (images array, slug, _id, name, price, discount, rating ...)
 * - Responsive grid (1 / 2 / 3 / 4 cols)
 * - Hover overlay actions (wishlist, view, add to cart)
 * - Discount badge, price calculation, rating
 * - Safe fallbacks for missing props (image fallback, missing discount, etc.)
 * - Small animations & accessible buttons
 */

const FeatureProducts = ({ products = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth || {});
  const { errorMessage, successMessage } = useSelector((state) => state.card || {});

  // Clear messages & show toast
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

  const handleAddToCart = (productId) => {
    if (userInfo) {
      dispatch(
        add_to_card({
          userId: userInfo.id,
          quantity: 1,
          productId,
        })
      );
    } else {
      navigate("/login");
    }
  };

  const handleAddToWishlist = (product) => {
    if (userInfo) {
      dispatch(
        add_to_wishlist({
          userId: userInfo.id,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.image || "",
          discount: product.discount,
          rating: product.rating,
          slug: product.slug,
        })
      );
      // optional UI feedback
      toast.success("Added to wishlist");
    } else {
      navigate("/login");
    }
  };

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="w-full py-12 text-center text-slate-500">
        No featured products available
      </div>
    );
  }

  return (
    <section className="w-[95%] lg:w-[85%] mx-auto py-10">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-700">
          Featured Products
        </h2>
        <div className="mt-3 w-24 h-1 bg-[#059473] rounded" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p, idx) => {
          const imgSrc = p.images?.[0] || p.image || "/placeholder.png";
          const discount = Number(p.discount) || 0;
          const price = Number(p.price) || 0;
          const finalPrice = discount > 0 ? price - Math.round((price * discount) / 100) : price;
          const slug = p.slug || "";

          return (
            <article
              key={p._id || idx}
              className="relative bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-2"
            >
              {/* Image area */}
              <div className="relative group">
                {/* Discount badge */}
                {discount > 0 && (
                  <div className="absolute left-3 top-3 z-10 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                    -{discount}%
                  </div>
                )}

                {/* Image */}
                <img
                  src={imgSrc}
                  alt={p.name || "Product"}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder.png";
                  }}
                  className="w-full h-[240px] md:h-[260px] object-contain bg-gray-50 transition-transform duration-500 group-hover:scale-105"
                />

                {/* Actions overlay (appear on hover) */}
                <div className="absolute inset-x-0 -bottom-12 group-hover:bottom-4 transition-all duration-400 flex justify-center items-center gap-3 z-20">
                  {/* Wishlist */}
                  <button
                    aria-label="Add to wishlist"
                    onClick={() => handleAddToWishlist(p)}
                    className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:bg-[#059473] hover:text-white transition-all duration-300"
                  >
                    <FaRegHeart />
                  </button>

                  {/* View (link to details) */}
                  {slug ? (
                    <Link
                      to={`/product/details/${slug}`}
                      aria-label="View details"
                      className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:bg-[#059473] hover:text-white transition-all duration-300"
                    >
                      <FaEye />
                    </Link>
                  ) : (
                    <button
                      aria-label="View details unavailable"
                      title="Details not available"
                      disabled
                      className="w-10 h-10 bg-gray-100 rounded-full shadow flex items-center justify-center text-gray-400 cursor-not-allowed"
                    >
                      <FaEye />
                    </button>
                  )}

                  {/* Add to cart */}
                  <button
                    aria-label="Add to cart"
                    onClick={() => handleAddToCart(p._id)}
                    className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:bg-[#059473] hover:text-white transition-all duration-300"
                  >
                    <RiShoppingCartLine />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <h3 className="text-md font-semibold text-slate-800 line-clamp-2">
                  {p.name || "Unnamed Product"}
                </h3>

                {/* Price & rating */}
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-lg font-bold text-[#059473]">৳{finalPrice}</span>
                      {discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">৳{price}</span>
                      )}
                    </div>
                    {/* small meta (e.g., reviews count placeholder) */}
                    <p className="text-xs text-gray-500 mt-1">Free shipping available</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex">
                      <Rating ratings={p.rating || 0} />
                    </div>
                    <span className="text-sm text-gray-500">({p.reviewsCount || 0})</span>
                  </div>
                </div>

                {/* Quick actions row for small screens */}
                <div className="mt-4 hidden sm:flex gap-3">
                  <button
                    onClick={() => handleAddToCart(p._id)}
                    className="flex-1 py-2 rounded-md bg-[#059473] text-white text-sm font-medium hover:bg-[#047a55] transition"
                  >
                    Add to Cart
                  </button>
                  <Link
                    to={slug ? `/product/details/${slug}` : "#"}
                    className="py-2 px-3 rounded-md border text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                  >
                    View
                  </Link>
                </div>
              </div>

              {/* Small ribbon for new / low stock (optional) */}
              {p.isNew && (
                <div className="absolute right-2 top-12 bg-green-500 text-white text-xs px-2 py-1 rounded-md">New</div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureProducts;
