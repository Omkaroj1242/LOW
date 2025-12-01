import React, { useState } from 'react';
import BookGenqr from './BookGenqr';
import { IoIosCloseCircle } from 'react-icons/io';

const BookQrPopUp = ({ isOpen, onClose,bookId,title,isbn}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Full Screen Blur Background */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      
      {/* Popup Content */}
      <div className="relative m-3 sm:m-0 bg-white p-8 rounded shadow-lg" style={{ width: '400px', height: '300px' }}>
        <button className="absolute top-2 right-2 text-2xl text-[#d38473]" onClick={onClose}>
        <IoIosCloseCircle />
        </button>
        <h2 className="text-xl font-bold text-center">BookID: {bookId}</h2>
        <BookGenqr text={String(bookId)} title={title} isbn={isbn} />
      </div>
    </div>
  );
};


export default BookQrPopUp;
