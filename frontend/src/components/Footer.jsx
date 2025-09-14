import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { FaTwitter, FaHeart, FaCartShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const { card_product_count, wishlist_count } = useSelector(
    (state) => state.card
  );

  // Active link style
  const linkClass = (path) =>
    `hover:text-[#059473] transition ${
      location.pathname === path ? "text-[#059473] font-bold" : ""
    }`;

  return (
    <footer className="bg-[#f3f6fa] text-slate-600 text-sm">
      {/* Top Section */}
      <div className="w-[85%] mx-auto py-14 border-b grid grid-cols-12 gap-8 sm:grid-cols-6 xs:grid-cols-1">
        {/* Company Info */}
        <div className="col-span-3 sm:col-span-6 xs:col-span-12">
          <img
            src="https://i.ibb.co/7yZVb4j/nittonjoni-logo.png"
            alt="Nittonjoni Logo"
            className="w-[180px] h-[60px] mb-3"
          />
          <p className="mb-3 leading-6">
            Nittonjoni is your trusted online shopping destination. We deliver
            genuine products at affordable prices with a 30-day replacement
            guarantee.
          </p>
          <ul className="space-y-1">
            <li>📍 New Market, Dhaka-1205</li>
            <li>📞 +8801518947696, +8801401424534</li>
            <li>📧 nittyonjoni@gmail.com</li>
            <li>🕒 Sat - Thu : 10AM - 10PM</li>
          </ul>
        </div>

        {/* Useful Links */}
        <div className="col-span-2 sm:col-span-3 xs:col-span-6">
          <h2 className="font-bold text-lg mb-3">Useful Links</h2>
          <ul className="space-y-2 font-semibold">
            <li>
              <Link to="/about" className={linkClass("/about")}>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className={linkClass("/contact")}>
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                className={linkClass("/privacy-policy")}
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className={linkClass("/terms")}>
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/refund" className={linkClass("/refund")}>
                Return & Refund Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div className="col-span-2 sm:col-span-3 xs:col-span-6">
          <h2 className="font-bold text-lg mb-3">Customer Support</h2>
          <ul className="space-y-2 font-semibold">
            <li>
              <Link to="/faq" className={linkClass("/faq")}>
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/delivery" className={linkClass("/delivery")}>
                Delivery Info
              </Link>
            </li>
            <li>
              <Link to="/secure-payment" className={linkClass("/secure-payment")}>
                Secure Payment
              </Link>
            </li>
            <li>
              <Link to="/track-order" className={linkClass("/track-order")}>
                Track Order
              </Link>
            </li>
            <li>
              <Link to="/guarantee" className={linkClass("/guarantee")}>
                30 Days Guarantee
              </Link>
            </li>
          </ul>
        </div>

        {/* My Account */}
        <div className="col-span-2 sm:col-span-6 xs:col-span-6">
          <h2 className="font-bold text-lg mb-3">My Account</h2>
          <ul className="space-y-2 font-semibold">
            <li>
              <Link to="/login" className={linkClass("/login")}>
                Login / Register
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/my-orders"
                className={linkClass("/dashboard/my-orders")}
              >
                My Orders
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/my-wishlist"
                className={linkClass("/dashboard/my-wishlist")}
              >
                Wishlist
              </Link>
            </li>
            <li>
              <Link to="/cart" className={linkClass("/cart")}>
                Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="col-span-3 sm:col-span-12">
          <h2 className="font-bold text-lg mb-3">Join Our Newsletter</h2>
          <p className="mb-3">Subscribe to get updates on offers & new arrivals.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 border w-full rounded-l-md outline-none"
            />
            <button className="bg-[#059473] hover:bg-[#04785E] text-white px-5 rounded-r-md font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Social + Payment + Apps */}
      <div className="w-[85%] mx-auto py-10 border-b grid grid-cols-12 gap-8 sm:grid-cols-6 xs:grid-cols-1">
        {/* Social */}
        <div className="col-span-3 sm:col-span-6">
          <h2 className="font-bold text-lg mb-3">Follow Us</h2>
          <div className="flex gap-3">
            {[
              { icon: <FaFacebookF />, link: "#" },
              { icon: <FaInstagram />, link: "#" },
              { icon: <FaTwitter />, link: "#" },
              { icon: <FaYoutube />, link: "#" },
              { icon: <FaLinkedin />, link: "#" },
            ].map((item, i) => (
              <a
                key={i}
                href={item.link}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-[#059473] hover:text-white transition"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div className="col-span-5 sm:col-span-6">
          <h2 className="font-bold text-lg mb-3">We Accept</h2>
          <div className="flex gap-3 flex-wrap items-center">
            <img
              src="https://i.ibb.co/kc9v4L5/cash-on-delivery.png"
              alt="Cash on Delivery"
              className="w-14"
            />
            <img
              src="https://download.logo.wine/logo/Bkash/Bkash-Logo.wine.png"
              alt="bKash"
              className="w-14"
            />
            <img
              src="https://seeklogo.com/images/N/nagad-logo-3414E3F5C2-seeklogo.com.png"
              alt="Nagad"
              className="w-14"
            />
            <img
              src="https://i.ibb.co/4WSrTQS/rocket.png"
              alt="Rocket"
              className="w-14"
            />
            <img
              src="https://seeklogo.com/images/S/sslcommerz-logo-331C1E65C5-seeklogo.com.png"
              alt="SSLCommerz"
              className="w-20"
            />
            <img
              src="https://i.ibb.co/jVp1yHd/dbbl.png"
              alt="DBBL"
              className="w-16"
            />
            <img
              src="https://i.ibb.co/Y3TgM5d/community-police.png"
              alt="Community Police"
              className="w-16"
            />
          </div>
        </div>

        {/* App Download */}
        <div className="col-span-4 sm:col-span-12">
          <h2 className="font-bold text-lg mb-3">Download Our App</h2>
          <div className="flex gap-3">
            <img
              src="https://i.ibb.co/fn3S9xM/playstore.png"
              alt="Google Play"
              className="w-32 cursor-pointer hover:opacity-80"
            />
            <img
              src="https://i.ibb.co/JQ3dC9t/appstore.png"
              alt="App Store"
              className="w-32 cursor-pointer hover:opacity-80"
            />
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="w-full text-center py-5 text-sm text-slate-500">
        © {new Date().getFullYear()} Nittonjoni. All Rights Reserved. | Developed
        by Suhan
      </div>

      {/* Floating Buttons */}
      <div className="hidden fixed md-lg:block w-[50px] h-[150px] bottom-3 right-2 bg-white rounded-full p-2 shadow-lg">
        <div className="flex flex-col gap-3 justify-center items-center h-full">
          {/* Cart */}
          <div
            onClick={() => navigate(userInfo ? "/cart" : "/login")}
            className="relative w-10 h-10 bg-[#e2e2e2] rounded-full flex justify-center items-center cursor-pointer hover:bg-[#059473] hover:text-white transition"
          >
            <FaCartShopping className="text-green-600 text-lg" />
            {card_product_count !== 0 && (
              <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 text-white text-xs flex justify-center items-center rounded-full">
                {card_product_count}
              </span>
            )}
          </div>

          {/* Wishlist */}
          <div
            onClick={() =>
              navigate(userInfo ? "/dashboard/my-wishlist" : "/login")
            }
            className="relative w-10 h-10 bg-[#e2e2e2] rounded-full flex justify-center items-center cursor-pointer hover:bg-[#059473] hover:text-white transition"
          >
            <FaHeart className="text-green-600 text-lg" />
            {wishlist_count !== 0 && (
              <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 text-white text-xs flex justify-center items-center rounded-full">
                {wishlist_count}
              </span>
            )}
          </div>

          {/* WhatsApp */}
          <a
            href="https://wa.me/8801518947696"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 bg-green-500 rounded-full flex justify-center items-center text-white hover:bg-green-600 transition"
          >
            💬
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
