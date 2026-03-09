import React, { Suspense, lazy, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { get_category } from './store/reducers/homeReducer';
import { useDispatch } from 'react-redux';
import ProtectUser from './utils/ProtectUser';

const Home = lazy(() => import('./pages/Home'));
const Shops = lazy(() => import('./pages/Shops'));
const Card = lazy(() => import('./pages/Card'));
const Shipping = lazy(() => import('./pages/Shipping'));
const Details = lazy(() => import('./pages/Details'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const CategoryShop = lazy(() => import('./pages/CategoryShop'));
const SearchProducts = lazy(() => import('./pages/SearchProducts'));
const Payment = lazy(() => import('./pages/Payment'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ConfirmOrder = lazy(() => import('./pages/ConfirmOrder'));
const About = lazy(() => import('./pages/About'));
const DeliveryInfo = lazy(() => import('./pages/DeliveryInfo'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Blog = lazy(() => import('./pages/Blog'));
const Services = lazy(() => import('./pages/Services'));
const CompanyProfile = lazy(() => import('./pages/CompanyProfile'));
const Index = lazy(() => import('./components/dashboard/Index'));
const Orders = lazy(() => import('./components/dashboard/Orders'));
const ChangePassword = lazy(() => import('./components/dashboard/ChangePassword'));
const Wishlist = lazy(() => import('./components/dashboard/Wishlist'));
const OrderDetails = lazy(() => import('./components/dashboard/OrderDetails'));
const Chat = lazy(() => import('./components/dashboard/Chat'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(get_category());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/shops' element={<Shops />} />
          <Route path='/card' element={<Card />} />
          <Route path='/shipping' element={<Shipping />} />
          <Route path='/payment' element={<Payment />} />
          <Route path='/about' element={<About />} />
          <Route path='/delivery-info' element={<DeliveryInfo />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/services' element={<Services />} />
          <Route path='/company-profile' element={<CompanyProfile />} />
          <Route path='/products?' element={<CategoryShop />} />
          <Route path='/products/search?' element={<SearchProducts />} />
          <Route path='/product/details/:slug' element={<Details />} />
          <Route path='/order/confirm?' element={<ConfirmOrder />} />

          <Route path='/dashboard' element={<ProtectUser />}>
            <Route path='' element={<Dashboard />}>
              <Route path='' element={<Index />} />
              <Route path='my-orders' element={<Orders />} />
              <Route path='change-password' element={<ChangePassword />} />
              <Route path='my-wishlist' element={<Wishlist />} />
              <Route path='order/details/:orderId' element={<OrderDetails />} />
              <Route path='chat' element={<Chat />} />
              <Route path='chat/:sellerId' element={<Chat />} />
            </Route>
          </Route>

          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
