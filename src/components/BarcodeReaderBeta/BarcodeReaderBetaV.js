import React, { useEffect, useState, useRef } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

const BarcodeReaderBetaV = () => {
  const [result, setResult] = useState(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const videoRef = useRef(null);
  const readerRef = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    const initDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
        });

        const devices = await readerRef.current.listVideoInputDevices();
        setVideoDevices(devices);

        if (devices.length > 0) {
          const rearCamera = devices.find((device) =>
            device.label.toLowerCase().includes('back') ||
            device.label.toLowerCase().includes('rear') ||
            device.label.toLowerCase().includes('environment')
          );
          setSelectedDeviceId(rearCamera ? rearCamera.deviceId : devices[0].deviceId);
        }
      } catch (err) {
        console.error('Error accessing camera or listing devices:', err);
      }
    };

    initDevices();

    return () => {
      readerRef.current.reset();
    };
  }, []);

  useEffect(() => {
    if (selectedDeviceId) {
      const reader = readerRef.current;
      reader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
        if (result) {
          setResult(result.getText());
          reader.reset();
        }
        if (err && !(err instanceof NotFoundException)) {
          console.error('Scan error:', err);
        }
      });

      return () => {
        reader.reset();
      };
    }
  }, [selectedDeviceId]);

  const handleDeviceChange = (e) => {
    setSelectedDeviceId(e.target.value);
    setResult(null);
  };

  const resetScan = () => {
    setResult(null);
    if (selectedDeviceId) {
      readerRef.current.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
        if (result) {
          setResult(result.getText());
          readerRef.current.reset();
        }
      });
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: 'auto', fontFamily: 'Arial, sans-serif', padding: '0 1rem' }}>
      <h2>Barcode Scanner</h2>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="cameraSelect" style={{ marginRight: 8 }}>
          Select Camera:
        </label>
        <select id="cameraSelect" onChange={handleDeviceChange} value={selectedDeviceId || ''}>
          {videoDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId.slice(-4)}`}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 640,
          aspectRatio: '3 / 2', // keeps 600x400 ratio responsive
          marginBottom: 16,
        }}
      >
        <video
          ref={videoRef}
          id="video"
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid black',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
          autoPlay
          muted
          playsInline
        />
        {/* Overlay box */}
<div
  style={{
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: '50%',
    height: '50%',
    border: '2px solid rgba(255, 255, 255, 0.8)',
    boxShadow: '0 0 10px rgba(255,255,255,0.6)',
    zIndex: 2,
    pointerEvents: 'none',
    borderRadius: '4px',
  }}
>
  {/* Red scan line inside overlay */}
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '2px',
      backgroundColor: 'red',
      animation: 'scanline 2s infinite',
      borderRadius: '2px',
      zIndex: 3,
      pointerEvents: 'none',
    }}
  />
</div>

        <style>
          {`
            @keyframes scanline {
  0% { top: 0; }
  50% { top: calc(100% - 2px); } /* Move to bottom of overlay box minus height of line */
  100% { top: 0; }
}

            @media (max-width: 480px) {
              /* smaller font on small screens */
              h2 {
                font-size: 1.5rem;
              }

              select {
                font-size: 1rem;
              }
            }
          `}
        </style>
      </div>

      {result ? (
        <div>
          <p>
            <strong>Scanned Code:</strong> {result}
          </p>
          <button onClick={resetScan} style={{ padding: '8px 16px', fontSize: '1rem' }}>
            Scan Another
          </button>
        </div>
      ) : (
        <p>Align the barcode inside the box</p>
      )}
    </div>
  );
};

export default BarcodeReaderBetaV;



