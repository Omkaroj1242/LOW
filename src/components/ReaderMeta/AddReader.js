import React, { useContext, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { globalContext } from "../../contextapi/GlobalContext";
import { BounceLoader } from "react-spinners";
import { useLocation, useNavigate } from "react-router-dom";
import ReaderQrPopUp from "./ReaderQrPopUp";
import ReaderBulkUploadModal from "../ReaderMeta/ReaderBulkUploadModal";
import DownloadQrModal from "./DownloadQrModal";
import useRazorpay from "react-razorpay";
import CryptoJS from "crypto-js";
import logoImg from "../../assets/LoWIcon.webp";
import { Modal, Button, Typography } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { DotLoader } from "react-spinners";
import useCountDown from "../Utils/useCountDown";

const { Title, Paragraph } = Typography;

const AddReader = () => {
  const { secondsLeft, start } = useCountDown();
  const [Razorpay] = useRazorpay();
  const query = new URLSearchParams(useLocation().search);
  const libraryId = Number(query.get("libraryId"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    success: false,
  });
  const [loader, setLoader] = useState(false);
  const [reader_id, setReader_id] = useState(null);
  const [userData, setUserData] = useState({
    fullname: "",
    mobile: "",
    email: "",
  });
  const [isPopupOpen, setPopupOpen] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);
    setPopupOpen(true);
  };

  const navigate = useNavigate();
  const globalCon = useContext(globalContext);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  function hmac_sha256(data, key) {
    return CryptoJS.HmacSHA256(data, key).toString(CryptoJS.enc.Hex);
  }

  const handlePayment = async () => {
    setLoader(true);
    if (checkVal()) {
      const arr = {
        Name: userData.fullname,
        Email: userData.email,
      };

      const data = {
        currency: "INR",
        amount: 400 * 100,
        notes: arr,
      };
      const orderId = await globalCon.createOrder(libraryId, data);

      if (orderId === null) {
        alert("Error occured");
        setLoader(false);
      } else {
        // Start loading state for payment
        const options = {
          key: "rzp_live_2WUMvkZisW2czu", // Enter the Key ID generated from the Dashboard
          amount: 400 * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "Addlib",
          description: "Test Transaction",
          image: logoImg,
          order_id: orderId,
          config: {
            display: {
              blocks: {
                banks: {
                  name: "All payment methods",
                  instruments: [
                    {
                      method: "upi",
                    },
                  ],
                },
              },
              sequence: ["block.banks"],
              preferences: {
                show_default_blocks: false,
              },
            },
          },
          handler: async function (response) {
            // validating the response that it is coming from Razorpay
            const generated_signature = hmac_sha256(
              orderId + "|" + response.razorpay_payment_id,
              "OFG8c9i06ejMfhIQ41WEm9i5"
            );
            const userAdded = await saveData();
            if (
              generated_signature === response.razorpay_signature &&
              userAdded
            ) {
              setModalContent({
                title: "Order Successful",
                message: `Order ID: ${orderId}\nPayment ID: ${response.razorpay_payment_id}\nPayment Success.`,
                success: true,
              });
              start(4);
              setTimeout(() => {
                closeModal();
              }, 4000);
            } else {
              setModalContent({
                title: "Order Failed",
                message: `Order ID: ${orderId}\nPayment ID: ${response.razorpay_payment_id}\nSomething went wrong. Can't add user. If any money is debited, it will be refunded shortly.`,
                success: false,
              });
            }
            setUserData({ fullname: "", mobile: "", email: "" });
            setIsModalVisible(true);
          },
          notes: {
            address: "LOW Corporate Office",
          },
          theme: {
            color: "#d38473",
          },
        };

        const rzp1 = new Razorpay(options);

        rzp1.on("payment.failed", function (response) {
          setUserData({ fullname: "", mobile: "", email: "" });
          alert(response.error.description);
        });

        rzp1.on("payment.error", function (response) {
          setLoader(false); // Stop loading state on payment error
          alert("Payment failed");
        });

        rzp1.open();
        setLoader(false); // Stop loading state after payment popup opens
        setUserData({ fullname: "", mobile: "", email: "" });
      }
    } else {
      checkVal();
    }
  };

  const modalIcon = modalContent.success ? (
    <CheckCircleOutlined
      style={{ color: "#52c41a", fontSize: "3rem", marginBottom: "20px" }}
    />
  ) : (
    <CloseCircleOutlined
      style={{ color: "#ff4d4f", fontSize: "3rem", marginBottom: "20px" }}
    />
  );

  const checkVal = () => {
    let phone = document.getElementById("mobile");
    if (userData.mobile.length !== 10) {
      phone.setCustomValidity("Invalid Number");
      return false;
    } else {
      phone.setCustomValidity("");
      return true;
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoader(true);
    if (checkVal()) {
      const fetchReaderOnPhoneANdEmail =
        await globalCon.fetchReaderOnPhoneAndEmail(
          userData.mobile,
          userData.email
        );
      if (fetchReaderOnPhoneANdEmail) {
        toast.error("Reader already exist!!", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        setLoader(false);
        return false;
      } else {
        handlePayment();
      }
    } else {
      checkVal();
    }
  };

  const saveData = async () => {
    if (userData.mobile.length === 10) {
      setLoader(true);
      const res = await globalCon.addReader(
        libraryId,
        userData.fullname,
        userData.mobile,
        userData.email
      );
      setLoader(false);
      setUserData({ fullname: "", mobile: "", email: "" });

      if (!res) {
        toast.error("Something went wrong!!", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        return false;
      } else {
        toast.success("Registered Successfully", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        setReader_id(res.reader_id);
        // Delayed open of ReaderQrPopUp modal
        // Adjust delay time as needed
        return true;
      }
    } else {
      checkVal();
    }
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col mt-4">
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
      {/* Modal for showing payment status */}
      <Modal
        title={
          <Title level={3} style={{ color: "#d38473" }}>
            {modalContent.title}
          </Title>
        }
        open={isModalVisible}
        onCancel={() => {
          closeModal();
        }}
        footer={
          <div className="text-center">
            Redirecting in {secondsLeft} seconds...
          </div>
        }
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          {modalIcon}
          <Paragraph style={{ marginBottom: "10px" }}>
            {modalContent.message.split("\n").map((text, index) => (
              <span
                key={index}
                style={{ display: "block", marginBottom: "10px" }}
              >
                {text}
              </span>
            ))}
          </Paragraph>
        </div>
      </Modal>

      {/* Main form section */}
      <div className="container max-w-xl mx-auto mt-10 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          {localStorage.getItem("token") && (
            <div className="flex flex-row-reverse">
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-center rounded bg-[#d38473] text-white hover:bg-[#bd7667] focus:outline-none p-1"
              >
                Bulk Upload
              </button>
            </div>
          )}
          {isModalOpen && (
            <ReaderBulkUploadModal closeModal={() => setIsModalOpen(false)} />
          )}

          <h1 className="mb-8 text-3xl text-center">Add Reader</h1>

          <form onSubmit={handleSignup}>
            <input
              value={userData.fullname}
              onChange={handleChange}
              type="text"
              className="mb-4 block w-full h-10 rounded-md p-2 border-0 py-1.5 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#d38473] sm:text-sm sm:leading-6"
              name="fullname"
              placeholder="Full Name"
              minLength={3}
              required
            />
            <input
              value={userData.mobile}
              onChange={handleChange}
              onKeyUp={checkVal}
              type="number"
              id="mobile"
              className="mb-4 block w-full h-10 rounded-md p-2 border-0 py-1.5 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#d38473] sm:text-sm sm:leading-6"
              name="mobile"
              placeholder="Mobile"
              required
            />

            <input
              value={userData.email}
              onChange={handleChange}
              type="email"
              className="mb-4 block w-full h-10 rounded-md p-2 border-0 py-1.5 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#d38473] sm:text-sm sm:leading-6"
              name="email"
              placeholder="Email"
              required
            />

            <button
              disabled={loader}
              type="submit"
              className="w-full text-center py-3 rounded bg-[#d38473] text-white hover:bg-[#bd7667] focus:outline-none my-1"
            >
              Register
            </button>
          </form>
          <div className="flex text-xs mt-2 flex-row-reverse">
            <span>Annual Subscription ₹400 + ₹8 Convenience Fee</span>
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-sm text-gray-500">
          Existing Reader? 

          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="font-semibold leading-6 text-[#d38473] hover:[#bd7667]"
          >
             Download QR
          </button>
        </p>
        {isDownloadModalOpen && (
            <DownloadQrModal closeDownloadModal={() => setIsDownloadModalOpen(false)} />
          )}
      <div className="flex flex-col p-6 md:p-8 gap-y-6 max-w-3xl mx-auto">
        {/* Terms and Conditions */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Terms and Conditions</h2>
          <p className="text-sm text-gray-700">
            Addlib Bookstore, Library owns this website,
            <a
              className="text-orange-500 underline"
              href="https://www.addlib.club/#/login-signup"
            >
              www.addlib.club
            </a>
            . Addlib makes available information and materials on this website
            <a
              className="text-orange-500 underline"
              href="https://www.addlib.club/#/login-signup"
            >
              www.addlib.club
            </a>{" "}
            subject to the following terms and conditions (Terms). In these
            Terms, the user of the Website is referred to as “you” or “your,”
            and the provider of the website is referred to as “addlib Bookstore,
            Cafe and Library”,
            <a
              className="text-orange-500 underline"
              href="https://www.addlib.club/#/login-signup"
            >
              www.addlib.club
            </a>
            , “we”, “us” or “our”. Your use of
            <a
              className="text-orange-500 underline"
              href="https://www.addlib.club/#/login-signup"
            >
              www.addlib.club
            </a>{" "}
            constitutes your agreement to follow and be bound by these Terms. If
            you do not agree to the Terms, you may not use the site. Addlib
            Bookstore, Library reserves the right to change these Terms
            periodically without prior notice.
          </p>
        </div>

        {/* Privacy Policy */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Privacy Policy</h2>
          <p className="text-sm text-gray-700">
            Aside from what is expressly mentioned, we do not collect any
            personal data of visitors to this website. In order to place orders,
            you would be required to share information such as name, address,
            phone number. You may be required to share your banking information
            with our payment providers in order to place orders on this website.
            We do not access such information. In order to provide a functioning
            website and a good user experience, we may use cookies on this
            website which would collect some personal data. We will not sell,
            distribute or lease your personal information to third parties
            unless we have your permission or are required by law to do so. We
            may use your personal information to send you promotional
            information about our services. If you believe that any information
            we are holding on you is incorrect or incomplete, please email us at
            <a
              className="text-orange-500 underline"
              href="mailto:hello@addlib.club"
            >
              hello@addlib.club
            </a>
            . We will promptly correct any information found to be incorrect.
          </p>
        </div>

        {/* Payment, Refund and Cancellation */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">
            Payment, Refund and Cancellation
          </h2>
          <ol className="text-sm text-gray-700 list-decimal pl-6 space-y-2">
            <li>
              Full payment to be made at the time of subscribing to Addlib
              library service.
            </li>
            <li>
              Once purchased, no partial or full refund will be provided, unless
              there is an exceptional circumstance which will be decided by
              Addlib on a case-by-case basis.
            </li>
            <li>
              Addlib does not store any of your payment information (debit card,
              credit card, net banking, etc.) or such other information
              restricted by the Reserve Bank of India (RBI) for processing
              payment and has partnered with payment gateways for the payment
              towards the services.
            </li>
            <li>
              In case of any other payment, refund, or cancellation issues,
              decisions will be taken on a case-by-case basis, and Addlib’s
              decision will be final and binding.
            </li>
          </ol>
        </div>

        {/* Contact Us */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
          <p className="text-sm text-gray-700">
            For any concerns related to payment or refunds, kindly write to
            <a
              className="text-orange-500 underline"
              href="mailto:hello@addlib.club"
            >
              hello@addlib.club
            </a>
            .
          </p>
          <p className="text-sm text-gray-700 mt-2">
            Address: Gandhinagar, Nagpur, Maharashtra - 440010
          </p>
        </div>
      </div>

      {/* Modal for showing QR popup */}
      <ReaderQrPopUp
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        id={reader_id}
      />
    </div>
  );
};

export default AddReader;
