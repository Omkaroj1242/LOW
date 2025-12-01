import React, { useContext, useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { globalContext } from '../../contextapi/GlobalContext'
import { BounceLoader, DotLoader } from "react-spinners";



const AddBook = () => {
  const videoRef = useRef(null);
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
    const reader = new BrowserMultiFormatReader(hints);

    // start decoding from default device
    if (videoRef.current) {
      reader.decodeFromVideoDevice(null, videoRef.current, (res, err) => {
        if (res) {
          setResult(res.getText());
        }
        // NotFoundException is expected frequently while scanning; log other errors
        if (err && err.name !== "NotFoundException") {
          console.error("Barcode decode error:", err);
        }
      }).catch((e) => {
        console.error("Failed to start decodeFromVideoDevice:", e);
      });
    } else {
      console.error('videoRef.current is not available');
    }

    return () => {
      // stop camera and decoding 
      try {
        reader.reset();
      } catch (e) {
        console.error("Failed to reset reader:", e);
      }
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
        if (data.totalItems > 0 && data.items && data.items.length) {
          const info = data.items[0].volumeInfo;
          const bookName = "Test " + info.title;
          const author = info.authors || [];
          const publisher = info.publisher || '';
          const publishedDate = info.publishedDate || '';
          const identifiers = info.industryIdentifiers[1] || [];
          const genre = info.categories[0] || [];
          setBookData({ bookname: bookName, isbn: identifiers, author: author, genre: genre, subgenre: genre, publisher: publisher })
          const res = await globalCon.addBook(bookData.bookname, bookData.isbn, bookData.author, bookData.genre, bookData.subgenre, bookData.publisher);
          console.log(info);
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
          console.log("Book Name:", bookName);
          console.log("Author(s):", author);
          console.log("Publisher:", publisher);
          console.log("Published Date:", publishedDate);
          console.log("ISBN-10:", identifiers || '');
          console.log("Genre(s):", genre);
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
        <video
          style={{ margin: "auto", borderRadius: "10px", objectFit: "cover", width: "800px", height: "60vh" }}
          ref={videoRef}
          width="500"
          height="500"
          autoPlay
          muted
          playsInline
        />
        <h3>Result: {result}</h3>
      </div>

    </>
  )
}

export default AddBook