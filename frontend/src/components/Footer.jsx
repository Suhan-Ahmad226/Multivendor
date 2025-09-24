import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { FaHeart, FaCartShopping } from "react-icons/fa6";

const Footer = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.auth);
  const { card_product_count, wishlist_count } = useSelector(state => state.card);

  return (
    <footer className="bg-[#f3f6fa] text-slate-700">
      {/* Top Section */}
      <div className="w-[90%] mx-auto py-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 border-b">
        {/* Logo & Contact */}
        <div className="space-y-4">
          <img className="w-[180px] h-[65px] object-contain" src="/images/logo.png" alt="logo" />
          <ul className="text-sm space-y-2">
            <li>📍 New Market, Dhaka-1205</li>
            <li>📞 +8801518947696, +8801401424534</li>
            <li>✉️ nittyonjoni@gmail.com</li>
          </ul>
        </div>

        {/* Useful Links */}
        <div className="md:col-span-2 lg:col-span-2 grid grid-cols-2 gap-8 sm:gap-4">
          <div>
            <h2 className="font-bold text-lg mb-4 relative after:block after:w-10 after:h-[2px] after:bg-[#059473] after:mt-2">Useful Links</h2>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link className="hover:text-[#059473] transition">About Us</Link></li>
              <li><Link className="hover:text-[#059473] transition">About Our Shop</Link></li>
              <li><Link className="hover:text-[#059473] transition">Delivery Information</Link></li>
              <li><Link className="hover:text-[#059473] transition">Privacy Policy</Link></li>
              <li><Link className="hover:text-[#059473] transition">Blogs</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-4 relative after:block after:w-10 after:h-[2px] after:bg-[#059473] after:mt-2">Our Services</h2>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link className="hover:text-[#059473] transition">Our Service</Link></li>
              <li><Link className="hover:text-[#059473] transition">Company Profile</Link></li>
              <li><Link className="hover:text-[#059473] transition">Delivery Information</Link></li>
              <li><Link className="hover:text-[#059473] transition">Privacy Policy</Link></li>
              <li><Link className="hover:text-[#059473] transition">Blogs</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter & Socials */}
        <div>
          <h2 className="font-bold text-lg mb-4 relative after:block after:w-10 after:h-[2px] after:bg-[#059473] after:mt-2">Join Our Shop</h2>
          <p className="text-sm mb-3">Get Email updates about our latest offers & special deals.</p>
          <div className="relative w-full h-[48px] bg-white border rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Enter Your Email"
              className="h-full w-full px-3 outline-none text-sm"
            />
            <button className="absolute right-0 top-0 h-full bg-[#059473] text-white px-5 font-semibold text-sm hover:bg-[#047a60] transition">Subscribe</button>
          </div>

          {/* Social Icons */}
          <ul className="flex gap-3 mt-5">
            <li><a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#059473] hover:text-white transition shadow"><FaFacebookF /></a></li>
            <li><a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#059473] hover:text-white transition shadow"><FaTwitter /></a></li>
            <li><a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#059473] hover:text-white transition shadow"><FaLinkedin /></a></li>
            <li><a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#059473] hover:text-white transition shadow"><FaGithub /></a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-[90%] mx-auto py-5 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} <span className="font-semibold">Nittyonjoni</span> — All Rights Reserved.
      </div>

      {/* Floating Cart & Wishlist */}
      <div className="hidden md:block fixed bottom-4 right-3 w-[52px] h-[115px] bg-white rounded-full p-2 shadow-lg animate-bounce">
        <div className="flex flex-col items-center gap-3 h-full">
          {/* Cart */}
          <div onClick={() => navigate(userInfo ? '/card' : '/login')} className="relative w-[38px] h-[38px] flex items-center justify-center rounded-full bg-[#e2e2e2] cursor-pointer hover:scale-110 transition">
            <FaCartShopping className="text-green-600 text-lg" />
            {card_product_count > 0 && (
              <div className="absolute -top-1 -right-2 w-[20px] h-[20px] bg-red-500 rounded-full text-white flex items-center justify-center text-xs">
                {card_product_count}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div onClick={() => navigate(userInfo ? '/dashboard/my-wishlist' : '/login')} className="relative w-[38px] h-[38px] flex items-center justify-center rounded-full bg-[#e2e2e2] cursor-pointer hover:scale-110 transition">
            <FaHeart className="text-green-600 text-lg" />
            {wishlist_count > 0 && (
              <div className="absolute -top-1 -right-2 w-[20px] h-[20px] bg-red-500 rounded-full text-white flex items-center justify-center text-xs">
                {wishlist_count}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
