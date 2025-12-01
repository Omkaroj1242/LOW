import "./QrScanner.css";
import { useEffect, useRef, useState, useContext } from "react";
import QrScanner from "qr-scanner";
import QrFrame from "../../assets/qr-frame.svg";
import { useNavigate } from "react-router-dom";
import { globalContext } from '../../contextapi/GlobalContext'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { BounceLoader, DotLoader } from "react-spinners";
import CryptoJS from 'crypto-js';


const QrReader = () => {
  const secretKey = 'your-secret-key-book';
  const [value, setValue] = useState("");
  const scanner = useRef();
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const globalCon = useContext(globalContext);
  let navigate = useNavigate();
  const [cameraFacingMode, setCameraFacingMode] = useState("user");


  // Success
  const onScanSuccess = async (result) => {
    try {
      scanner?.current?.stop();
      setQrOn(false)
      const bytes = CryptoJS.AES.decrypt(result.data, secretKey);
      const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
      console.log(decryptedValue)
      const bookFound = await globalCon.fetchBook(decryptedValue);
      if (bookFound) {
        const entryFound = await globalCon.fetchLedgerEntry(decryptedValue);
        if (entryFound) {
          navigate("/return")
        } else {
          navigate("/issue")
        }
      } else {
        toast.error('No Book Found', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        setTimeout(async () => {
          await scanner.current.start();
          setQrOn(true);
        }, [1500])
      }
    } catch (error) {
      toast.error('No Book Found', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setTimeout(async () => {
        await scanner.current.start();
        setQrOn(true);
      }, [1500])
    }
  };

  // Fail
  const onScanFail = (err) => {
    // 🖨 Print the "err" to browser console.
    // console.log(err);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    scanner?.current?.stop();
    setQrOn(false)
    const bookFound = await globalCon.fetchBook(value);
    if (bookFound) {
      const entryFound = await globalCon.fetchLedgerEntry(value);
      if (entryFound) {
        navigate("/return")
      } else {
        navigate("/issue")
      }
    } else {
      toast.error('No Book Found', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      await scanner.current.start();
      setQrOn(true);
    }

  }

  useEffect(() => {
    globalCon.setBookData(null);
    globalCon.setReaderData(null);
    globalCon.setLedgerData(null);
    const initializeScanner = async () => {
      if (videoEl.current && !scanner.current) {
        scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
          onDecodeError: onScanFail,
          preferredCamera: cameraFacingMode,
          highlightScanRegion: true,
          highlightCodeOutline: true,
          overlay: qrBoxEl.current || undefined,
        });

        try {
          await scanner.current.start();
          setQrOn(true);
          setCameraOn(true);
        } catch (error) {
          alert("Error starting QR scanner:");
          setQrOn(false);
          setCameraOn(false);
        }
      }
    };

    const scanDelay = setTimeout(() => {
      initializeScanner();
    }, 2000);

    return () => {
      clearTimeout(scanDelay);
      if (scanner.current) {
        scanner.current.stop();
        scanner.current = null;
      }
    };
  }, [videoEl, scanner, cameraFacingMode, qrBoxEl]);

  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!cameraOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [cameraOn]);

  return (
    <div className="h-[100vh]">
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
      <div>
        {!qrOn && <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"><DotLoader color="#d38473" /></div>}
        {qrOn && <div className="text-center font-extrabold text-2xl m-4">Scan the Book QR</div>}
        <div className="qr-reader">
          {/* QR */}
          <video ref={videoEl}></video>
          <div ref={qrBoxEl} className="qr-box">
            <img
              src={QrFrame}
              alt="Qr Frame"
              className="qr-frame sm:w-[800px] sm:h-[60vh] w-[250px] h-[300px]"
            />

          </div>
        </div>
      </div>
      {qrOn && <div>
        <h3 className="mt-2 text-center text-xl">or</h3>
        <form className="m-2 flex flex-row gap-x-2 justify-center items-end" >
          <input value={value} onInput={handleChange} type="text" className="w-[50%] border-2 border-black border-opacity-40 text-center focus:border-[#d38473] focus:border-2 outline-none md:w-[30%] rounded-lg p-[5px] bg-white" placeholder="Enter Book ID" />
          <button onClick={handleSubmit} className="p-[5px] mb-[2px] rounded-xl border-none text-white bg-[#d38473]" type="submit">Submit</button>
        </form>
      </div>}
    </div>
  );
}

export default QrReader;