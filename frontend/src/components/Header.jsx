import React, { useEffect, useState } from 'react';
import { MdEmail } from "react-icons/md";
import { IoMdPhonePortrait, IoMdArrowDropdown, IoIosArrowDown } from "react-icons/io";
import { FaFacebookF, FaList, FaLock, FaUser, FaHeart, FaCartShopping, FaPhoneAlt, FaCommentDots } from "react-icons/fa";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_card_products, get_wishlist_products } from '../store/reducers/cardReducer';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categorys } = useSelector(state => state.home);
    const { userInfo } = useSelector(state => state.auth);
    const { card_product_count, wishlist_count } = useSelector(state => state.card);
    const { pathname } = useLocation();

    const [showSidebar, setShowSidebar] = useState(false);
    const [categoryShow, setCategoryShow] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [category, setCategory] = useState('');

    const search = () => {
        navigate(`/products/search?category=${category}&value=${searchValue}`);
    };

    const redirect_card_page = () => {
        if (userInfo) navigate('/card');
        else navigate('/login');
    };

    useEffect(() => {
        if (userInfo) {
            dispatch(get_card_products(userInfo.id));
            dispatch(get_wishlist_products(userInfo.id));
        }
    }, [userInfo]);

    return (
        <div className='w-full bg-white sticky top-0 z-50 shadow-md'>

            {/* Top Bar - Desktop */}
            <div className='hidden md:flex justify-between items-center bg-[#caddff] px-6 h-10 text-sm text-slate-700'>
                <div className='flex gap-6'>
                    <div className='flex items-center gap-1'><MdEmail /> support@gmail.com</div>
                    <div className='flex items-center gap-1'><IoMdPhonePortrait /> +(123) 3243 343</div>
                </div>
                <div className='flex items-center gap-6'>
                    <div className='flex gap-3'>
                        <a href="#"><FaFacebookF /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaLinkedin /></a>
                        <a href="#"><FaGithub /></a>
                    </div>
                    {/* Language selector */}
                    <div className='relative group cursor-pointer flex items-center gap-1'>
                        <img src="/images/language.png" alt="lang" className='w-5 h-5' />
                        <IoMdArrowDropdown />
                        <ul className='absolute top-6 left-0 hidden group-hover:block bg-black text-white p-2 rounded'>
                            <li className='p-1 cursor-pointer'>English</li>
                            <li className='p-1 cursor-pointer'>Hindi</li>
                        </ul>
                    </div>
                    {/* User Login/Profile */}
                    {userInfo ? (
                        <div className='relative group cursor-pointer'>
                            <span className='flex items-center gap-1'><FaUser /> {userInfo.name}</span>
                            <ul className='absolute top-6 right-0 hidden group-hover:block bg-white border rounded shadow-md text-sm w-40'>
                                <li className='p-2 hover:bg-gray-100 cursor-pointer'><Link to='/dashboard'>Dashboard</Link></li>
                                <li className='p-2 hover:bg-gray-100 cursor-pointer'><Link to='/dashboard/my-orders'>Orders</Link></li>
                                <li className='p-2 hover:bg-gray-100 cursor-pointer'><Link to='/dashboard/my-wishlist'>Wishlist</Link></li>
                                <li className='p-2 hover:bg-gray-100 cursor-pointer'><Link to='/logout'>Logout</Link></li>
                            </ul>
                        </div>
                    ) : (
                        <Link to='/login' className='flex items-center gap-1'><FaLock /> Login</Link>
                    )}
                </div>
            </div>

            {/* Main Header */}
            <div className='flex justify-between items-center px-6 py-4'>
                {/* Logo */}
                <Link to='/' className='flex items-center'>
                    <img src="/images/logo.png" alt="logo" className='h-12' />
                </Link>

                {/* Desktop Navigation */}
                <ul className='hidden md:flex gap-6 font-bold uppercase'>
                    <li><Link className={`${pathname === '/' ? 'text-[#059473]' : 'text-slate-600'}`} to='/'>Home</Link></li>
                    <li className='relative group'>
                        <Link className={`${pathname.includes('/shops') ? 'text-[#059473]' : 'text-slate-600'}`} to='/shops'>Shop <IoIosArrowDown className='inline' /></Link>
                        {/* Mega Menu */}
                        <div className='absolute top-full left-0 hidden group-hover:block w-[800px] bg-white shadow-lg p-6 grid grid-cols-4 gap-4 z-50'>
                            {categorys.map((c, i) => (
                                <div key={i} className='flex flex-col gap-2'>
                                    <img src={c.image} alt={c.name} className='w-16 h-16 object-cover rounded'/>
                                    <Link to={`/products?category=${c.name}`} className='hover:text-[#059473]'>{c.name}</Link>
                                </div>
                            ))}
                        </div>
                    </li>
                    <li><Link className={`${pathname === '/blog' ? 'text-[#059473]' : 'text-slate-600'}`} to='/blog'>Blog</Link></li>
                    <li><Link className={`${pathname === '/about' ? 'text-[#059473]' : 'text-slate-600'}`} to='/about'>About Us</Link></li>
                    <li><Link className={`${pathname === '/contact' ? 'text-[#059473]' : 'text-slate-600'}`} to='/contact'>Contact Us</Link></li>
                </ul>

                {/* Search & Cart/Wishlist */}
                <div className='flex items-center gap-4'>
                    <select onChange={(e) => setCategory(e.target.value)} className='hidden md:block border px-2 py-1 rounded'>
                        <option value=''>All Categories</option>
                        {categorys.map((c,i) => <option key={i} value={c.name}>{c.name}</option>)}
                    </select>
                    <div className='relative'>
                        <input type='text' placeholder='Search Products' value={searchValue} onChange={e => setSearchValue(e.target.value)} className='border rounded-l px-2 py-1 w-64 md:w-80' />
                        <button onClick={search} className='bg-[#059473] text-white px-4 py-1 rounded-r'>Search</button>
                    </div>
                    {/* Wishlist */}
                    <div onClick={() => navigate(userInfo ? '/dashboard/my-wishlist' : '/login')} className='relative cursor-pointer'>
                        <FaHeart className='text-xl text-green-500' />
                        {wishlist_count > 0 && (
                            <span className='absolute -top-2 -right-2 bg-red-500 text-white w-4 h-4 text-xs flex items-center justify-center rounded-full'>{wishlist_count}</span>
                        )}
                    </div>
                    {/* Cart */}
                    <div onClick={redirect_card_page} className='relative cursor-pointer'>
                        <FaCartShopping className='text-xl text-green-500' />
                        {card_product_count > 0 && (
                            <span className='absolute -top-2 -right-2 bg-red-500 text-white w-4 h-4 text-xs flex items-center justify-center rounded-full'>{card_product_count}</span>
                        )}
                    </div>
                </div>

                {/* Mobile Hamburger */}
                <div className='md:hidden flex items-center'>
                    <button onClick={() => setShowSidebar(true)} className='text-2xl'><FaList /></button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div className={`fixed top-0 left-0 w-64 h-full bg-white z-50 shadow-lg transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
                <div className='flex justify-between items-center p-4'>
                    <Link to='/'><img src="/images/logo.png" alt="logo" className='h-10' /></Link>
                    <button onClick={() => setShowSidebar(false)} className='text-xl font-bold'>&times;</button>
                </div>
                <ul className='flex flex-col gap-4 px-4 mt-4'>
                    <li><Link to='/' className={`${pathname === '/' ? 'text-[#059473]' : 'text-slate-600'}`}>Home</Link></li>
                    <li><Link to='/shops' className={`${pathname === '/shops' ? 'text-[#059473]' : 'text-slate-600'}`}>Shop</Link></li>
                    <li><Link to='/blog' className={`${pathname === '/blog' ? 'text-[#059473]' : 'text-slate-600'}`}>Blog</Link></li>
                    <li><Link to='/about' className={`${pathname === '/about' ? 'text-[#059473]' : 'text-slate-600'}`}>About</Link></li>
                    <li><Link to='/contact' className={`${pathname === '/contact' ? 'text-[#059473]' : 'text-slate-600'}`}>Contact</Link></li>
                </ul>
                <div className='px-4 mt-6 flex items-center gap-3'>
                    <FaPhoneAlt /> <span>+123 4323 343</span>
                </div>
                <div className='px-4 mt-4 flex gap-4'>
                    <FaFacebookF /> <FaTwitter /> <FaLinkedin /> <FaGithub />
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className='fixed bottom-0 left-0 w-full bg-white shadow-md border-t md:hidden flex justify-between items-center px-6 py-2 z-40'>
                <Link to='/' className='flex flex-col items-center text-sm'><FaList className='text-xl'/><span>Home</span></Link>
                <Link to='/shops' className='flex flex-col items-center text-sm'><FaList className='text-xl'/><span>Categories</span></Link>
                <div onClick={redirect_card_page} className='flex flex-col items-center text-sm relative cursor-pointer'>
                    <FaCartShopping className='text-xl'/>
                    {card_product_count > 0 && <span className='absolute -top-1 -right-2 bg-red-500 text-white w-4 h-4 text-xs flex items-center justify-center rounded-full'>{card_product_count}</span>}
                    <span>Cart</span>
                </div>
                <Link to={userInfo ? '/dashboard/my-wishlist' : '/login'} className='flex flex-col items-center text-sm relative'>
                    <FaHeart className='text-xl'/>
                    {wishlist_count > 0 && <span className='absolute -top-1 -right-2 bg-red-500 text-white w-4 h-4 text-xs flex items-center justify-center rounded-full'>{wishlist_count}</span>}
                    <span>Wishlist</span>
                </Link>
                <Link to={userInfo ? '/dashboard' : '/login'} className='flex flex-col items-center text-sm'><FaUser className='text-xl'/><span>Account</span></Link>
            </div>

            {/* Floating Chat / Support Button */}
            <div className='fixed bottom-20 right-4 md:right-6 z-50'>
                <button className='bg-[#059473] text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition'>
                    <FaCommentDots className='text-xl'/>
                </button>
            </div>

        </div>
    );
};

export default Header;
