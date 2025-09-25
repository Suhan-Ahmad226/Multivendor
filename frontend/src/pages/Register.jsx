import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaFacebookF } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa6"; 
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { customer_register, messageClear } from '../store/reducers/authReducer';
import toast from 'react-hot-toast';
import { FadeLoader } from 'react-spinners';
import { motion } from 'framer-motion';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage, userInfo } = useSelector(state => state.auth);

    const [state, setState] = useState({
        name: '',
        email: '',
        password: ''
    });

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const register = (e) => {
        e.preventDefault();
        dispatch(customer_register(state));
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
    }, [successMessage, errorMessage]);

    return (
        <div className="bg-gray-100 min-h-screen">
            {loader && (
                <div className='w-screen h-screen flex justify-center items-center fixed left-0 top-0 bg-[#38303033] z-[999]'>
                    <FadeLoader />
                </div>
            )}

            <Header />

            <div className='py-12 flex justify-center'>
                <motion.div 
                    className='grid grid-cols-2 bg-white rounded-lg shadow-xl w-[60%] md:grid-cols-1 md:w-[90%]'
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Registration Form */}
                    <div className='p-8 flex flex-col gap-4'>
                        <h2 className='text-2xl font-bold text-gray-700 text-center mb-4'>Register</h2>

                        <form onSubmit={register} className='flex flex-col gap-4'>
                            <div className='flex flex-col'>
                                <label htmlFor="name" className='text-gray-600 font-medium'>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={state.name}
                                    onChange={inputHandle}
                                    placeholder="Your Name"
                                    required
                                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:border-green-500 outline-none transition-all duration-300'
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label htmlFor="email" className='text-gray-600 font-medium'>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={state.email}
                                    onChange={inputHandle}
                                    placeholder="Your Email"
                                    required
                                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:border-green-500 outline-none transition-all duration-300'
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label htmlFor="password" className='text-gray-600 font-medium'>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={state.password}
                                    onChange={inputHandle}
                                    placeholder="Your Password"
                                    required
                                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:border-green-500 outline-none transition-all duration-300'
                                />
                            </div>

                            <button className='w-full py-3 bg-green-600 text-white rounded-md shadow-lg hover:bg-green-700 hover:shadow-green-500/40 transition-all duration-300 font-semibold'>
                                Register
                            </button>
                        </form>

                        <div className='flex items-center py-2'>
                            <hr className='flex-1 border-gray-300' />
                            <span className='px-3 text-gray-500'>Or</span>
                            <hr className='flex-1 border-gray-300' />
                        </div>

                        {/* Social Buttons */}
                        <div className='flex flex-col gap-3'>
                            <button className='w-full py-3 bg-indigo-500 text-white rounded-md shadow hover:shadow-indigo-500/50 flex justify-center items-center gap-3 transition-all duration-300'>
                                <FaFacebookF /> Login With Facebook
                            </button>
                            <button className='w-full py-3 bg-red-500 text-white rounded-md shadow hover:shadow-red-500/50 flex justify-center items-center gap-3 transition-all duration-300'>
                                <FaGoogle /> Login With Google
                            </button>
                        </div>

                        <p className='text-center text-gray-600 mt-3'>
                            Already have an account? <Link to='/login' className='text-blue-500 font-medium hover:underline'>Login</Link>
                        </p>

                        {/* Seller Links */}
                        <div className='flex flex-col gap-3 mt-4'>
                            <a target='_blank' href="https://multivendor-hiil.vercel.app/login" className='w-full py-3 bg-cyan-400 text-white rounded-md shadow hover:shadow-cyan-300/50 flex justify-center items-center gap-2 transition-all duration-300'>
                                Login As a Seller
                            </a>
                            <a target='_blank' href="https://multivendor-hiil.vercel.app/register" className='w-full py-3 bg-purple-600 text-white rounded-md shadow hover:shadow-purple-400/50 flex justify-center items-center gap-2 transition-all duration-300'>
                                Register As a Seller
                            </a>
                        </div>
                    </div>

                    {/* Side Image */}
                    <div className='hidden md:flex items-center justify-center p-4'>
                        <img src="/images/login.jpg" alt="Register" className='rounded-r-lg object-cover h-full w-full' />
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default Register;
