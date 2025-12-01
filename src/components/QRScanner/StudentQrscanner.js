import CryptoJS from 'crypto-js';
import "./QrScanner.css";
import { useEffect, useRef, useState, useContext } from "react";
import QrScanner from "qr-scanner";
import QrFrame from "../../assets/qr-frame.svg";
import { useNavigate } from "react-router-dom";
import { globalContext } from '../../contextapi/GlobalContext'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { DotLoader } from "react-spinners";

const QrReader = () => {
    const secretKey = 'your-secret-key-reader';
    const [value, setValue] = useState("");
    const scanner = useRef();
    const videoEl = useRef(null);
    const qrBoxEl = useRef(null);
    const [qrOn, setQrOn] = useState(false);
    const globalCon = useContext(globalContext);
    let navigate = useNavigate();
    const [cameraFacingMode, setCameraFacingMode] = useState("user");
    const [cameraOn, setCameraOn] = useState(true);

  // Success
  const onScanSuccess = async (result) => {
    scanner?.current?.stop();
    setQrOn(false)
    const bytes = CryptoJS.AES.decrypt(result.data, secretKey);
    const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
    try{
      decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
    }catch(e){
      
    }
  
  const msg = await globalCon.fetchReaderLedgerEntry(decryptedValue); 
  const readerFound = await globalCon.fetchReader(decryptedValue);
  if(readerFound && msg==="No entry found"){
    navigate("/issued")
  }else if(msg === "Maximum Limit Reached"){
    navigate("/?error=maximum_limit_reached");
  }else{
    toast.error( "Reader Not Found", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      });
      setTimeout(async ()=>{
        await scanner.current.start();
        setQrOn(true);
      },[1500])
    }
  };

  // Fail
  const onScanFail = (err) => {
    // 🖨 Print the "err" to browser console.
  };

  const handleChange=(e)=> { 
    setValue(e.target.value); 
} 
const handleSubmit=async (e)=>{
  e.preventDefault();
  scanner?.current?.stop();
  setQrOn(false)
  const msg = await globalCon.fetchReaderLedgerEntry(value); 
  const readerFound = await globalCon.fetchReader(value);
    if(readerFound && msg==="No entry found"){
    navigate("/issued")
  }else if(msg === "Maximum Limit Reached"){
    navigate("/?error=maximum_limit_reached");
  }else{
    toast.error( "Reader Not Found", {
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
      theme="light"/>
   <div>
   {!qrOn && <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"><DotLoader color="#d38473" /></div>}
   {qrOn && <div className='text-2xl text-center w- m-4 mb-0 font-bold'>Issue Book - {globalCon.bookData ? globalCon.bookData.title : "No data"}</div>}
       {qrOn && <div className="text-center font-extrabold text-2xl m-4">Scan the Reader QR</div>}
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
             <form  className="m-2 flex flex-row gap-x-2 justify-center items-end" >
                 <input value={value} onInput={handleChange} type="text" className="w-[50%] border-2 border-black border-opacity-40 text-center focus:border-[#d38473] focus:border-2 outline-none md:w-[30%] rounded-lg p-[5px] bg-white" placeholder="Enter Student ID" />
                 <button onClick={handleSubmit} className="p-[5px] mb-[2px] rounded-xl border-none text-white bg-[#d38473]" type="submit">Submit</button>
             </form>
             </div>}
             </>
  );
}

export default QrReader;