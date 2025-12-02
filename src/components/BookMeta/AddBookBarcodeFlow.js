import React, { useContext, useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { globalContext } from '../../contextapi/GlobalContext'
import { BounceLoader, DotLoader } from "react-spinners";
import QrFrame from '../../assets/qr-frame.svg'



const AddBookBarcodeFlow = () => {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const scanningPausedRef = useRef(false);
  const mountedRef = useRef(true);
  const [result, setResult] = useState("");
  const globalCon = useContext(globalContext);
  const [isPopupOpen, setPopupOpen] = React.useState(false);
  const [loader, setLoader] = useState(false);
  const [bookData, setBookData] = useState({ bookname: "", isbn: "", author: "", genre: "", subgenre: "", publisher: "" });




  useEffect(() => {
    // restrict decoder to barcode formats only (no QR_CODE)
    const hints = new Map();
    const barcodeFormats = [
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.ITF,
      BarcodeFormat.CODABAR
    ];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, barcodeFormats);
    mountedRef.current = true;
    readerRef.current = new BrowserMultiFormatReader(hints);

    const startReader = async () => {
      if (!videoRef.current || !readerRef.current) return;
      try {
        readerRef.current.decodeFromVideoDevice(null, videoRef.current, (res, err) => {
          if (res) {
            // throttle handling to avoid rapid repeated scans
            if (!scanningPausedRef.current) {
              scanningPausedRef.current = true;
              setResult(res.getText());
              // stop continuous scanning and restart after cooldown
              try { readerRef.current.reset(); } catch (e) {}
              setTimeout(() => {
                if (!mountedRef.current) return;
                try { startReader(); } catch (e) {}
                scanningPausedRef.current = false;
              }, 1500); // 1.5s cooldown between scans
            }
          }
          // NotFoundException is expected frequently while scanning; log other errors
          if (err && err.name !== "NotFoundException") {
            console.error("Barcode decode error:", err);
          }
        }).catch((e) => {
          // Starting the decoder can fail if camera is blocked
          console.error("Failed to start decodeFromVideoDevice:", e);
        });
      } catch (e) {
        console.error('Error initializing barcode reader', e);
      }
    }

    // kick off reader
    startReader();

    return () => {
      mountedRef.current = false;
      try {
        readerRef.current?.reset();
      } catch (e) {}
      readerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!result) return;

    const controller = new AbortController();

    const fetchBookForIsbn = async (isbn) => {
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`, { signal: controller.signal });
        if (!response.ok) {
          console.error('Google Books API error, status:', response.status);
          return;
        }
        const data = await response.json();
        if (data && data.totalItems > 0 && Array.isArray(data.items) && data.items.length) {
          const info = data.items[0].volumeInfo || {};
          const bookName = "Test " + (info.title || '');
          const author = info.authors || [];
          const publisher = info.publisher || '';
          const publishedDate = info.publishedDate || '';
          const identifiers = (info.industryIdentifiers && info.industryIdentifiers[1]) ? (info.industryIdentifiers[1].identifier || info.industryIdentifiers[1]) : (info.industryIdentifiers && info.industryIdentifiers[0]) ? (info.industryIdentifiers[0].identifier || info.industryIdentifiers[0]) : isbn;
          const genre = (info.categories && info.categories[0]) ? info.categories[0] : '';
          setBookData({ bookname: bookName, isbn: identifiers, author: author, genre: genre, subgenre: genre, publisher: publisher })
          // Use local variables to avoid stale state when calling addBook
          const res = await globalCon.addBook(bookName, identifiers, genre, genre, author, publisher);
          // console.log('Google Books info:', info);
          if (!res) {
            toast.error('Something went wrong!!', {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            });
          } else {
            toast.success('Added Successfully', {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            });
            setPopupOpen(true);
          }
          // console.log("Book Name:", bookName);
          // console.log("Author(s):", author);
          // console.log("Publisher:", publisher);
          // console.log("Published Date:", publishedDate);
          // console.log("ISBN-10:", identifiers || '');
          // console.log("Genre(s):", genre);
        } else {
          console.warn(`Google Books: no results for ISBN: ${isbn}`);
        }
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error("Error fetching book data:", error);
      }
      setResult("");
    };

    fetchBookForIsbn(result);

    return () => controller.abort();
  }, [result]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" />
      {loader && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <DotLoader color="#d38473" />
      </div>}


      <div style={{ textAlign: "center" }}>
        <h2 className="text-center font-extrabold text-2xl m-4">Barcode Scanner</h2>
        <div style={{ margin: 'auto', width: '800px', maxWidth: '100%', height: '60vh', position: 'relative', borderRadius: 10, overflow: 'hidden' }}>
          <video
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            ref={videoRef}
            autoPlay
            muted
            playsInline
          />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <img src={QrFrame} alt="frame" style={{ width: '100%', height: '100%', objectFit: 'contain', maxWidth: '800px', maxHeight: '60vh' }} />
          </div>
        </div>
        <h3>Result: {result}</h3>
        <p className="mt-2 text-center text-sm text-gray-500">
          <a
            href={"/#/addbookentry"}
            className="font-semibold leading-6 text-[#d38473] hover:[#bd7667]"
          >
            Add Book Manually
          </a>
        </p>
      </div>

    </>
  )
}

export default AddBookBarcodeFlow;