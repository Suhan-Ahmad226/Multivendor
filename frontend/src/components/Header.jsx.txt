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
  FaCartPlus,
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
  const [categoryShow, setCategoryShow] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [showWishlistPreview, setShowWishlistPreview] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [language, setLanguage] = useState("EN");
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
        .filter((p) => p.toLowerCase().includes(q))
        .slice(0, 8);
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
      setShowSearchOverlay(false);
    }
  };

  const redirect_card_page = () => {
    if (userInfo) navigate("/card");
    else navigate("/login");
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
        setShowSearchOverlay(false);
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
    <header className="w-full sticky top-0 z-50 overflow-x-hidden">
      {/* Top promo/contact bar - visible on md+ */}
      <div
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
          {/* social links with hover animations */}
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
          </nav>

          {/* Login/Profile with hover effect */}
          <div ref={accountRef} className="relative group">
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
            )}

            {/* Account dropdown */}
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
      </div>

      {/* Main header */}
      <div
        className="flex items-center justify-between px-4 md:px-6 py-3 bg-white shadow-sm flex-wrap"
        role="navigation"
        aria-label="main navigation"
      >
        {/* Left: Logo + Hamburger on mobile */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="md:hidden text-2xl p-2 rounded hover:bg-slate-100 transition-colors duration-200"
            aria-label="Open menu"
            onClick={() => setShowSidebar(true)}
          >
            <FaBars />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoSrc}
              alt="Brand logo"
              className="h-10 md:h-12 object-contain transition-transform duration-300 hover:scale-105"
            />
            <span className="sr-only">Go to homepage</span>
          </Link>
        </div>

        {/* Center: Navigation (desktop) + Search */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 md:gap-6 min-w-0">
          {/* Desktop nav with hover animations */}
          <nav className="hidden md:flex items-center gap-4 font-semibold uppercase text-sm">
            <Link
              to="/"
              className={`px-2 py-1 rounded transition-all duration-300 ${
                pathname === "/" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              Home
            </Link>

            <div className="relative group" ref={megaRef}>
              <button
                className={`px-2 py-1 rounded flex items-center gap-2 transition-all duration-300 group-hover:text-emerald-600 ${
                  pathname.startsWith("/shops")
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
                  className="absolute left-0 mt-2 w-full max-w-[900px] bg-white border shadow-lg p-4 grid grid-cols-4 gap-4 z-40 animate-fade-in"
                  role="menu"
                >
                  {/* Categories grid with images */}
                  <div className="col-span-2">
                    <h4 className="text-sm font-bold mb-2">Categories</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {categorys.slice(0, 8).map((c, i) => (
                        <Link
                          key={i}
                          to={`/products?category=${encodeURIComponent(c.name)}`}
                          className="flex items-center gap-3 p-2 rounded hover:bg-emerald-50 transition-colors duration-200 group"
                        >
                          <CategoryImage src={c.image} alt={c.name} />
                          <div>
                            <div className="font-semibold">{c.name}</div>
                            <div className="text-xs text-slate-500">
                              {c.sub?.slice(0, 3)?.join(", ")}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Featured / banner */}
                  <div className="col-span-2">
                    <h4 className="text-sm font-bold mb-2">Featured</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded p-4 flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02]">
                        <div>
                          <div className="text-sm font-bold">Summer Sale</div>
                          <div className="text-xs text-slate-600">
                            Up to 50% off select items
                          </div>
                        </div>
                        <img
                          src="/images/mega-banner-1.jpg"
                          alt="sale"
                          className="w-full h-24 object-cover rounded mt-3"
                        />
                      </div>
                      <div className="bg-slate-50 rounded p-4 transition-transform duration-300 hover:scale-[1.02]">
                        <div className="text-sm font-bold">Top Picks</div>
                        <div className="mt-2 grid gap-2">
                          <div className="flex items-center gap-2">
                            <img
                              src="/images/p-thumb-1.jpg"
                              alt=""
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div>
                              <div className="text-xs">Wireless Speaker</div>
                              <div className="text-xs text-slate-500">
                                From $29
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <img
                              src="/images/p-thumb-2.jpg"
                              alt=""
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div>
                              <div className="text-xs">Running Shoes</div>
                              <div className="text-xs text-slate-500">
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
              to="/deals"
              className={`px-2 py-1 rounded transition-all duration-300 ${
                pathname === "/deals" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              Deals
            </Link>
            <Link
              to="/blog"
              className={`px-2 py-1 rounded transition-all duration-300 ${
                pathname === "/blog" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              Blog
            </Link>
            <Link
              to="/about"
              className={`px-2 py-1 rounded transition-all duration-300 ${
                pathname === "/about" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-2 py-1 rounded transition-all duration-300 ${
                pathname === "/contact" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Search bar */}
          <div className="w-full max-w-[520px] relative" ref={searchRef}>
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-stretch bg-slate-50 border rounded overflow-hidden"
              role="search"
              aria-label="Search products"
            >
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="hidden md:block px-2 border-r bg-transparent text-sm cursor-pointer focus:outline-none"
                aria-label="Category filter"
              >
                <option value="">All Categories</option>
                {categorys.map((c, i) => (
                  <option key={i} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={searchValue}
                onFocus={() => setShowSearchOverlay(true)}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search products, brands and categories..."
                className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none"
                aria-label="Search input"
              />
              <button
                type="submit"
                className="bg-emerald-600 text-white px-4 py-2 flex items-center gap-2 transition-all duration-300 hover:bg-emerald-700"
                aria-label="Search"
              >
                <FaSearch />
                <span className="hidden md:inline">Search</span>
              </button>
            </form>

        {/* Suggestions dropdown with animation */}
            {searchSuggestions.length > 0 && (
              <ul
                className="absolute mt-1 w-full bg-white border rounded shadow-md z-50 max-h-60 overflow-auto animate-slide-down"
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
                    className="px-3 py-2 hover:bg-emerald-50 cursor-pointer transition-colors duration-200"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right: icons */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative group">
            <button
              className="p-2 rounded hover:bg-slate-100 transition-colors duration-200"
              aria-label="Notifications"
            >
              <FaBell />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
          {/* Wishlist */}
          <div ref={wishlistRef} className="relative group">
            <button
              className="p-2 rounded hover:bg-slate-100 transition-colors duration-200"
              aria-label="Wishlist"
              onClick={() => {
                if (!userInfo) navigate("/login");
                else setShowWishlistPreview((s) => !s);
              }}
            >
              <FaHeart className="text-emerald-600" />
              {wishlist_count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  {wishlist_count}
                </span>
              )}
            </button>

            {showWishlistPreview && userInfo && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg p-2 z-50 animate-fade-in">
                <div className="text-sm font-semibold mb-2">Wishlist</div>
                <div className="text-xs text-slate-500">
                  You have {wishlist_count} items
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
              className="p-2 rounded hover:bg-slate-100 transition-colors duration-200"
            >
              <FaCartPlus className="text-emerald-600" />
              {card_product_count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  {card_product_count}
                </span>
              )}
            </button>

            {/* cart preview with animation */}
            {showCartPreview && userInfo && (
              <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg p-3 z-50 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Cart</div>
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
                        <div className="text-sm font-semibold">${p.price}</div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-sm text-slate-500">
                      Your cart is empty
                    </div>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => navigate("/card")}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded transition-colors duration-300 hover:bg-emerald-700"
                  >
                    View Cart
                  </button>
                  <button
                    onClick={() => navigate("/checkout")}
                    className="flex-1 border rounded py-2 transition-colors duration-300 hover:bg-slate-100"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile search icon */}
          <div className="md:hidden">
            <button
              className="p-2 rounded hover:bg-slate-100 transition-colors duration-200"
              aria-label="Open search"
              onClick={() => setShowSearchOverlay(true)}
            >
              <FaSearch />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar/drawer with animation */}
      <aside
        className={`fixed top-0 left-0 w-72 h-full bg-white z-50 shadow-lg transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
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
            className="block py-2 px-2 rounded hover:bg-emerald-50 transition-colors duration-200"
          >
            <FaHome className="inline mr-2 text-emerald-600" /> Home
          </Link>
          <details className="group">
            <summary className="py-2 px-2 rounded hover:bg-emerald-50 cursor-pointer flex items-center justify-between transition-colors duration-200">
              <span className="flex items-center">
                <FaList className="inline mr-2 text-emerald-600" /> Categories
              </span>
              <FaChevronRight className="transition-transform duration-300 group-open:rotate-90" />
            </summary>
            <div className="pl-4 mt-2 space-y-1">
              {categorys.map((c, idx) => (
                <Link
                  key={idx}
                  to={`/products?category=${encodeURIComponent(c.name)}`}
                  onClick={() => setShowSidebar(false)}
                  className="block py-1 text-sm text-slate-700 hover:text-emerald-600 transition-colors duration-200"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </details>

          <Link
            to="/deals"
            onClick={() => setShowSidebar(false)}
            className="block py-2 px-2 rounded hover:bg-emerald-50 transition-colors duration-200"
          >
            <FaGift className="inline mr-2 text-emerald-600" /> Deals
          </Link>
          <Link
            to="/orders"
            onClick={() => setShowSidebar(false)}
            className="block py-2 px-2 rounded hover:bg-emerald-50 transition-colors duration-200"
          >
            <FaShoppingBag className="inline mr-2 text-emerald-600" /> Orders
          </Link>
          <Link
            to="/contact"
            onClick={() => setShowSidebar(false)}
            className="block py-2 px-2 rounded hover:bg-emerald-50 transition-colors duration-200"
          >
            <FaPhoneAlt className="inline mr-2 text-emerald-600" /> Contact
          </Link>

          <div className="pt-4 border-t">
            {userInfo ? (
              <div className="text-sm">Hello, {userInfo.name}</div>
            ) : (
              <Link
                to="/login"
                onClick={() => setShowSidebar(false)}
                className="block mt-2 py-2 px-2 bg-emerald-600 text-white rounded text-center hover:bg-emerald-700 transition-colors duration-200"
              >
                <FaSignInAlt className="inline mr-2" /> Login / Register
              </Link>
            )}
          </div>
        </nav>

        <div className="absolute bottom-4 left-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <FaPhoneAlt />
            <a href="tel:+1234323343">+123 4323 343</a>
          </div>
          <div className="mt-2 flex gap-2">
            <a href="#" aria-label="facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="twitter">
              <FaTwitter />
            </a>
          </div>
        </div>
      </aside>

      {/* Mobile bottom navigation with icons instead of emojis */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t z-40 shadow-lg">
        <div className="flex justify-between items-center max-w-xl mx-auto">
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
            onClick={() => navigate("/card")}
            className="w-1/5 py-2 text-center text-sm relative flex flex-col items-center justify-center transition-colors duration-200 hover:text-emerald-600"
            aria-label="Cart"
          >
            <FaCartPlus className="text-xl" />
            {card_product_count > 0 && (
              <span className="absolute -top-1 right-6 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {card_product_count}
              </span>
            )}
            <div className="text-xs mt-1">Cart</div>
          </button>
          <button
            onClick={() => navigate("/dashboard/my-wishlist")}
            className="w-1/5 py-2 text-center text-sm flex flex-col items-center justify-center transition-colors duration-200 hover:text-emerald-600"
            aria-label="Wishlist"
          >
            <FaHeart className="text-xl" />
            <div className="text-xs mt-1">Wishlist</div>
          </button>
          <button
            onClick={() => navigate(userInfo ? "/dashboard" : "/login")}
            className="w-1/5 py-2 text-center text-sm flex flex-col items-center justify-center transition-colors duration-200 hover:text-emerald-600"
            aria-label="Account"
          >
            <FaUser className="text-xl" />
            <div className="text-xs mt-1">Account</div>
          </button>
        </div>
      </nav>

      {/* Search overlay for mobile */}
      {showSearchOverlay && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start p-4 md:hidden transition-opacity duration-300 animate-fade-in">
          <div className="w-full bg-white rounded shadow-lg p-3">
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
                placeholder="Search products..."
                aria-label="mobile search"
              />
              <button
                onClick={handleSearchSubmit}
                className="bg-emerald-600 text-white px-4 py-2 rounded transition-colors duration-200 hover:bg-emerald-700"
              >
                Search
              </button>
              <button
                onClick={() => setShowSearchOverlay(false)}
                className="p-2 text-xl hover:text-red-600 transition-colors duration-200"
                aria-label="Close search"
              >
                <FaTimes />
              </button>
            </div>

            {searchSuggestions.length > 0 && (
              <ul className="mt-2 animate-slide-down">
                {searchSuggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="py-2 border-b cursor-pointer hover:bg-slate-50 transition-colors duration-200"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
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
