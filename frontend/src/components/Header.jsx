// src/components/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

/* Icons */
import { MdEmail } from "react-icons/md";
import { IoMdPhonePortrait, IoMdArrowDropdown } from "react-icons/io";
import {
  FaFacebookF,
  FaList,
  FaLock,
  FaUser,
  FaHeart,
  FaCartShopping,
  FaPhoneAlt,
  FaSearch,
  FaBell,
  FaGlobe,
  FaTimes,
  FaAngleDown,
  FaBars,
  FaChevronRight,
} from "react-icons/fa";

/* Example actions - adapt to your store */
import {
  get_card_products,
  get_wishlist_products,
} from "../store/reducers/cardReducer";

const Header = ({ logoSrc = "/images/logo.png" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // redux slices (adapt keys to your store)
  const { categorys = [] } = useSelector((s) => s.home || {});
  const { userInfo } = useSelector((s) => s.auth || {});
  const {
    card_product_count = 0,
    wishlist_count = 0,
    card_products = [],
  } = useSelector((s) => s.card || {});

  // UI states
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [showWishlistPreview, setShowWishlistPreview] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const accountRef = useRef(null);
  const cartRef = useRef(null);
  const wishlistRef = useRef(null);
  const megaRef = useRef(null);

  useEffect(() => {
    if (userInfo) {
      dispatch(get_card_products(userInfo.id));
      dispatch(get_wishlist_products(userInfo.id));
    }
  }, [userInfo, dispatch]);

  const handleSearch = (e) => {
    e?.preventDefault?.();
    navigate(
      `/products/search?category=${encodeURIComponent(
        categoryFilter || ""
      )}&value=${encodeURIComponent(searchValue)}`
    );
    setShowSearchOverlay(false);
  };

  const CategoryImage = ({ src, alt }) => (
    <img
      src={src || "/images/category-default.png"}
      alt={alt}
      className="w-10 h-10 object-cover rounded-full border shadow-sm"
      loading="lazy"
    />
  );

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top Bar */}
      <div className="hidden md:flex justify-between items-center bg-gradient-to-r from-blue-50 to-emerald-50 px-6 h-10 text-sm text-slate-700">
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2 hover:text-emerald-600 transition">
            <MdEmail />
            <a href="mailto:support@example.com">support@example.com</a>
          </div>
          <div className="flex items-center gap-2 hover:text-emerald-600 transition">
            <IoMdPhonePortrait />
            <a href="tel:+1234323343">+(123) 4323 343</a>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Social */}
          <nav className="flex gap-3">
            <a href="#" className="hover:text-blue-600 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-sky-400 transition">
              <FaBell />
            </a>
            <a href="#" className="hover:text-sky-600 transition">
              <FaGlobe />
            </a>
          </nav>

          {/* Login/Profile */}
          <div ref={accountRef} className="relative">
            {userInfo ? (
              <button
                onClick={() => setShowAccountDropdown((s) => !s)}
                className="flex items-center gap-2 hover:text-emerald-600 transition"
              >
                <FaUser />
                {userInfo.name}
                <FaAngleDown />
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 hover:text-emerald-600 transition"
              >
                <FaLock /> Login
              </Link>
            )}

            {userInfo && showAccountDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg p-2 text-sm animate-fadeIn">
                <Link
                  to="/dashboard"
                  className="block py-1 px-2 hover:bg-emerald-50 rounded"
                >
                  Profile
                </Link>
                <Link
                  to="/dashboard/orders"
                  className="block py-1 px-2 hover:bg-emerald-50 rounded"
                >
                  Orders
                </Link>
                <Link
                  to="/dashboard/my-wishlist"
                  className="block py-1 px-2 hover:bg-emerald-50 rounded"
                >
                  Wishlist
                </Link>
                <button
                  onClick={() => navigate("/logout")}
                  className="w-full text-left mt-2 py-1 px-2 text-red-600 hover:bg-red-50 rounded"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-white shadow-sm">
        {/* Logo + Hamburger */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-2xl p-2 rounded hover:bg-slate-100"
            onClick={() => setShowSidebar(true)}
          >
            <FaBars />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoSrc}
              alt="Logo"
              className="h-10 md:h-12 object-contain"
            />
          </Link>
        </div>

        {/* Nav + Search */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`hover:text-emerald-600 transition ${
              pathname === "/" && "text-emerald-600 font-semibold"
            }`}
          >
            Home
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setShowMegaMenu(true)}
            onMouseLeave={() => setShowMegaMenu(false)}
            ref={megaRef}
          >
            <button className="flex items-center gap-1 hover:text-emerald-600 transition">
              Shop <FaAngleDown />
            </button>

            {showMegaMenu && (
              <div className="absolute left-0 mt-2 w-[800px] bg-white border rounded shadow-lg p-4 grid grid-cols-3 gap-4 animate-slideDown">
                {categorys.slice(0, 9).map((c, i) => (
                  <Link
                    key={i}
                    to={`/products?category=${encodeURIComponent(c.name)}`}
                    className="flex items-center gap-3 p-2 rounded hover:bg-emerald-50 transition"
                  >
                    <CategoryImage src={c.image} alt={c.name} />
                    <span>{c.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/deals"
            className={`hover:text-emerald-600 transition ${
              pathname === "/deals" && "text-emerald-600 font-semibold"
            }`}
          >
            Deals
          </Link>
          <Link
            to="/about"
            className={`hover:text-emerald-600 transition ${
              pathname === "/about" && "text-emerald-600 font-semibold"
            }`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`hover:text-emerald-600 transition ${
              pathname === "/contact" && "text-emerald-600 font-semibold"
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Search + Icons */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-stretch bg-slate-50 border rounded overflow-hidden"
          >
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2 border-r bg-transparent text-sm"
            >
              <option value="">All</option>
              {categorys.map((c, i) => (
                <option key={i} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
              className="px-3 py-2 text-sm bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700 transition"
            >
              <FaSearch />
            </button>
          </form>

          {/* Wishlist */}
          <div ref={wishlistRef} className="relative">
            <button
              onClick={() =>
                userInfo ? setShowWishlistPreview((s) => !s) : navigate("/login")
              }
              className="hover:scale-110 transition"
            >
              <FaHeart className="text-emerald-600 text-xl" />
              {wishlist_count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlist_count}
                </span>
              )}
            </button>
            {showWishlistPreview && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg p-2 animate-fadeIn">
                <div className="font-semibold">Wishlist</div>
                <p className="text-xs text-slate-500">
                  {wishlist_count} items saved
                </p>
                <Link
                  to="/dashboard/my-wishlist"
                  className="block mt-2 text-emerald-600 hover:underline"
                >
                  View all
                </Link>
              </div>
            )}
          </div>

          {/* Cart */}
          <div ref={cartRef} className="relative">
            <button
              onClick={() =>
                userInfo ? setShowCartPreview((s) => !s) : navigate("/login")
              }
              className="hover:scale-110 transition"
            >
              <FaCartShopping className="text-emerald-600 text-xl" />
              {card_product_count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {card_product_count}
                </span>
              )}
            </button>
            {showCartPreview && (
              <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow-lg p-2 animate-fadeIn">
                <div className="font-semibold">Cart</div>
                {card_products.length > 0 ? (
                  card_products.slice(0, 3).map((p, i) => (
                    <div key={i} className="flex items-center gap-2 py-2">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="text-sm">{p.name}</div>
                        <div className="text-xs text-slate-500">${p.price}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Cart is empty</p>
                )}
                <button
                  onClick={() => navigate("/card")}
                  className="mt-2 w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition"
                >
                  View Cart
                </button>
              </div>
            )}
          </div>

          {/* Mobile Search */}
          <button
            className="md:hidden text-xl"
            onClick={() => setShowSearchOverlay(true)}
          >
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-72 h-full bg-white shadow-lg z-50 transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <img src={logoSrc} alt="Logo" className="h-10" />
          <button onClick={() => setShowSidebar(false)}>
            <FaTimes className="text-xl" />
          </button>
        </div>
        <nav className="p-4 space-y-3">
          <Link
            to="/"
            className="block hover:text-emerald-600 transition"
            onClick={() => setShowSidebar(false)}
          >
            Home
          </Link>
          {categorys.map((c, i) => (
            <Link
              key={i}
              to={`/products?category=${c.name}`}
              className="flex items-center gap-2 hover:text-emerald-600 transition"
              onClick={() => setShowSidebar(false)}
            >
              <CategoryImage src={c.image} alt={c.name} />
              {c.name}
            </Link>
          ))}
          <Link
            to="/contact"
            className="block hover:text-emerald-600 transition"
            onClick={() => setShowSidebar(false)}
          >
            Contact
          </Link>
        </nav>
      </aside>

      {/* Mobile Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t shadow-lg z-40">
        <div className="flex justify-around py-2">
          <Link to="/" className="flex flex-col items-center text-sm">
            <FaUser /> <span>Home</span>
          </Link>
          <button
            onClick={() => setShowSidebar(true)}
            className="flex flex-col items-center text-sm"
          >
            <FaList /> <span>Menu</span>
          </button>
          <button
            onClick={() => navigate("/card")}
            className="flex flex-col items-center text-sm"
          >
            <FaCartShopping /> <span>Cart</span>
          </button>
          <button
            onClick={() => navigate("/dashboard/my-wishlist")}
            className="flex flex-col items-center text-sm"
          >
            <FaHeart /> <span>Wishlist</span>
          </button>
          <button
            onClick={() => navigate(userInfo ? "/dashboard" : "/login")}
            className="flex flex-col items-center text-sm"
          >
            <FaUser /> <span>Account</span>
          </button>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {showSearchOverlay && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start p-4 animate-fadeIn">
          <div className="bg-white w-full rounded p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                className="flex-1 px-3 py-2 border rounded"
              />
              <button
                onClick={handleSearch}
                className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
              >
                <FaSearch />
              </button>
              <button onClick={() => setShowSearchOverlay(false)}>
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

Header.propTypes = {
  logoSrc: PropTypes.string,
};

export default Header;
