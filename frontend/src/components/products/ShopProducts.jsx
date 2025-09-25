// src/components/ShopProducts.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from "../Rating";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

/**
 * Props:
 *  - styles: 'grid' | 'list' (layout mode)
 *  - products: array of product objects (id/_id, name, images[], price, discount, rating, slug)
 *  - isLoading: optional boolean to show skeletons
 *
 * Notes:
 *  - This component is purely frontend: add-to-cart/wishlist are UI-only (no backend changes)
 *  - Tailwind classes used for responsive breakpoints: sm, md, lg, xl
 */

const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-lg shadow p-3">
    <div className="bg-gray-200 h-48 rounded-md mb-3" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
);

const ShopProducts = ({ styles = "grid", products = [], isLoading = false }) => {
  const [viewStyle, setViewStyle] = useState(styles); // 'grid' or 'list'

  // derived responsive grid classes
  const gridClasses = useMemo(() => {
    // Desktop: xl -> 4, lg -> 3, md -> 2, sm -> 1
    if (viewStyle === "grid") {
      return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";
    }
    // list view: single column on mobile, two columns on md+, each item is horizontal on md+
    return "grid grid-cols-1 gap-4";
  }, [viewStyle]);

  const handleAddToCart = (p) => {
    // UI-only: show toast and optional animation
    toast.success(`${p.name} added to cart (demo)`);
    // If you have an action, call it here (without changing backend)
  };

  const handleWishlist = (p) => {
    toast.success(`${p.name} removed from wishlist (demo)`);
  };

  if (isLoading) {
    return (
      <div className={gridClasses}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="bg-white p-8 rounded-lg text-center shadow">
        <img
          src="/empty-box.svg"
          alt="No products"
          className="mx-auto mb-4 w-36 h-36 object-contain"
          loading="lazy"
        />
        <h3 className="text-lg font-semibold text-slate-700">No products found</h3>
        <p className="text-sm text-slate-500 mt-2">
          Try adjusting filters or explore other categories.
        </p>
        <Link
          to="/products"
          className="inline-block mt-4 px-5 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Controls: switch view (grid/list) */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">View:</span>
          <button
            aria-pressed={viewStyle === "grid"}
            onClick={() => setViewStyle("grid")}
            className={`px-3 py-1 rounded-md text-sm transition ${
              viewStyle === "grid" ? "bg-green-600 text-white" : "bg-white text-slate-700 border"
            }`}
            title="Grid view"
          >
            Grid
          </button>
          <button
            aria-pressed={viewStyle === "list"}
            onClick={() => setViewStyle("list")}
            className={`px-3 py-1 rounded-md text-sm transition ${
              viewStyle === "list" ? "bg-green-600 text-white" : "bg-white text-slate-700 border"
            }`}
            title="List view"
          >
            List
          </button>
        </div>

        <div className="text-sm text-slate-500">{products.length} products</div>
      </div>

      <div className={gridClasses}>
        {products.map((p, i) => {
          const discountedPrice =
            p.discount > 0 ? (p.price - (p.price * p.discount) / 100).toFixed(2) : null;

          // classes depending on view style
          const cardBase =
            "bg-white rounded-lg shadow-sm overflow-hidden group transition-transform duration-300 hover:shadow-lg";
          const gridCardClasses = "flex flex-col";
          const listCardClasses =
            "flex flex-col md:flex-row items-start gap-4 p-4"; // horizontal on md+

          return (
            <article
              key={p._id || p.id || i}
              className={`${cardBase} ${
                viewStyle === "grid" ? gridCardClasses : listCardClasses
              }`}
              aria-labelledby={`product-${i}-title`}
            >
              {/* === Image block === */}
              <div
                className={`relative w-full ${
                  viewStyle === "grid" ? "h-56 md:h-64" : "md:w-1/3 md:h-40 h-56"
                } overflow-hidden`}
              >
                {/* discount badge */}
                {p.discount > 0 && (
                  <span className="absolute left-3 top-3 z-20 inline-block bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                    -{p.discount}%
                  </span>
                )}

                <img
                  src={p.images?.[0] || p.image}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                />

                {/* quick action icons (appear on hover OR always on list layout) */}
                <div
                  className={`absolute left-0 right-0 flex justify-center gap-2 px-2 ${
                    viewStyle === "grid"
                      ? "bottom-[-50px] group-hover:bottom-3 transition-all duration-300"
                      : "bottom-3"
                  }`}
                >
                  <button
                    onClick={() => handleWishlist(p)}
                    aria-label={`Remove ${p.name} from wishlist`}
                    title="Remove from wishlist"
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow hover:bg-green-500 hover:text-white transition transform hover:rotate-180"
                  >
                    <FaRegHeart />
                  </button>

                  <Link
                    to={`/product/details/${p.slug}`}
                    aria-label={`View ${p.name}`}
                    title="Quick view"
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow hover:bg-green-500 hover:text-white transition transform hover:rotate-180"
                  >
                    <FaEye />
                  </Link>

                  <button
                    onClick={() => handleAddToCart(p)}
                    aria-label={`Add ${p.name} to cart`}
                    title="Add to cart"
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow hover:bg-green-500 hover:text-white transition transform hover:rotate-180"
                  >
                    <RiShoppingCartLine />
                  </button>
                </div>
              </div>

              {/* === Details === */}
              <div
                className={`p-4 flex-1 flex flex-col justify-between ${
                  viewStyle === "list" ? "md:pl-0" : ""
                }`}
              >
                <div>
                  <h3
                    id={`product-${i}-title`}
                    className="text-sm md:text-base font-semibold text-slate-800 truncate"
                  >
                    <Link to={`/product/details/${p.slug}`} className="hover:text-green-600">
                      {p.name}
                    </Link>
                  </h3>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-green-700">
                        ${discountedPrice ?? Number(p.price).toFixed(2)}
                      </div>
                      {discountedPrice && (
                        <div className="text-sm text-gray-400 line-through">${p.price}</div>
                      )}
                    </div>

                    <div className="hidden md:flex items-center">
                      <Rating ratings={p.rating} />
                    </div>
                  </div>

                  {/* mobile rating under price */}
                  <div className="mt-3 md:hidden">
                    <Rating ratings={p.rating} />
                  </div>

                  {/* short meta */}
                  <div className="mt-3 text-xs text-slate-500">
                    <span>Brand: {p.brand ?? "—"}</span>
                    <span className="mx-2">•</span>
                    <span>Stock: {p.stock ?? "In stock"}</span>
                  </div>
                </div>

                {/* actions (visible on list view on right side) */}
                <div className="mt-4 md:mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Link
                      to={`/product/details/${p.slug}`}
                      className="px-3 py-1 text-sm rounded-md bg-slate-100 hover:bg-slate-200 transition"
                    >
                      View
                    </Link>

                    <button
                      onClick={() => handleAddToCart(p)}
                      className="px-3 py-1 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                    >
                      Add to Cart
                    </button>
                  </div>

                  <div className="text-xs text-slate-400">{p.reviewsCount ?? 0} reviews</div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

ShopProducts.propTypes = {
  styles: PropTypes.oneOf(["grid", "list"]),
  products: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default ShopProducts;
