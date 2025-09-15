import React, { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { IoMdPhonePortrait } from "react-icons/io";
import { FaFacebookF, FaList, FaLock, FaUser } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  get_card_products,
  get_wishlist_products,
} from "../store/reducers/cardReducer";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categorys } = useSelector((state) => state.home);
  const { userInfo } = useSelector((state) => state.auth);
  const { card_product_count, wishlist_count } = useSelector(
    (state) => state.card
  );

  const { pathname } = useLocation();

  const [showShidebar, setShowShidebar] = useState(true);
  const [categoryShow, setCategoryShow] = useState(true);

  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("");

  const search = () => {
    navigate(`/products/search?category=${category}&&value=${searchValue}`);
  };

  const redirect_card_page = () => {
    if (userInfo) {
      navigate("/card");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (userInfo) {
      dispatch(get_card_products(userInfo.id));
      dispatch(get_wishlist_products(userInfo.id));
    }
  }, [userInfo]);

  return (
    <header className="w-full bg-white sticky top-0 z-[999] shadow-md">
      {/* 🔹 Top Bar */}
      <div className="header-top bg-[#caddff] hidden md:block">
        <div className="w-[90%] mx-auto">
          <div className="flex justify-between items-center h-[40px] text-slate-600 text-sm">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <MdEmail />
                <span>support@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <IoMdPhonePortrait />
                <span>+(123) 3243 343</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Social */}
              <div className="flex gap-3 text-slate-700">
                <a href="#"><FaFacebookF /></a>
                <a href="#"><FaTwitter /></a>
                <a href="#"><FaLinkedin /></a>
                <a href="#"><FaGithub /></a>
              </div>

              {/* Language */}
              <div className="relative group cursor-pointer flex items-center gap-1">
                <img src="/images/language.png" alt="lang" className="w-5 h-5" />
                <IoMdArrowDropdown />
                <ul className="absolute top-6 left-0 w-[100px] bg-black text-white rounded-sm invisible group-hover:visible transition-all">
                  <li className="px-3 py-1 hover:bg-gray-700">English</li>
                  <li className="px-3 py-1 hover:bg-gray-700">Hindi</li>
                </ul>
              </div>

              {/* Login / User */}
              {userInfo ? (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-black"
                >
                  <FaUser /> {userInfo.name}
                </Link>
              ) : (
                <Link to="/login" className="flex items-center gap-2 text-black">
                  <FaLock /> Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Main Header */}
      <div className="w-[90%] mx-auto py-3 flex items-center justify-between gap-6 flex-wrap">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <img src="/images/logo.png" alt="logo" className="h-[50px]" />
          </Link>
          {/* Mobile menu btn */}
          <button
            className="lg:hidden border p-2 rounded-sm"
            onClick={() => setShowShidebar(false)}
          >
            <FaList />
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex-1">
          <div className="flex border rounded-md overflow-hidden h-[45px]">
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="px-2 text-sm text-slate-600 bg-gray-100"
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
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search for products..."
              className="w-full px-3 outline-none"
            />
            <button
              onClick={search}
              className="bg-[#059473] px-6 text-white font-semibold"
            >
              Search
            </button>
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          {/* Wishlist */}
          <div
            onClick={() =>
              navigate(userInfo ? "/dashboard/my-wishlist" : "/login")
            }
            className="relative cursor-pointer"
          >
            <FaHeart className="text-2xl text-green-500" />
            {wishlist_count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {wishlist_count}
              </span>
            )}
          </div>

          {/* Cart */}
          <div
            onClick={redirect_card_page}
            className="relative cursor-pointer"
          >
            <FaCartShopping className="text-2xl text-green-500" />
            {card_product_count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {card_product_count}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 Categories Bar */}
      <div className="bg-[#059473] text-white">
        <div className="w-[90%] mx-auto flex items-center justify-between">
          {/* All Category */}
          <div
            onClick={() => setCategoryShow(!categoryShow)}
            className="flex items-center gap-2 py-3 cursor-pointer font-semibold"
          >
            <FaList /> All Categories <IoIosArrowDown />
          </div>

          {/* Nav Menu */}
          <ul className="hidden md:flex gap-6 text-sm font-bold uppercase">
            <li>
              <Link
                to="/"
                className={`hover:text-yellow-300 ${
                  pathname === "/" ? "text-yellow-300" : ""
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/shops"
                className={`hover:text-yellow-300 ${
                  pathname === "/shops" ? "text-yellow-300" : ""
                }`}
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className={`hover:text-yellow-300 ${
                  pathname === "/blog" ? "text-yellow-300" : ""
                }`}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`hover:text-yellow-300 ${
                  pathname === "/about" ? "text-yellow-300" : ""
                }`}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`hover:text-yellow-300 ${
                  pathname === "/contact" ? "text-yellow-300" : ""
                }`}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Category Dropdown */}
        {!categoryShow && (
          <div className="bg-white text-black shadow-md absolute w-[250px]">
            <ul>
              {categorys.map((c, i) => (
                <li
                  key={i}
                  className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={c.image}
                    alt=""
                    className="w-6 h-6 rounded-full"
                  />
                  <Link to={`/products?category=${c.name}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
