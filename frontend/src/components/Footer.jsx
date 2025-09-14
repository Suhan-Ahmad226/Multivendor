import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaTwitter, FaHeart, FaCartShopping } from "react-icons/fa6";
import { useSelector } from 'react-redux';

const Footer = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector(state => state.auth);
    const { card_product_count, wishlist_count } = useSelector(state => state.card);

    return (
        <footer className="bg-[#f3f6fa] text-slate-600">
            <div className="w-[85%] mx-auto flex flex-wrap py-16 border-b">
                
                {/* Company Info */}
                <div className="w-3/12 lg:w-6/12 sm:w-full mb-6">
                    <img src="/images/logo.png" alt="logo" className="w-[180px] h-[60px] mb-3" />
                    <p className="text-sm mb-3">
                        Nittonjoni is your trusted online shopping destination. We deliver genuine products at affordable prices with a 30-day replacement guarantee.
                    </p>
                    <ul className="text-sm">
                        <li>📍 New Market, Dhaka-1205</li>
                        <li>📞 +8801518947696, +8801401424534</li>
                        <li>📧 nittyonjoni@gmail.com</li>
                        <li>🕒 Sat - Thu : 10AM - 10PM</li>
                    </ul>
                </div>

                {/* Useful Links */}
                <div className="w-3/12 lg:w-3/12 sm:w-1/2 mb-6">
                    <h2 className="font-bold text-lg mb-3">Useful Links</h2>
                    <ul className="space-y-2 text-sm font-semibold">
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms & Conditions</Link></li>
                        <li><Link to="/refund">Return & Refund Policy</Link></li>
                    </ul>
                </div>

                {/* Customer Support */}
                <div className="w-3/12 lg:w-3/12 sm:w-1/2 mb-6">
                    <h2 className="font-bold text-lg mb-3">Customer Support</h2>
                    <ul className="space-y-2 text-sm font-semibold">
                        <li><Link to="/faq">FAQs</Link></li>
                        <li><Link to="/delivery">Delivery Information</Link></li>
                        <li><Link to="/secure-payment">Secure Payment</Link></li>
                        <li><Link to="/track-order">Track Order</Link></li>
                        <li><Link to="/guarantee">30 Days Guarantee</Link></li>
                    </ul>
                </div>

                {/* My Account */}
                <div className="w-3/12 lg:w-6/12 sm:w-full mb-6">
                    <h2 className="font-bold text-lg mb-3">My Account</h2>
                    <ul className="space-y-2 text-sm font-semibold">
                        <li><Link to="/login">Login / Register</Link></li>
                        <li><Link to="/dashboard/my-orders">My Orders</Link></li>
                        <li><Link to="/dashboard/my-wishlist">Wishlist</Link></li>
                        <li><Link to="/cart">Cart</Link></li>
                    </ul>
                </div>
            </div>

            {/* Newsletter + Social + Payment */}
            <div className="w-[85%] mx-auto py-10 flex flex-wrap justify-between items-start border-b">
                
                {/* Newsletter */}
                <div className="w-5/12 lg:w-full mb-6">
                    <h2 className="font-bold text-lg mb-3">Join Our Newsletter</h2>
                    <p className="text-sm mb-3">Subscribe to get updates on offers and new arrivals.</p>
                    <div className="flex">
                        <input type="email" placeholder="Enter your email" className="px-3 py-2 border w-full rounded-l-md outline-none" />
                        <button className="bg-[#059473] text-white px-5 rounded-r-md font-semibold">Subscribe</button>
                    </div>
                </div>

                {/* Social */}
                <div className="w-3/12 lg:w-1/2 sm:w-full mb-6">
                    <h2 className="font-bold text-lg mb-3">Follow Us</h2>
                    <div className="flex gap-3">
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-[#059473] hover:text-white"><FaFacebookF/></a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-[#059473] hover:text-white"><FaInstagram/></a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-[#059473] hover:text-white"><FaTwitter/></a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-[#059473] hover:text-white"><FaYoutube/></a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-[#059473] hover:text-white"><FaLinkedin/></a>
                    </div>
                </div>

                {/* Payment */}
                <div className="w-3/12 lg:w-1/2 sm:w-full mb-6">
                    <h2 className="font-bold text-lg mb-3">We Accept</h2>
                    <div className="flex gap-3">
                        <img src="/images/payment/visa.png" alt="Visa" className="w-12"/>
                        <img src="/images/payment/mastercard.png" alt="MasterCard" className="w-12"/>
                        <img src="/images/payment/bkash.png" alt="bKash" className="w-12"/>
                        <img src="/images/payment/nagad.png" alt="Nagad" className="w-12"/>
                        <img src="/images/payment/sslcommerz.png" alt="SSLCommerz" className="w-20"/>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="w-full text-center py-5 text-sm text-slate-500">
                © {new Date().getFullYear()} Nittonjoni. All Rights Reserved. | Developed by Suhan
            </div>

            {/* Floating Buttons */}
            <div className="hidden fixed md-lg:block w-[50px] h-[150px] bottom-3 right-2 bg-white rounded-full p-2 shadow-lg">
                <div className="flex flex-col gap-3 justify-center items-center h-full">
                    
                    {/* Cart */}
                    <div onClick={() => navigate(userInfo ? '/cart' : '/login')} className="relative w-10 h-10 bg-[#e2e2e2] rounded-full flex justify-center items-center cursor-pointer">
                        <FaCartShopping className="text-green-500 text-lg"/>
                        {card_product_count !== 0 && (
                            <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 text-white text-xs flex justify-center items-center rounded-full">
                                {card_product_count}
                            </span>
                        )}
                    </div>

                    {/* Wishlist */}
                    <div onClick={() => navigate(userInfo ? '/dashboard/my-wishlist' : '/login')} className="relative w-10 h-10 bg-[#e2e2e2] rounded-full flex justify-center items-center cursor-pointer">
                        <FaHeart className="text-green-500 text-lg"/>
                        {wishlist_count !== 0 && (
                            <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 text-white text-xs flex justify-center items-center rounded-full">
                                {wishlist_count}
                            </span>
                        )}
                    </div>

                    {/* WhatsApp */}
                    <a href="https://wa.me/8801518947696" target="_blank" rel="noreferrer" className="w-10 h-10 bg-green-500 rounded-full flex justify-center items-center text-white">
                        💬
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
