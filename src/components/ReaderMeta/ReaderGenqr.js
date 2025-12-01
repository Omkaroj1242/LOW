import React, { useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';
import CryptoJS from 'crypto-js';
import { useLocation, useNavigate } from "react-router-dom";

const ReaderGenqr = ({prop}) => {
  const location = useLocation();
  const isOnlyTcsAddReaderEndpoint = location.pathname === '/addreader/tcssubscription';
  const navigate = useNavigate();
    const secretKey = 'your-secret-key-reader';
    const [value, setValue] = useState(prop);
    const qrRef = useRef();

    const downloadQrCode = async () => {
      if (qrRef.current) {
        try {
          const dataUrl = await toPng(qrRef.current);
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `rid${prop}.png`;
          link.click();
        } catch (error) {
          alert('Failed to generate QR code image');
        }
      }
    };

  const encryptedValue = CryptoJS.AES.encrypt(value, secretKey).toString();
  const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
  const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);

  return (
    <div className="flex flex-col items-center justify-center">
        <div className=' bg-[#d38473]'>
    <div ref={qrRef} className="w-full m-auto p-4 bg-white">
      <QRCode
        size={128}
        value={encryptedValue}
      />
    </div></div>
    <button
      onClick={downloadQrCode}
      className="mt-4 p-2 bg-[#d38473] text-white rounded"
    >
      Download QR Code
    </button>
    {isOnlyTcsAddReaderEndpoint && <button
     onClick={() => navigate('/abouttcs')}
    className="mt-2 text-sm font-semibold hover:underline"
  >
    Know HOW to ISSUE a Book?
  </button>}
  </div>
);
};

export default ReaderGenqr;
