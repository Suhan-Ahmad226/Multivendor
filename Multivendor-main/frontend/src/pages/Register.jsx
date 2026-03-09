import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaFacebookF, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa6"; 
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
    const [showPassword, setShowPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [validation, setValidation] = useState({
        name: true,
        email: true,
        password: true
    });

    const inputHandle = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });

        // Real-time validation
        if (name === 'name') setValidation(prev => ({ ...prev, name: value.trim().length >= 3 }));
        if (name === 'email') setValidation(prev => ({ ...prev, email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) }));
        if (name === 'password') setValidation(prev => ({ ...prev, password: value.length >= 6 }));
    };

    const togglePassword = () => setShowPassword(!showPassword);

    const passwordStrength = (password) => {
        if (password.length >= 12) return 'Strong';
        if (password.length >= 8) return 'Medium';
        if (password.length > 0) return 'Weak';
        return '';
    };

    const register = (e) => {
        e.preventDefault();
        if (!termsAccepted) {
            toast.error("Please accept Terms & Conditions");
            return;
        }
        if (!validation.name || !validation.email || !validation.password) {
            toast.error("Please fill valid information");
            return;
        }
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
    }, [successMessage, errorMessage, userInfo, dispatch, navigate]);

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            {loader && (
                <div className='fixed inset-0 flex justify-center items-center bg-black/30 z-[999]'>
                    <FadeLoader color="#10B981" />
                </div>
            )}

            <Header />

            <div className='flex justify-center items-center flex-1 py-12 px-4'>
                <motion.div 
                    className='grid grid-cols-2 bg-white rounded-2xl shadow-2xl w-full max-w-5xl md:grid-cols-1 overflow-hidden'
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Registration Form */}
                    <div className='p-10 md:p-8 flex flex-col gap-6'>
                        <h2 className='text-3xl font-bold text-gray-800 text-center'>Create Your Account</h2>

                        <form onSubmit={register} className='flex flex-col gap-5'>
                            {/* Name */}
                            <div className='relative'>
                                <input
                                    type="text"
                                    name="name"
                                    value={state.name}
                                    onChange={inputHandle}
                                    required
                                    className={`peer w-full px-5 py-3 border rounded-xl outline-none transition-all duration-300 
                                        ${validation.name ? 'border-gray-300 focus:ring-2 focus:ring-green-400' : 'border-red-500 focus:ring-2 focus:ring-red-400'}`}
                                />
                                <label className="absolute left-5 -top-2.5 bg-white px-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base">
                                    Full Name
                                </label>
                                {!validation.name && <p className='text-red-500 text-sm mt-1'>Name must be at least 3 characters</p>}
                            </div>

                            {/* Email */}
                            <div className='relative'>
                                <input
                                    type="email"
                                    name="email"
                                    value={state.email}
                                    onChange={inputHandle}
                                    required
                                    className={`peer w-full px-5 py-3 border rounded-xl outline-none transition-all duration-300 
                                        ${validation.email ? 'border-gray-300 focus:ring-2 focus:ring-green-400' : 'border-red-500 focus:ring-2 focus:ring-red-400'}`}
                                />
                                <label className="absolute left-5 -top-2.5 bg-white px-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base">
                                    Email Address
                                </label>
                                {!validation.email && <p className='text-red-500 text-sm mt-1'>Enter a valid email</p>}
                            </div>

                            {/* Password */}
                            <div className='relative'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={state.password}
                                    onChange={inputHandle}
                                    required
                                    className={`peer w-full px-5 py-3 border rounded-xl outline-none transition-all duration-300 
                                        ${validation.password ? 'border-gray-300 focus:ring-2 focus:ring-green-400' : 'border-red-500 focus:ring-2 focus:ring-red-400'}`}
                                />
                                <label className="absolute left-5 -top-2.5 bg-white px-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base">
                                    Password
                                </label>
                                <span 
                                    className='absolute right-4 top-3 text-gray-500 cursor-pointer'
                                    onClick={togglePassword}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                {state.password && <p className={`text-sm mt-1 ${passwordStrength(state.password) === 'Strong' ? 'text-green-600' : passwordStrength(state.password) === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                                    Password Strength: {passwordStrength(state.password)}
                                </p>}
                                {!validation.password && <p className='text-red-500 text-sm mt-1'>Password must be at least 6 characters</p>}
                            </div>

                            {/* Terms */}
                            <div className='flex items-center gap-2'>
                                <input 
                                    type="checkbox" 
                                    checked={termsAccepted} 
                                    onChange={() => setTermsAccepted(!termsAccepted)} 
                                    className='w-4 h-4 accent-green-500'
                                />
                                <p className='text-gray-600 text-sm'>
                                    I agree to the <Link to="/terms" className='text-green-600 hover:underline'>Terms & Conditions</Link>
                                </p>
                            </div>

                            <button 
                                type='submit'
                                className='w-full py-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 hover:shadow-green-500/50 transition-all duration-300 font-semibold text-lg'
                            >
                                Register
                            </button>
                        </form>

                        {/* Divider */}
                        <div className='flex items-center py-2'>
                            <hr className='flex-1 border-gray-300' />
                            <span className='px-3 text-gray-400'>OR</span>
                            <hr className='flex-1 border-gray-300' />
                        </div>

                        {/* Social Buttons */}
                        <div className='flex flex-col gap-3'>
                            <button className='w-full py-3 bg-blue-600 text-white rounded-xl shadow hover:shadow-blue-400/50 flex justify-center items-center gap-3 transition-all duration-300'>
                                <FaFacebookF /> Continue with Facebook
                            </button>
                            <button className='w-full py-3 bg-red-500 text-white rounded-xl shadow hover:shadow-red-400/50 flex justify-center items-center gap-3 transition-all duration-300'>
                                <FaGoogle /> Continue with Google
                            </button>
                        </div>

                        <p className='text-center text-gray-500 mt-2'>
                            Already have an account? <Link to='/login' className='text-green-600 font-semibold hover:underline'>Login</Link>
                        </p>

                        {/* Seller Links */}
                        <div className='flex flex-col gap-3 mt-4'>
                            <a target='_blank' rel="noreferrer" href="https://multivendor-hiil.vercel.app/login" className='w-full py-3 bg-cyan-500 text-white rounded-xl shadow hover:shadow-cyan-400/50 flex justify-center items-center gap-2 transition-all duration-300'>
                                Login as Seller
                            </a>
                            <a target='_blank' rel="noreferrer" href="https://multivendor-hiil.vercel.app/register" className='w-full py-3 bg-purple-600 text-white rounded-xl shadow hover:shadow-purple-400/50 flex justify-center items-center gap-2 transition-all duration-300'>
                                Register as Seller
                            </a>
                        </div>
                    </div>

                    {/* Side Image */}
                    <div className='hidden md:flex items-center justify-center'>
                        <img src="/images/login.jpg" alt="Register" className='h-full w-full object-cover rounded-l-2xl' />
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default Register;
