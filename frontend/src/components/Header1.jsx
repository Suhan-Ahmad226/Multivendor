// src/components/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

/* Icons */
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLock,
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaSearch,
  FaBell,
  FaGlobe,
  FaTimes,
  FaAngleDown,
  FaBars,
  FaChevronRight,
  FaPhoneAlt,
  FaHome,
  FaList,
  FaShoppingBag,
  FaGift,
  FaSignInAlt,
  FaSignOutAlt,
  FaShopify,
  FaTags,
  FaInfoCircle,
  FaBlog,
  FaHeadset
} from "react-icons/fa";

/* Example actions - adapt to your store */
import {
  get_card_products,
  get_wishlist_products,
} from "../store/reducers/cardReducer";

// Helper component for category image with fallback
const CategoryImage = ({ src, alt }) => (
  <img
    src={src || "/images/category-default.png"}
    alt={alt}
    className="w-12 h-12 object-cover rounded transition-transform duration-300 group-hover:scale-105"
    loading="lazy"
  />
);

const Header = ({ logoSrc = "/images/logo.png" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Redux slices (adapt keys to your store)
  const { categorys = [] } = useSelector((s) => s.home || {});
  const { userInfo } = useSelector((s) => s.auth || {});
  const { card_product_count = 0, wishlist_count = 0, card_products = [] } =
    useSelector((s) => s.card || {});

  // UI state
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [showWishlistPreview, setShowWishlistPreview] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [notifications] = useState([
    { id: 1, text: "10% off on your next order!" },
    { id: 2, text: "Order #324 shipped" },
  ]);

  // refs for click outside
  const accountRef = useRef(null);
  const cartRef = useRef(null);
  const wishlistRef = useRef(null);
  const megaRef = useRef(null);
  const searchRef = useRef(null);

  // Mock product list for predictive search
  const mockProducts = (categorys || [])
    .flatMap((c) => c.products || [])
    .slice(0, 200);
  const fallbackProducts = [
    "Wireless Headphones",
    "Smartphone",
    "Running Shoes",
    "Leather Wallet",
    "Bluetooth Speaker",
    "Fitness Tracker",
  ];

  // Load counts / previews when user logged-in
  useEffect(() => {
    if (userInfo) {
      dispatch(get_card_products(userInfo.id));
      dispatch(get_wishlist_products(userInfo.id));
    }
  }, [userInfo, dispatch]);

  // Click outside handlers to close popovers
  useEffect(() => {
    function handleClick(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setShowAccountDropdown(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setShowCartPreview(false);
      }
      if (wishlistRef.current && !wishlistRef.current.contains(e.target)) {
        setShowWishlistPreview(false);
      }
      if (megaRef.current && !megaRef.current.contains(e.target)) {
        setShowMegaMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchSuggestions([]);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Debounced predictive search
  useEffect(() => {
    if (!searchValue) {
      setSearchSuggestions([]);
      return;
    }
    const t = setTimeout(() => {
      const pool = mockProducts.length ? mockProducts : fallbackProducts;
      const q = searchValue.toLowerCase();
      const matches = pool
        .filter((p) => (typeof p === 'string' ? p.toLowerCase().includes(q) : p.name.toLowerCase().includes(q)))
        .slice(0, 8)
        .map(p => typeof p === 'string' ? p : p.name); // Ensure suggestions are strings
      setSearchSuggestions(matches);
    }, 180);
    return () => clearTimeout(t);
  }, [searchValue, mockProducts]);

  // keyboard: enter search
  const handleSearchSubmit = (e) => {
    e?.preventDefault?.();
    const q = searchValue.trim();
    if (q) {
      navigate(
        `/products/search?category=${encodeURIComponent(
          categoryFilter || ""
        )}&value=${encodeURIComponent(q)}`
      );
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionClick = (s) => {
    setSearchValue(s);
    setSearchSuggestions([]);
    navigate(
      `/products/search?category=${encodeURIComponent(
        categoryFilter || ""
      )}&value=${encodeURIComponent(s)}`
    );
  };

  // accessibility: keyboard open/close sidebar with Esc
  useEffect(() => {
    const keyHandler = (e) => {
      if (e.key === "Escape") {
        setShowSidebar(false);
        setShowAccountDropdown(false);
        setShowCartPreview(false);
        setShowWishlistPreview(false);
        setShowMegaMenu(false);
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top promo/contact bar - visible on md+ */}
      {/*  <div
        className="hidden md:flex justify-between items-center bg-gradient-to-r from-blue-50 to-emerald-50 px-6 h-10 text-sm text-slate-700 transition-colors duration-300"
        aria-hidden={false}
      >
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2 transition-all duration-300 hover:text-emerald-700">
            <FaPhoneAlt />
            <a href="tel:+1234323343" className="hover:underline">
              +(123) 4323 343
            </a>
          </div>
        </div>
        <div className="flex items-center gap-6">

          <nav className="flex gap-3" aria-label="social links">
            <a
              href="#"
              aria-label="Facebook"
              className="transform transition-transform duration-300 hover:scale-125 hover:text-blue-600"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="transform transition-transform duration-300 hover:scale-125 hover:text-sky-400"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="transform transition-transform duration-300 hover:scale-125 hover:text-pink-500"
            >
              <FaInstagram />
            </a>
          </nav> */}

          {/* Login/Profile with hover effect */}
      {/*  <div ref={accountRef} className="relative group">
            {userInfo ? (
              <button
                className="flex items-center gap-2 px-2 py-1 rounded transition-colors duration-300 group-hover:bg-white/30"
                onClick={() => setShowAccountDropdown((s) => !s)}
                aria-haspopup="menu"
                aria-expanded={showAccountDropdown}
              >
                <FaUser />
                <span className="hidden md:inline">{userInfo.name}</span>
                <FaAngleDown
                  className={`transition-transform duration-300 ${
                    showAccountDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-2 py-1 rounded transition-colors duration-300 hover:bg-white/30"
                aria-label="Login"
              >
                <FaLock />
                <span>Login</span>
              </Link>
            )}*/}

            {/* Account dropdown 
            {userInfo && showAccountDropdown && (
              <div
                role="menu"
                aria-label="User menu"
                className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg p-2 text-sm animate-fade-in"
              >
                <Link
                  to="/dashboard"
                  className="block py-1 px-2 hover:bg-emerald-50 rounded transition-colors duration-200"
                >
                  Profile
                </Link>
                <Link
                  to="/dashboard/orders"
                  className="block py-1 px-2 hover:bg-emerald-50 rounded transition-colors duration-200"
                >
                  Orders
                </Link>
                <Link
                  to="/dashboard/my-wishlist"
                  className="block py-1 px-2 hover:bg-emerald-50 rounded transition-colors duration-200"
                >
                  Wishlist
                </Link>
                <button
                  onClick={() => {
                    // dispatch(logout()) // add your logout
                    navigate("/logout");
                  }}
                  className="w-full text-left mt-2 py-1 px-2 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                >
                  <FaSignOutAlt className="inline mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div> */}

      {/* Main header - Desktop */}
      <div
        className="hidden md:flex flex-col bg-white shadow-sm"
        role="navigation"
        aria-label="main navigation"
      >
        {/* Top bar with Logo, Search, and Icons */}
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoSrc}
              alt="Brand logo"
              className="h-10 md:h-12 object-contain transition-transform duration-300 hover:scale-105"
            />
            <span className="sr-only">Go to homepage</span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-6 relative" ref={searchRef}>
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-stretch bg-slate-50 border rounded-full overflow-hidden shadow-sm"
              role="search"
              aria-label="Search products"
            >
              <div className="relative group">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="hidden md:block px-4 py-2 border-r border-slate-200 bg-transparent text-sm cursor-pointer focus:outline-none appearance-none pr-8"
                  aria-label="Category filter"
                >
                  <option value="">All Categories</option>
                  {categorys.map((c, i) => (
                    <option key={i} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <FaAngleDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <input
                type="text"
                value={searchValue}
                onFocus={() => setSearchSuggestions(true)}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for products..."
                className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none"
                aria-label="Search input"
              />
              <button
                type="submit"
                className="bg-emerald-600 text-white px-6 flex items-center gap-2 transition-all duration-300 hover:bg-emerald-700"
                aria-label="Search"
              >
                <FaSearch />
              </button>
            </form>

            {/* Suggestions dropdown with animation */}
            {searchSuggestions.length > 0 && (
              <ul
                className="absolute mt-1 w-full bg-white border rounded-lg shadow-xl z-50 max-h-60 overflow-auto animate-slide-down"
                role="listbox"
              >
                {searchSuggestions.map((s, idx) => (
                  <li
                    key={idx}
                    role="option"
                    tabIndex={0}
                    onClick={() => handleSuggestionClick(s)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSuggestionClick(s);
                    }}
                    className="px-4 py-3 hover:bg-emerald-50 cursor-pointer transition-colors duration-200"
                  >
                    <FaSearch className="inline mr-2 text-slate-400" />
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-6 text-slate-600">
            {/* Wishlist */}
            <div ref={wishlistRef} className="relative group">
              <button
                className="flex flex-col items-center p-2 rounded-full transition-colors duration-200 hover:bg-slate-100"
                aria-label="Wishlist"
                onClick={() => {
                  if (!userInfo) navigate("/login");
                  else setShowWishlistPreview((s) => !s);
                }}
              >
                <FaHeart className="text-xl text-emerald-600" />
                {wishlist_count > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    {wishlist_count}
                  </span>
                )}
                <span className="text-xs mt-1">Wishlist</span>
              </button>
              {showWishlistPreview && userInfo && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-2 z-50 animate-fade-in">
                  <div className="text-sm font-semibold mb-2">My Wishlist</div>
                  <div className="text-xs text-slate-500">
                    You have {wishlist_count} items.
                  </div>
                  <Link
                    to="/dashboard/my-wishlist"
                    className="block mt-3 text-emerald-600 text-sm hover:underline"
                  >
                    View wishlist
                  </Link>
                </div>
              )}
            </div>

            {/* Cart */}
            <div ref={cartRef} className="relative group">
              <button
                onClick={() => {
                  if (!userInfo) navigate("/login");
                  else setShowCartPreview((s) => !s);
                }}
                aria-label="Cart"
                className="flex flex-col items-center p-2 rounded-full transition-colors duration-200 hover:bg-slate-100"
              >
                <FaShoppingCart className="text-xl text-emerald-600" />
                {card_product_count > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    {card_product_count}
                  </span>
                )}
                <span className="text-xs mt-1">Cart</span>
              </button>

              {/* cart preview with animation */}
              {showCartPreview && userInfo && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg p-3 z-50 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-lg">My Cart</div>
                    <div className="text-xs text-slate-500">
                      {card_product_count} items
                    </div>
                  </div>

                  <div className="mt-2 divide-y">
                    {card_products.length > 0 ? (
                      card_products.slice(0, 4).map((p, i) => (
                        <div
                          key={i}
                          className="py-2 flex items-center gap-3 transition-transform duration-300 hover:translate-x-1"
                        >
                          <img
                            src={p.image || "/images/p-thumb-1.jpg"}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium">{p.name}</div>
                            <div className="text-xs text-slate-500">
                              ${p.price}
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-emerald-600">${p.price}</div>
                        </div>
                      ))
                    ) : (
                      <div className="py-4 text-sm text-center text-slate-500">
                        Your cart is empty
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => navigate("/card")}
                      className="flex-1 bg-emerald-600 text-white py-2 rounded-lg transition-colors duration-300 hover:bg-emerald-700"
                    >
                      View Cart
                    </button>
                    <button
                      onClick={() => navigate("/checkout")}
                      className="flex-1 border border-slate-300 rounded-lg py-2 transition-colors duration-300 hover:bg-slate-100"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
{/* Account */}
            <div ref={accountRef} className="relative group">
              <button
                className="flex flex-col items-center p-2 rounded-full transition-colors duration-200 hover:bg-slate-100"
                onClick={() => setShowAccountDropdown((s) => !s)}
                aria-haspopup="menu"
                aria-expanded={showAccountDropdown}
              >
                <FaUser className="text-xl" />
                <span className="text-xs mt-1">Account</span>
              </button>
              {userInfo && showAccountDropdown && (
                <div
                  role="menu"
                  aria-label="User menu"
                  className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-2 text-sm animate-fade-in"
                >
                  <Link
                    to="/dashboard"
                    className="block py-2 px-3 hover:bg-emerald-50 rounded transition-colors duration-200"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/dashboard/orders"
                    className="block py-2 px-3 hover:bg-emerald-50 rounded transition-colors duration-200"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/dashboard/my-wishlist"
                    className="block py-2 px-3 hover:bg-emerald-50 rounded transition-colors duration-200"
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={() => {
                      // dispatch(logout()) // add your logout
                      navigate("/logout");
                    }}
                    className="w-full text-left mt-2 py-2 px-3 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                  >
                    <FaSignOutAlt className="inline mr-2" /> Logout
                  </button>
                </div>
              )}
              {!userInfo && !showAccountDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-2 text-sm animate-fade-in">
                  <Link
                    to="/login"
                    className="block py-2 px-3 bg-emerald-600 text-white text-center rounded-lg transition-colors duration-300 hover:bg-emerald-700"
                  >
                    <FaSignInAlt className="inline mr-2" /> Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom navigation bar */}
        <div className="bg-white border-t border-slate-200 shadow-sm">
          <nav className="max-w-7xl mx-auto flex items-center justify-start gap-4 font-semibold text-sm px-6 py-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded transition-all duration-300 ${
                pathname === "/" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              Home
            </Link>

            <div className="relative group" ref={megaRef}>
              <button
                className={`px-3 py-2 rounded flex items-center gap-2 transition-all duration-300 group-hover:text-emerald-600 ${
                  pathname.startsWith("/products")
                    ? "text-emerald-600 font-bold"
                    : "text-slate-600"
                }`}
                aria-haspopup="true"
                aria-expanded={showMegaMenu}
                onMouseEnter={() => setShowMegaMenu(true)}
                onMouseLeave={() => setShowMegaMenu(false)}
                onClick={() => setShowMegaMenu((s) => !s)}
              >
                Shop
                <FaAngleDown className="transition-transform duration-300 group-hover:rotate-180" />
              </button>

              {/* Mega menu with animation */}
              {showMegaMenu && (
                <div
                  onMouseEnter={() => setShowMegaMenu(true)}
                  onMouseLeave={() => setShowMegaMenu(false)}
                  className="absolute left-0 mt-2 w-fit bg-white border rounded-lg shadow-xl p-6 grid grid-cols-4 gap-6 z-40 animate-fade-in"
                  role="menu"
                >
                  {/* Categories grid with images */}
                  <div className="col-span-2">
                    <h4 className="text-md font-bold text-slate-800 mb-3">Shop by Category</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {categorys.slice(0, 8).map((c, i) => (
                        <Link
                          key={i}
                          to={`/products?category=${encodeURIComponent(c.name)}`}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-emerald-50 transition-colors duration-200 group"
                          onClick={() => setShowMegaMenu(false)}
                        >
                          <CategoryImage src={c.image} alt={c.name} />
                          <div>
                            <div className="font-semibold text-slate-800">{c.name}</div>
                            <div className="text-xs text-slate-500 mt-1">
                              {c.sub?.slice(0, 3)?.join(", ")}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Featured / banner */}
                  <div className="col-span-2">
                    <h4 className="text-md font-bold text-slate-800 mb-3">Featured & Deals</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg p-5 flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02] transform">
                        <div>
                          <div className="text-sm font-bold text-emerald-800">Summer Sale</div>
                          <div className="text-xs text-slate-600 mt-1">
                            Up to 50% off select items
                          </div>
                        </div>
                        <img
                          src="/images/mega-banner-1.jpg"
                          alt="sale"
                          className="w-full h-24 object-contain rounded mt-3"
                        />
                      </div>
                      <div className="bg-slate-50 rounded-lg p-5 transition-transform duration-300 hover:scale-[1.02] transform">
                        <div className="text-sm font-bold text-slate-800">Top Picks</div>
                        <div className="mt-3 grid gap-2">
                          <div className="flex items-center gap-3">
                            <img
                              src="/images/p-thumb-1.jpg"
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <div className="text-sm font-medium">Wireless Speaker</div>
                              <div className="text-xs text-emerald-600">
                                From $29
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <img
                              src="/images/p-thumb-2.jpg"
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <div className="text-sm font-medium">Running Shoes</div>
                              <div className="text-xs text-emerald-600">
                                From $49
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/brands"
              className={`px-3 py-2 rounded flex items-center gap-2 transition-all duration-300 ${
                pathname === "/brands" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              <FaShopify className="text-sm" />
              Brands
            </Link>
            <Link
              to="/deals"
              className={`px-3 py-2 rounded flex items-center gap-2 transition-all duration-300 ${
                pathname === "/deals" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              <FaTags className="text-sm" />
              Deals
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded flex items-center gap-2 transition-all duration-300 ${
                pathname === "/about" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              <FaInfoCircle className="text-sm" />
              About Us
            </Link>
            <Link
              to="/blog"
              className={`px-3 py-2 rounded flex items-center gap-2 transition-all duration-300 ${
                pathname === "/blog" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              <FaBlog className="text-sm" />
              Blog
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded flex items-center gap-2 transition-all duration-300 ${
                pathname === "/contact" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              <FaHeadset className="text-sm" />
              Contact
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden">
        {/* Top bar with hamburger, logo, and icons */}
        <div className="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
          <button
            className="text-2xl p-2 rounded hover:bg-slate-100 transition-colors duration-200"
            aria-label="Open menu"
            onClick={() => setShowSidebar(true)}
          >
            <FaBars />
          </button>
          <Link to="/">
            <img src={logoSrc} alt="logo" className="h-8" />
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/card")}
              aria-label="Cart"
              className="p-2 rounded hover:bg-slate-100 transition-colors duration-200 relative"
            >
              <FaShoppingCart className="text-xl" />
              {card_product_count > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {card_product_count}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate(userInfo ? "/dashboard" : "/login")}
              aria-label="Account"
              className="p-2 rounded hover:bg-slate-100 transition-colors duration-200"
            >
              <FaUser className="text-xl" />
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="px-4 py-2 bg-white border-b border-slate-200">
          <div className="relative" ref={searchRef}>
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-stretch bg-slate-50 border rounded-full overflow-hidden"
              role="search"
            >
              <input
                type="text"
                value={searchValue}
                onFocus={() => setSearchSuggestions(true)}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2 text-sm bg-transparent focus:outline-none"
                aria-label="mobile search input"
              />
              <button
                type="submit"
                className="bg-emerald-600 text-white px-4 flex items-center transition-colors duration-200 hover:bg-emerald-700"
                aria-label="Search"
              >
                <FaSearch />
              </button>
            </form>
            {searchSuggestions.length > 0 && (
              <ul
                className="absolute mt-1 w-full bg-white border rounded-lg shadow-xl z-50 max-h-60 overflow-auto animate-slide-down"
                role="listbox"
              >
                {searchSuggestions.map((s, idx) => (
                  <li
                    key={idx}
                    role="option"
                    tabIndex={0}
                    onClick={() => handleSuggestionClick(s)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSuggestionClick(s);
                    }}
                    className="px-4 py-3 hover:bg-emerald-50 cursor-pointer transition-colors duration-200"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar/drawer with animation */}
      <aside
        className={`fixed top-0 left-0 w-72 h-full bg-white z-50 shadow-lg transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
        aria-hidden={!showSidebar}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" onClick={() => setShowSidebar(false)}>
            <img src={logoSrc} alt="logo" className="h-10" />
          </Link>
          <button
            onClick={() => setShowSidebar(false)}
            className="text-2xl p-1 hover:text-red-600 transition-colors duration-200"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            to="/"
            onClick={() => setShowSidebar(false)}
            className="block py-3 px-3 rounded hover:bg-emerald-50 transition-colors duration-200"
          >
            <FaHome className="inline mr-3 text-emerald-600" /> Home
          </Link>

          <details className="group">
            <summary className="py-3 px-3 rounded hover:bg-emerald-50 cursor-pointer flex items-center justify-between transition-colors duration-200">
              <span className="flex items-center">
                <FaList className="inline mr-3 text-emerald-600" /> All Categories
              </span>
              <FaChevronRight className="transition-transform duration-300 group-open:rotate-90" />
            </summary>
            <div className="pl-6 mt-2 space-y-2">
              {categorys.map((c, idx) => (
                <Link
                  key={idx}
                  to={`/products?category=${encodeURIComponent(c.name)}`}
                  onClick={() => setShowSidebar(false)}
                  className="block py-2 text-sm text-slate-700 hover:text-emerald-600 transition-colors duration-200"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </details>
          <Link
            to="/deals"
            onClick={() => setShowSidebar(false)}
            className="block py-3 px-3 rounded hover:bg-emerald-50 transition-colors duration-200"
          >
            <FaGift className="inline mr-3 text-emerald-600" /> Deals
          </Link>
          <Link
            to="/orders"
            onClick={() => setShowSidebar(false)}
            className="block py-3 px-3 rounded hover:bg-emerald-50 transition-colors duration-200"
          >
            <FaShoppingBag className="inline mr-3 text-emerald-600" /> Orders
          </Link>
          <Link
            to="/contact"
            onClick={() => setShowSidebar(false)}
            className="block py-3 px-3 rounded hover:bg-emerald-50 transition-colors duration-200"
          >
            <FaPhoneAlt className="inline mr-3 text-emerald-600" /> Contact
          </Link>

          <div className="pt-4 border-t border-slate-200">
            {userInfo ? (
              <div className="text-sm py-2 px-3 text-slate-700">Hello, {userInfo.name}</div>
            ) : (
              <Link
                to="/login"
                onClick={() => setShowSidebar(false)}
                className="block mt-2 py-3 px-3 bg-emerald-600 text-white rounded-lg text-center hover:bg-emerald-700 transition-colors duration-200"
              >
                <FaSignInAlt className="inline mr-2" /> Login / Register
              </Link>
            )}
          </div>
        </nav>
      </aside>

      {/* Mobile bottom navigation with icons */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-slate-200 z-40 shadow-lg">
        <div className="flex justify-around items-center max-w-xl mx-auto py-1">
          <Link
            to="/"
            className="w-1/5 py-2 text-center text-sm flex flex-col items-center justify-center transition-colors duration-200 hover:text-emerald-600"
          >
            <FaHome className="text-xl" />
            <div className="text-xs mt-1">Home</div>
          </Link>
          <button
            onClick={() => setShowSidebar(true)}
            className="w-1/5 py-2 text-center text-sm flex flex-col items-center justify-center transition-colors duration-200 hover:text-emerald-600"
            aria-label="Open categories"
          >
            <FaList className="text-xl" />
            <div className="text-xs mt-1">Categories</div>
          </button>
          <button
            onClick={() => navigate(userInfo ? "/dashboard/my-wishlist" : "/login")}
            className="w-1/5 py-2 text-center text-sm relative flex flex-col items-center justify-center transition-colors duration-200 hover:text-emerald-600"
            aria-label="Wishlist"
          >
            <FaHeart className="text-xl" />
            {wishlist_count > 0 && (
              <span className="absolute top-0 right-4 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {wishlist_count}
              </span>
            )}
            <div className="text-xs mt-1">Wishlist</div>
          </button>
          <button
            onClick={() => navigate(userInfo ? "/card" : "/login")}
            className="w-1/5 py-2 text-center text-sm relative flex flex-col items-center justify-center transition-colors duration-200 hover:text-emerald-600"
            aria-label="Cart"
          >
            <FaShoppingCart className="text-xl" />
            {card_product_count > 0 && (
              <span className="absolute top-0 right-4 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {card_product_count}
              </span>
            )}
            <div className="text-xs mt-1">Cart</div>
          </button>
          {/* <button
            onClick={() => navigate(userInfo ? "/dashboard" : "/login")}
            className="w-1/5 py-2 text-center text-sm flex flex-col items-center justify-center transition-colors duration-200 hover:text-emerald-600"
            aria-label="Account"
          >
            <FaUser className="text-xl" />
            <div className="text-xs mt-1">Account</div>
          </button> */}
        </div>
      </nav>
    </header>
  );
};

Header.propTypes = {
  logoSrc: PropTypes.string,
};

export default Header;
