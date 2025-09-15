import React, { useEffect, useState } from 'react';
import { MdEmail } from "react-icons/md";
import { IoMdPhonePortrait } from "react-icons/io";
import { FaFacebookF, FaList, FaLock, FaUser } from "react-icons/fa";
import { FaTwitter, FaHeart, FaCartShopping } from "react-icons/fa6";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { IoMdArrowDropdown, IoIosArrowDown } from "react-icons/io"; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_card_products, get_wishlist_products } from '../store/reducers/cardReducer';

const Header = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {categorys} = useSelector(state => state.home) 
    const {userInfo} = useSelector(state => state.auth) 
    const {card_product_count,wishlist_count} = useSelector(state => state.card) 
    const {pathname} = useLocation()
     
    const [showSidebar, setShowSidebar] = useState(false);
    const [categoryShow, setCategoryShow] = useState(false);
    const [searchValue, setSearchValue] = useState('')
    const [category, setCategory] = useState('')

    const search = () => {
        navigate(`/products/search?category=${category}&&value=${searchValue}`)
    }

    const redirect_card_page = () => {
        if (userInfo) navigate('/card')
        else navigate('/login')
    } 

    useEffect(() => {
        if (userInfo) {
            dispatch(get_card_products(userInfo.id))
            dispatch(get_wishlist_products(userInfo.id))
        }  
    },[userInfo])

    return (
        <div className='w-full bg-white sticky top-0 z-50 shadow-sm'>
            {/* Top Bar */}
            <div className='hidden md:flex justify-between items-center bg-[#caddff] h-10 px-8 text-sm text-slate-700'>
                <div className='flex gap-6'>
                    <span className='flex items-center gap-1'><MdEmail /> support@gmail.com</span>
                    <span className='flex items-center gap-1'><IoMdPhonePortrait /> +(123) 3243 343</span>
                </div>
                <div className='flex items-center gap-6'>
                    <a href="#"><FaFacebookF /></a>
                    <a href="#"><FaTwitter /></a>
                    <a href="#"><FaLinkedin /></a>
                    <a href="#"><FaGithub /></a>
                    {
                        userInfo ? 
                        <Link to='/dashboard' className='flex items-center gap-1'><FaUser /> {userInfo.name}</Link> 
                        : 
                        <Link to='/login' className='flex items-center gap-1'><FaLock /> Login</Link>
                    }
                </div>
            </div>

            {/* Main Header */}
            <div className='flex justify-between items-center px-4 md:px-8 py-4'>
                {/* Logo */}
                <Link to='/' className='flex items-center'>
                    <img src="http://localhost:3000/images/logo.png" alt="Logo" className='h-12 md:h-16'/>
                </Link>

                {/* Search */}
                <div className='flex-1 mx-4 hidden md:flex'>
                    <select onChange={(e)=> setCategory(e.target.value)} className='border border-slate-300 px-2 rounded-l'>
                        <option value="">All Categories</option>
                        {categorys.map((c,i) => <option key={i} value={c.name}>{c.name}</option>)}
                    </select>
                    <input type="text" placeholder='What do you need' className='flex-1 border-t border-b border-slate-300 px-3 outline-none' onChange={(e)=>setSearchValue(e.target.value)} />
                    <button onClick={search} className='bg-[#059473] text-white px-4 rounded-r'>Search</button>
                </div>

                {/* Icons Desktop */}
                <div className='hidden md:flex items-center gap-4'>
                    <div onClick={() => navigate(userInfo ? '/dashboard/my-wishlist' : '/login')} className='relative'>
                        <FaHeart className='text-xl cursor-pointer text-green-600'/>
                        {wishlist_count > 0 && <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full'>{wishlist_count}</span>}
                    </div>
                    <div onClick={redirect_card_page} className='relative'>
                        <FaCartShopping className='text-xl cursor-pointer text-green-600'/>
                        {card_product_count > 0 && <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full'>{card_product_count}</span>}
                    </div>
                </div>

                {/* Mobile Hamburger */}
                <div className='md:hidden' onClick={()=> setShowSidebar(!showSidebar)}>
                    <FaList className='text-2xl cursor-pointer'/>
                </div>
            </div>

            {/* Category / Nav */}
            <div className='bg-[#059473] text-white hidden md:flex items-center px-8 h-12 font-semibold uppercase gap-6'>
                <Link className={`${pathname === '/' ? 'text-yellow-300' : 'text-white'}`} to='/'>Home</Link>
                <Link className={`${pathname === '/shops' ? 'text-yellow-300' : 'text-white'}`} to='/shops'>Shop</Link>
                <Link className={`${pathname === '/blog' ? 'text-yellow-300' : 'text-white'}`} to='/blog'>Blog</Link>
                <Link className={`${pathname === '/about' ? 'text-yellow-300' : 'text-white'}`} to='/about'>About</Link>
                <Link className={`${pathname === '/contact' ? 'text-yellow-300' : 'text-white'}`} to='/contact'>Contact</Link>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className='fixed bottom-0 left-0 w-full md:hidden bg-white border-t border-gray-300 flex justify-around items-center h-14 z-50'>
                <Link to='/' className='flex flex-col items-center text-sm'>
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2L2 9h3v7h10V9h3L10 2z"/></svg>
                    Home
                </Link>
                <button onClick={()=> setCategoryShow(!categoryShow)} className='flex flex-col items-center text-sm'>
                    <FaList className='text-green-600 text-lg'/>
                    Categories
                </button>
                <button onClick={redirect_card_page} className='flex flex-col items-center text-sm relative'>
                    <FaCartShopping className='text-green-600 text-lg'/>
                    {card_product_count > 0 && <span className='absolute -top-1 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full'>{card_product_count}</span>}
                    Cart
                </button>
                <Link to={userInfo ? '/dashboard' : '/login'} className='flex flex-col items-center text-sm'>
                    <FaUser className='text-green-600 text-lg'/>
                    {userInfo ? 'Profile' : 'Login'}
                </Link>
            </div>

            {/* Mobile Category Drawer */}
            {categoryShow && <div className='fixed bottom-14 left-0 w-full bg-white border-t border-gray-200 z-40 p-4 overflow-y-auto max-h-80'>
                {categorys.map((c,i)=>(
                    <Link key={i} to={`/products?category=${c.name}`} className='block py-2 px-3 border-b border-gray-200'>{c.name}</Link>
                ))}
            </div>}

            {/* Mobile Sidebar */}
            {showSidebar && <div className='fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 p-4 overflow-y-auto'>
                <div className='flex justify-between items-center mb-4'>
                    <Link to='/'><img src="http://localhost:3000/images/logo.png" alt="Logo" className='h-12'/></Link>
                    <button onClick={()=> setShowSidebar(false)} className='text-xl'>✕</button>
                </div>
                <ul className='flex flex-col gap-3 font-semibold'>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/shops'>Shop</Link></li>
                    <li><Link to='/blog'>Blog</Link></li>
                    <li><Link to='/about'>About</Link></li>
                    <li><Link to='/contact'>Contact</Link></li>
                </ul>
            </div>}
        </div>
    )
}

export default Header;
