import React from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { CiStar } from 'react-icons/ci';

const Rating = ({ ratings, className = "" }) => {
  // একটি অ্যারে তৈরি করা হয়েছে 5 স্টার পর্যন্ত
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {stars.map((star, index) => {
        let StarIcon;
        if (ratings >= star) {
          StarIcon = FaStar;
        } else if (ratings >= star - 0.5) {
          StarIcon = FaStarHalfAlt;
        } else {
          StarIcon = CiStar;
        }

        return (
          <span
            key={index}
            className={`text-[#EDBB0E] transition-transform duration-300 hover:scale-125`}
          >
            <StarIcon size={20} />
          </span>
        );
      })}
      <span className="text-slate-600 ml-2 font-medium">{ratings.toFixed(1)}</span>
    </div>
  );
};

export default Rating;
