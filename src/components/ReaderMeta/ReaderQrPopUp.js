import React, { useState } from 'react';
import ReaderGenqr from './ReaderGenqr';
import { IoIosCloseCircle } from 'react-icons/io';

const ReaderQrPopUp = ({ isOpen, onClose,id}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Full Screen Blur Background */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      
      {/* Popup Content */}
      <div className="relative m-3 sm:m-0 bg-white p-8 rounded shadow-lg" style={{ width: '400px', height: '340px' }}>
        <button className="absolute top-2 right-2 text-2xl text-[#d38473]" onClick={onClose}>
        <IoIosCloseCircle />
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">ReaderID: {id}</h2>
        <ReaderGenqr prop={String(id)}/>
      </div>
    </div>
  );
};


export default ReaderQrPopUp;
