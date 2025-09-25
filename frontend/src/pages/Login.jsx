import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaFacebookF, FaGoogle } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { customer_login, messageClear } from '../store/reducers/authReducer';
import toast from 'react-hot-toast';
import { FadeLoader } from 'react-spinners';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Login = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage, userInfo } = useSelector(state => state.auth);

    const [state, setState] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const inputHandle = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const login = (e) => {
        e.preventDefault();
        dispatch(customer_login(state));
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (userInfo) {
            navigate('/');
        }
    }, [successMessage, errorMessage, userInfo, dispatch, navigate]);

    return (
        <div className="relative">
            {loader && (
                <div className='w-screen h-screen flex justify-center items-center fixed left-0 top-0 bg-[#38303033] z-[999]'>
                    <FadeLoader color="#059473" />
                </div>
            )}

            <Header />

            <div className='bg-slate-100 min-h-screen flex justify-center items-center py-10 px-3'>
                <div className='grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden'>
                    
                    {/* Left Side - Form */}
                    <div className='p-10 flex flex-col justify-center'>
                        <h2 className='text-3xl font-bold text-slate-700 mb-6 text-center'>Login</h2>

                        <form onSubmit={login} className='flex flex-col gap-4'>
                            {/* Email */}
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="email" className='text-slate-600 font-medium'>Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={state.email}
                                    onChange={inputHandle}
                                    placeholder="Email"
                                    required
                                    className='w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300'
                                />
                            </div>

                            {/* Password */}
                            <div className='flex flex-col gap-1 relative'>
                                <label htmlFor="password" className='text-slate-600 font-medium'>Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={state.password}
                                    onChange={inputHandle}
                                    placeholder="Password"
                                    required
                                    className='w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300'
                                />
                                <span
                                    className='absolute right-3 top-10 cursor-pointer text-slate-500 hover:text-green-500 transition-all duration-300'
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                </span>
                            </div>

                            {/* Forgot Password */}
                            <div className='text-right'>
                                <Link to='/forgot-password' className='text-blue-500 hover:underline text-sm'>Forgot Password?</Link>
                            </div>

                            {/* Login Button */}
                            <button
                                type='submit'
                                disabled={loader}
                                className={`w-full py-3 rounded-md text-white font-semibold transition-all duration-300 ${
                                    loader ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-500/50'
                                }`}
                            >
                                {loader ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className='flex items-center justify-center gap-3 my-5'>
                            <hr className='w-full border-slate-300' />
                            <span className='text-slate-500 text-sm'>OR</span>
                            <hr className='w-full border-slate-300' />
                        </div>

                        {/* Social Login */}
                        <div className='flex flex-col gap-3'>
                            <button className='w-full py-3 flex justify-center items-center gap-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow hover:shadow-indigo-500/50 transition-all duration-300'>
                                <FaFacebookF /> Login With Facebook
                            </button>

                            <button className='w-full py-3 flex justify-center items-center gap-2 bg-red-600 text-white rounded-md hover:bg-red-700 shadow hover:shadow-red-500/50 transition-all duration-300'>
                                <FaGoogle /> Login With Google
                            </button>
                        </div>

                        {/* Register Link */}
                        <p className='text-center mt-5 text-slate-600'>
                            Don't have an account? <Link to='/register' className='text-blue-500 hover:underline'>Register</Link>
                        </p>

                        {/* Seller Login/Register */}
                        <div className='flex flex-col gap-3 mt-5'>
                            <a target='_blank' rel='noreferrer' href="https://multivendor-hiil.vercel.app/login" className='w-full py-3 text-white text-center bg-cyan-500 rounded-md hover:bg-cyan-600 transition-all duration-300 shadow hover:shadow-cyan-400/50'>
                                Login As a Seller
                            </a>
                            <a target='_blank' rel='noreferrer' href="https://multivendor-hiil.vercel.app/register" className='w-full py-3 text-white text-center bg-purple-600 rounded-md hover:bg-purple-700 transition-all duration-300 shadow hover:shadow-purple-400/50'>
                                Register As a Seller
                            </a>
                        </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className='hidden md:flex justify-center items-center bg-green-50'>
                        <img src="/images/login.jpg" alt="Login Illustration" className='w-full h-full object-cover'/>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Login;
