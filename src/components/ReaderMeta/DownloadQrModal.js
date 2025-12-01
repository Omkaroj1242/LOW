import React, { useState, useContext } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DotLoader } from "react-spinners";
import { PiArrowFatLinesDownBold } from "react-icons/pi";
import ReaderGenqr from './ReaderGenqr';
import { globalContext } from "../../contextapi/GlobalContext";

const DownloadQrModal = ({ closeDownloadModal }) => {
  const [loader, setLoader] = useState(false);
  const [readerId, setReaderId] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [userExists, setUserExists] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState({
    phone: "",
    captcha: "",
  });
  const globalCon = useContext(globalContext);

  // Generate a random captcha
  const generateCaptcha = () => Math.random().toString(36).substring(2, 7);

  // Initialize captcha
  const [generatedCaptcha] = useState(generateCaptcha());

  const handleSubmit = async (e) => {
    let phone = document.getElementById("phone");
    e.preventDefault();
    if (checkVal()) {
      setLoader(true);
        const fetchReaderOnPhone = await globalCon.fetchReaderOnPhone(
            userData.phone
          );
        if(fetchReaderOnPhone!=="Reader not found"){
            setReaderId(fetchReaderOnPhone);
            setUserExists(true)
        }else{
            setUserExists(false)
        }
      if (
        userExists &&
        generatedCaptcha === userData.captcha
      ) {
        setLoader(false);
        setIsVerified(true);
      } else if (
        !userExists &&
        generatedCaptcha === userData.captcha
      ) {
        setLoader(false);
        setIsVerified(true);
      } else {
        setLoader(false);
        setErrorMessage("Invalid Captcha");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }
    } else {
      phone.reportValidity();
      checkVal();
    }
  };

  const checkVal = () => {
    let phone = document.getElementById("phone");
    if (userData.phone.length !== 10) {
      phone.setCustomValidity("Invalid Number");
      return false;
    } else {
      phone.setCustomValidity("");
      return true;
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

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
        theme="light"
      />
      {loader && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <DotLoader color="#d38473" />
        </div>
      )}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
        <div className="m-2 sm:m-0 bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md">
          <button
            className="absolute top-2 right-2 text-2xl text-[#d38473]"
            onClick={closeDownloadModal}
          >
            <IoIosCloseCircle />
          </button>
          {!isVerified ? (
            <h2 className="text-2xl font-bold mb-6 text-center">
              Confirm Your Details
            </h2>
          ) : userExists ? (
            <h2 className="text-2xl font-bold mb-6 text-center">Download QR</h2>
          ) : (
            <h2 className="text-2xl font-bold mb-6 text-center">
              Reader Does Not Exist
            </h2>
          )}

          {!isVerified ? (
            // Input fields for phone number and captcha
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Phone Number</label>
                <input
                  value={userData.phone}
                  onChange={handleChange}
                  onBlur={checkVal}
                  type="number"
                  id="phone"
                  className="mb-4 block w-full h-10 rounded-md p-2 border-0 py-1.5 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#d38473] sm:text-sm sm:leading-6"
                  name="phone"
                  placeholder="Enter Phone"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">Captcha</label>
                <div className="flex items-center">
                  <span className="mr-4 p-2 bg-gray-200 rounded">
                    {generatedCaptcha}
                  </span>
                  <input
                    value={userData.captcha}
                    onChange={handleChange}
                    type="text"
                    className="block w-full h-10 rounded-md p-2 border-0 py-1.5 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#d38473] sm:text-sm sm:leading-6"
                    name="captcha"
                    placeholder="Enter Captcha"
                    required
                  />
                </div>
                {errorMessage && (
                  <p className="text-xs text-red-500 mt-2">{errorMessage}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full text-center py-3 rounded bg-[#d38473] text-white hover:bg-[#bd7667] focus:outline-none my-1"
              >
                Verify
              </button>
            </form>
          ) : (
            // Display message based on user existence
            <div className="text-center">
              {userExists ? (
                <div>
                <h2 className="text-xl font-bold mb-4 text-center">ReaderID: {readerId}</h2>
                <ReaderGenqr prop={String(readerId)}/>
              </div>
              ) : (
                <div className="text-center">
                  <p className="mb-4 text-gray-700 font-medium">
                    No worries, subscribe now
                  </p>
                  <PiArrowFatLinesDownBold className="text-[#d38473] text-4xl mx-auto mb-4" />
                  <button
                    className="w-full px-4 py-2 bg-[#d38473] text-white rounded-lg shadow hover:bg-[#bd7667] focus:outline-none transition ease-in-out duration-300"
                    onClick={closeDownloadModal}
                  >
                    Subscribe Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DownloadQrModal;
