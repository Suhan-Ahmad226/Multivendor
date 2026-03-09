import React from 'react';
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
  MdFirstPage,
  MdLastPage
} from "react-icons/md";

const Pagination = ({
  pageNumber,
  setPageNumber,
  totalItem,
  parPage,
  setParPage,
  showItem
}) => {
  let totalPage = Math.ceil(totalItem / parPage);
  let startPage = pageNumber;
  let dif = totalPage - pageNumber;

  if (dif <= showItem) {
    startPage = totalPage - showItem;
  }
  let endPage = startPage < 0 ? showItem : showItem + startPage;

  if (startPage <= 0) {
    startPage = 1;
  }

  const createBtn = () => {
    const btns = [];
    for (let i = startPage; i < endPage; i++) {
      btns.push(
        <li
          key={i}
          onClick={() => setPageNumber(i)}
          className={`transition-all duration-300 ease-in-out 
            ${pageNumber === i
              ? "bg-green-600 text-white shadow-md scale-110"
              : "bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white"}
            w-[40px] h-[40px] rounded-full flex justify-center items-center cursor-pointer font-medium`}
        >
          {i}
        </li>
      );
    }
    return btns;
  };

  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
      {/* Pagination */}
      <ul className="flex gap-2 md:gap-3 flex-wrap justify-center items-center">
        {/* First Page */}
        {pageNumber > 1 && (
          <li
            onClick={() => setPageNumber(1)}
            className="w-[40px] h-[40px] rounded-full flex justify-center items-center bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white cursor-pointer transition-all duration-300"
          >
            <MdFirstPage size={20} />
          </li>
        )}

        {/* Previous */}
        {pageNumber > 1 && (
          <li
            onClick={() => setPageNumber(pageNumber - 1)}
            className="w-[40px] h-[40px] rounded-full flex justify-center items-center bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white cursor-pointer transition-all duration-300"
          >
            <MdOutlineKeyboardDoubleArrowLeft size={20} />
          </li>
        )}

        {createBtn()}

        {/* Next */}
        {pageNumber < totalPage && (
          <li
            onClick={() => setPageNumber(pageNumber + 1)}
            className="w-[40px] h-[40px] rounded-full flex justify-center items-center bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white cursor-pointer transition-all duration-300"
          >
            <MdOutlineKeyboardDoubleArrowRight size={20} />
          </li>
        )}

        {/* Last Page */}
        {pageNumber < totalPage && (
          <li
            onClick={() => setPageNumber(totalPage)}
            className="w-[40px] h-[40px] rounded-full flex justify-center items-center bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white cursor-pointer transition-all duration-300"
          >
            <MdLastPage size={20} />
          </li>
        )}
      </ul>

      {/* Page Info + Items per page */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <p className="text-gray-600 font-medium">
          Page <span className="text-green-600">{pageNumber}</span> of{" "}
          <span className="text-green-600">{totalPage}</span>
        </p>

        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">Items per page:</label>
          <select
            value={parPage}
            onChange={(e) => {
              setParPage(parseInt(e.target.value));
              setPageNumber(1); // Reset to first page
            }}
            className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
