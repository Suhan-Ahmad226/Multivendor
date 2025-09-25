import React, { useEffect, useState } from 'react';
import Rating from './Rating';
import RatingTemp from './RatingTemp';
import Pagination from './Pagination';
import { Link } from 'react-router-dom';
import RatingReact from 'react-rating';
import { FaStar } from 'react-icons/fa';
import { CiStar } from 'react-icons/ci';
import { useDispatch, useSelector } from 'react-redux';
import { customer_review, get_reviews, messageClear, product_details } from '../store/reducers/homeReducer';
import toast from 'react-hot-toast';

const Reviews = ({ product }) => {
    const dispatch = useDispatch();
    const [parPage, setParPage] = useState(5);
    const [pageNumber, setPageNumber] = useState(1);

    const { userInfo } = useSelector(state => state.auth);
    const { successMessage, reviews, rating_review, totalReview } = useSelector(state => state.home);

    const [rat, setRat] = useState('');
    const [re, setRe] = useState('');

    const review_submit = (e) => {
        e.preventDefault();
        const obj = {
            name: userInfo.name,
            review: re,
            rating: rat,
            productId: product._id
        };
        dispatch(customer_review(obj));
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(get_reviews({ productId: product._id, pageNumber }));
            dispatch(product_details(product.slug));
            setRat('');
            setRe('');
            dispatch(messageClear());
        }
    }, [successMessage]);

    useEffect(() => {
        if (product._id) {
            dispatch(get_reviews({ productId: product._id, pageNumber }));
        }
    }, [pageNumber, product]);

    return (
        <div className="mt-8 px-4 md:px-8 lg:px-16">
            {/* Top Ratings */}
            <div className="flex flex-col md:flex-row gap-10">
                <div className="flex flex-col items-start gap-2 p-4 bg-white shadow-lg rounded-lg w-full md:w-1/4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-yellow-500">{product.rating}</span>
                        <span className="text-2xl font-semibold text-gray-500">/5</span>
                    </div>
                    <div className="flex gap-1">
                        <Rating ratings={product.rating} />
                    </div>
                    <p className="text-gray-500 text-sm">({totalReview}) Reviews</p>
                </div>

                {/* Rating Distribution */}
                <div className="flex-1 flex flex-col gap-3 p-4 bg-white shadow-lg rounded-lg">
                    {rating_review?.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="flex w-24 gap-1">
                                <RatingTemp rating={5 - index} />
                            </div>
                            <div className="relative flex-1 h-3 bg-gray-200 rounded overflow-hidden">
                                <div
                                    style={{ width: `${Math.floor((100 * (item?.sum || 0)) / totalReview)}%` }}
                                    className="absolute h-full bg-yellow-500 left-0 top-0 transition-all duration-500 ease-in-out"
                                ></div>
                            </div>
                            <p className="w-6 text-sm text-gray-500 text-right">{item?.sum || 0}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reviews List */}
            <h2 className="text-xl md:text-2xl font-bold text-gray-700 mt-8 mb-4">
                Product Reviews ({totalReview})
            </h2>

            <div className="flex flex-col gap-6">
                {reviews.map((r, i) => (
                    <div
                        key={i}
                        className="flex flex-col gap-2 p-4 bg-white shadow hover:shadow-lg transition-shadow rounded-lg"
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex gap-1">
                                <RatingTemp rating={r.rating} />
                            </div>
                            <span className="text-gray-400 text-sm">{r.date}</span>
                        </div>
                        <span className="font-semibold text-gray-600">{r.name}</span>
                        <p className="text-gray-500 text-sm">{r.review}</p>
                    </div>
                ))}
                {totalReview > parPage && (
                    <div className="flex justify-end">
                        <Pagination
                            pageNumber={pageNumber}
                            setPageNumber={setPageNumber}
                            totalItem={totalReview}
                            parPage={parPage}
                            showItem={Math.floor(totalReview / 3)}
                        />
                    </div>
                )}
            </div>

            {/* Submit Review */}
            <div className="mt-8">
                {userInfo ? (
                    <div className="flex flex-col gap-4 p-4 bg-white shadow-lg rounded-lg">
                        <div className="flex gap-2 items-center">
                            <RatingReact
                                onChange={(e) => setRat(e)}
                                initialRating={rat}
                                emptySymbol={<CiStar className="text-gray-400 text-3xl" />}
                                fullSymbol={<FaStar className="text-yellow-500 text-3xl" />}
                            />
                        </div>
                        <form onSubmit={review_submit} className="flex flex-col gap-3">
                            <textarea
                                value={re}
                                onChange={(e) => setRe(e.target.value)}
                                required
                                placeholder="Write your review..."
                                className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all duration-300"
                                rows="5"
                            ></textarea>
                            <button
                                type="submit"
                                className="self-start py-2 px-6 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="mt-4">
                        <Link
                            to="/login"
                            className="py-2 px-6 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                            Login First
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reviews;
