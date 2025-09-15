import React, { useEffect, useState } from 'react';
import { MdEmail } from "react-icons/md";
import { IoMdPhonePortrait, IoMdArrowDropdown } from "react-icons/io";
import { FaFacebookF, FaList, FaLock, FaUser, FaHeart, FaCartShopping, FaPhoneAlt } from "react-icons/fa";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io"; 
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
    const [showCategory, setShowCategory] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [category, setCategory] = useState('');

    const search = () => {
        navigate(`/products/search?category=${category}&&value=${searchValue}`);
    }

    const redirect_card_page = () => {
        if (userInfo) navigate('/card');
        else navigate('/login');
    }

    useEffect(() => {
        if (userInfo) {
            dispatch(get_card_products(userInfo.id));
            dispatch(get_wishlist_products(userInfo.id));
        }
    }, [userInfo]);

    return (
        <header className='w-full bg-white shadow-md relative z-50'>
            {/* Top Bar */}
            <div className='hidden md:flex justify-between items-center bg-[#caddff] px-8 h-10 text-sm text-slate-700'>
                <ul className='flex gap-6'>
                    <li className='flex items-center gap-1'><MdEmail /> support@gmail.com</li>
                    <li className='flex items-center gap-1'><IoMdPhonePortrait /> +(123) 3243 343</li>
                </ul>
                <div className='flex items-center gap-6'>
                    <div className='flex gap-3 text-slate-700'>
                        <a href="#"><FaFacebookF /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaLinkedin /></a>
                        <a href="#"><FaGithub /></a>
                    </div>
                    <div className='relative group cursor-pointer'>
                        <img src="/images/language.png" className="w-5 h-5" alt="lang" />
                        <IoMdArrowDropdown className="inline ml-1" />
                        <ul className='absolute top-6 left-0 hidden group-hover:flex flex-col bg-black text-white rounded p-2 text-sm'>
                            <li className='py-1 px-2 hover:bg-gray-700 cursor-pointer'>Hindi</li>
                            <li className='py-1 px-2 hover:bg-gray-700 cursor-pointer'>English</li>
                        </ul>
                    </div>
                    {userInfo ? 
                        <Link to='/dashboard' className='flex items-center gap-1 text-black'><FaUser /> {userInfo.name}</Link> :
                        <Link to='/login' className='flex items-center gap-1 text-black'><FaLock /> Login</Link>
                    }
                </div>
            </div>

            {/* Main Header */}
            <div className='flex justify-between items-center px-4 md:px-8 py-3 md:py-5'>
                {/* Logo */}
                <Link to='/'>
                    <img src="/images/logo.png" alt="logo" className='h-10 md:h-16' />
                </Link>

                {/* Desktop Menu */}
                <nav className='hidden md:flex items-center gap-6 font-semibold uppercase'>
                    <Link to='/' className={`${pathname==='/'?'text-[#059473]':'text-slate-600'} hover:text-[#059473]`}>Home</Link>
                    <Link to='/shops' className={`${pathname==='/shops'?'text-[#059473]':'text-slate-600'} hover:text-[#059473]`}>Shop</Link>
                    <Link to='/blog' className={`${pathname==='/blog'?'text-[#059473]':'text-slate-600'} hover:text-[#059473]`}>Blog</Link>
                    <Link to='/about' className={`${pathname==='/about'?'text-[#059473]':'text-slate-600'} hover:text-[#059473]`}>About</Link>
                    <Link to='/contact' className={`${pathname==='/contact'?'text-[#059473]':'text-slate-600'} hover:text-[#059473]`}>Contact</Link>
                </nav>

                {/* Search & Icons */}
                <div className='flex items-center gap-4'>
                    <div className='hidden md:flex border rounded overflow-hidden h-10'>
                        <select onChange={(e)=>setCategory(e.target.value)} className='px-2 text-slate-600 outline-none bg-transparent border-r'>
                            <option value="">All Categories</option>
                            {categorys.map((c,i)=> <option key={i} value={c.name}>{c.name}</option>)}
                        </select>
                        <input type='text' placeholder='Search products...' className='px-2 w-64 outline-none' onChange={(e)=>setSearchValue(e.target.value)} />
                        <button onClick={search} className='bg-[#059473] text-white px-4'>Search</button>
                    </div>

                    {/* Wishlist & Cart */}
                    <div className='hidden md:flex items-center gap-4'>
                        <div className='relative cursor-pointer' onClick={()=>navigate(userInfo?'/dashboard/my-wishlist':'/login')}>
                            <FaHeart className='text-xl text-green-500' />
                            {wishlist_count!==0 && <span className='absolute -top-1 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs'>{wishlist_count}</span>}
                        </div>
                        <div className='relative cursor-pointer' onClick={redirect_card_page}>
                            <FaCartShopping className='text-xl text-green-500' />
                            {card_product_count!==0 && <span className='absolute -top-1 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs'>{card_product_count}</span>}
                        </div>
                    </div>

                    {/* Mobile Hamburger */}
                    <div className='md:hidden cursor-pointer' onClick={()=>setShowSidebar(true)}>
                        <FaList className='text-2xl' />
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${showSidebar?'opacity-100 visible':'opacity-0 invisible'}`} onClick={()=>setShowSidebar(false)}></div>
            <div className={`fixed top-0 left-0 w-72 bg-white h-full z-50 p-6 overflow-y-auto transform transition-transform duration-300 ${showSidebar?'translate-x-0':'-translate-x-full'}`}>
                <div className='flex justify-between items-center mb-6'>
                    <Link to='/' onClick={()=>setShowSidebar(false)}>
                        <img src="/images/logo.png" alt="logo" className='h-10' />
                    </Link>
                    <button onClick={()=>setShowSidebar(false)} className='text-xl font-bold'>×</button>
                </div>

                <ul className='flex flex-col gap-4'>
                    <li><Link to='/' className='font-semibold' onClick={()=>setShowSidebar(false)}>Home</Link></li>
                    <li><Link to='/shops' className='font-semibold' onClick={()=>setShowSidebar(false)}>Shop</Link></li>
                    <li><Link to='/blog' className='font-semibold' onClick={()=>setShowSidebar(false)}>Blog</Link></li>
                    <li><Link to='/about' className='font-semibold' onClick={()=>setShowSidebar(false)}>About</Link></li>
                    <li><Link to='/contact' className='font-semibold' onClick={()=>setShowSidebar(false)}>Contact</Link></li>
                </ul>

                <div className='mt-6 border-t pt-4 flex items-center gap-3'>
                    <FaPhoneAlt /> <span>+1343-43233455 Support 24/7</span>
                </div>
                <div className='mt-4 flex items-center gap-3 text-slate-700'>
                    <a href="#"><FaFacebookF /></a>
                    <a href="#"><FaTwitter /></a>
                    <a href="#"><FaLinkedin /></a>
                    <a href="#"><FaGithub /></a>
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            <div className='fixed bottom-0 left-0 w-full md:hidden bg-white border-t flex justify-between items-center px-6 h-16 z-50'>
                <Link to='/' className='flex flex-col items-center text-slate-700'><svg className="w-6 h-6"><use href="#home-icon"/></svg><span className='text-xs'>Home</span></Link>
                <button onClick={()=>setShowCategory(!showCategory)} className='flex flex-col items-center text-slate-700'><FaList /><span className='text-xs'>Categories</span></button>
                <button onClick={redirect_card_page} className='relative flex flex-col items-center text-slate-700'>
                    <FaCartShopping />
                    {card_product_count!==0 && <span className='absolute -top-1 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs'>{card_product_count}</span>}
                    <span className='text-xs'>Cart</span>
                </button>
                <button onClick={()=>navigate(userInfo?'/dashboard/my-wishlist':'/login')} className='relative flex flex-col items-center text-slate-700'>
                    <FaHeart />
                    {wishlist_count!==0 && <span className='absolute -top-1 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs'>{wishlist_count}</span>}
                    <span className='text-xs'>Wishlist</span>
                </button>
                <button onClick={()=>navigate(userInfo?'/dashboard':'/login')} className='flex flex-col items-center text-slate-700'><FaUser /><span className='text-xs'>Account</span></button>
            </div>
        </header>
    )
};

export default Header;
