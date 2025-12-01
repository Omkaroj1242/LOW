import QRCode from 'qrcode';
import CryptoJS from 'crypto-js';

const qrGenBulk = async (text, title, isbn) => {
  const secretKey = 'your-secret-key-book';

  try {
    // Encrypt text using AES
    const encryptedValue = CryptoJS.AES.encrypt(text, secretKey).toString();

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(encryptedValue, { type: 'image/png' });

    // Create a canvas to draw the QR code and text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const qrImage = new Image();

    // Load QR code data URL into image
    qrImage.src = qrDataUrl;

    return new Promise((resolve, reject) => {
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

        // Convert canvas to blob (JPEG format)
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg');
      };

      qrImage.onerror = (error) => {
        reject(error);
      };
    });
  } catch (error) {
    throw new Error('Failed to generate QR code image');
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

export default qrGenBulk;
