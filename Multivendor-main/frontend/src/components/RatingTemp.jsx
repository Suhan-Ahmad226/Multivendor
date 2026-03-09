import React from 'react';
import { FaStar } from 'react-icons/fa';
import { CiStar } from 'react-icons/ci';

const RatingTemp = ({ rating }) => {
  // ৫টি স্টার অ্যারের মাধ্যমে ডাইনামিক রেন্ডার
  const totalStars = 5;
  const starsArray = Array.from({ length: totalStars }, (_, index) => {
    return index < rating ? 'filled' : 'empty';
  });

  return (
    <div className="flex items-center space-x-1">
      {starsArray.map((star, idx) => (
        <span
          key={idx}
          className={`text-[#EDBB0E] transition-transform duration-300 hover:scale-125`}
        >
          {star === 'filled' ? <FaStar size={20} /> : <CiStar size={20} />}
        </span>
      ))}
      <span className="ml-2 text-gray-700 font-medium">{rating}/{totalStars}</span>
    </div>
  );
};

export default RatingTemp;
