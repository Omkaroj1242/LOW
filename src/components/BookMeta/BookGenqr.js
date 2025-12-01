import React, { useRef, useState, useEffect } from 'react';
import QRCode from 'qrcode';
import CryptoJS from 'crypto-js';

const BookGenqr = ({ text, title, isbn }) => {
  const secretKey = 'your-secret-key-book';
  const qrRef = useRef();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  useEffect(() => {
    const generateQrCode = async () => {
      try {
        const encryptedValue = CryptoJS.AES.encrypt(text, secretKey).toString();
        const qrDataUrl = await QRCode.toDataURL(encryptedValue, { type: 'image/png' });
        setQrCodeDataUrl(qrDataUrl);
      } catch (error) {
        alert('Failed to generate QR code');
      }
    };

    generateQrCode();
  }, [text, secretKey]);

  const downloadQrCode = async () => {
    if (qrRef.current) {
      try {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const qrImage = new Image();
        qrImage.src = qrCodeDataUrl;

        qrImage.onload = () => {
          const qrSize = 200;
          const textHeight = 20; // Height for text
          const padding = 0; // No padding

          // Set canvas width and height to fit the QR code
          canvas.width = qrSize;
          canvas.height = qrSize;

          // Draw QR code in the middle
          context.drawImage(qrImage, padding, padding, qrSize, qrSize);

          // Draw white background for title
          const titlePadding = 0;
          const titleWidth = canvas.width - 2 * titlePadding;
          const titleX = titlePadding;
          const titleY = titlePadding;
          const titleFontSize = 10;

          context.fillStyle = 'white';
          context.fillRect(titleX, titleY, titleWidth, titleFontSize * 2);

          // Draw title text with multiline support
          context.font = `${titleFontSize}px Arial`;
          context.fillStyle = 'black';
          context.textAlign = 'center';
          wrapText(context, title, titleX + titleWidth / 2, titleY + titleFontSize, titleWidth, titleFontSize);
          context.fillText(`${text} : ${isbn}`, canvas.width / 2, qrSize - 10);
          // Convert canvas to data URL and create a download link
          canvas.toBlob((blob) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `book_${text}.jpg`;
            link.click();
          }, 'image/jpeg');
        };
      } catch (error) {
        alert('Failed to generate QR code image');
      }
    }
  };

  // Function to wrap text on canvas
  const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    let lines = [];

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && i > 0) {
        lines.push(line);
        line = words[i] + ' ';
      } else {
        line = testLine;
      }
    }

    lines.push(line);

    for (let j = 0; j < lines.length; j++) {
      context.fillText(lines[j], x, y + j * lineHeight);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <div ref={qrRef}>
          {qrCodeDataUrl && <img src={qrCodeDataUrl} alt="QR Code" style={{ margin: 0, padding: 0 }} />}
        </div>
      </div>
      <button
        onClick={downloadQrCode}
        className="p-2 bg-[#d38473] text-white rounded mt-4"
      >
        Download QR Code
      </button>
    </div>
  );
};

export default BookGenqr;
