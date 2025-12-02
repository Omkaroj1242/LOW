import React, { useContext, useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { globalContext } from '../../contextapi/GlobalContext'
import { BounceLoader, DotLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import BookBulkUploadModal from './BookBulkUploadModal'
import BookQrPopUp from "./BookQrPopUp";

const AddBook = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupOpen, setPopupOpen] = React.useState(false);
  const [book_id, setBook_id] = useState(null);
  const [book_title, setBook_title] = useState(null);
  const [book_isbn, setBook_isbn] = useState(null);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const navigate = useNavigate();
  const globalCon = useContext(globalContext);
  const [userData, setUserData] = useState({ bookname: "", isbn: "", author: "", genre: "", subgenre: "", publisher: "" });
  const [loader, setLoader] = useState(false);
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login-signup")
    }
  }, [])
  const checkVal = () => {
    let isbn = document.getElementById("isbn")
    if (userData.isbn.length > 13 || userData.isbn.length < 10) {
      isbn.setCustomValidity("Invalid ISBN");
    } else {
      isbn.setCustomValidity("");
    }
  }
  const handleSignup = (e) => {
    e.preventDefault();
    const saveData = async () => {
      if (userData.isbn.length >= 10 || userData.isbn.length <= 13) {
        setLoader(true)
        const res = await globalCon.addBook(userData.bookname, userData.isbn, userData.author, userData.genre, userData.subgenre, userData.publisher);
        setBook_id(res.book_copy_id)
        setBook_title(userData.bookname)
        setBook_isbn(userData.isbn)
        setLoader(false)
        setUserData({ bookname: "", isbn: "", author: "", genre: "", subgenre: "", publisher: "" })
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
      } else {
        checkVal();
      }
    }
    saveData();
  }
  return (
    <div>
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
      <div className="bg-grey-lighter min-h-screen flex flex-col mt-4">
        <div className="container max-w-xl mx-auto mt-10 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <div className="flex flex-row-reverse"><button onClick={openModal} className="text-center rounded bg-[#d38473] text-white hover:bg-[#bd7667] focus:outline-none p-1">Bulk Upload</button></div>
            {isModalOpen && <BookBulkUploadModal closeModal={closeModal} />}
            <h1 className="mb-8 text-3xl text-center">Add Book</h1>
            <form onSubmit={handleSignup}>
              <input value={userData.bookname} onChange={handleChange} type="text" className="mb-4 block w-full h-10 rounded-md p-2 border-0 py-1.5 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#d38473] sm:text-sm sm:leading-6" name="bookname" placeholder="Book Name" required />
              <input value={userData.isbn} onChange={handleChange} onKeyUp={checkVal} type="number" id="isbn" className="mb-4 block w-full h-10 rounded-md p-2 border-0 py-1.5 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#d38473] sm:text-sm sm:leading-6" name="isbn" placeholder="ISBN" required />

              <input value={userData.author} onChange={handleChange} type="text" className="mb-4 block w-full h-10 rounded-md p-2 border-0 py-1.5 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#d38473] sm:text-sm sm:leading-6" name="author" placeholder="Author" required />
              <input value={userData.genre} onChange={handleChange} type="text" className="mb-4 block w-full h-10 rounded-md p-2 border-0 py-1.5 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#d38473] sm:text-sm sm:leading-6" name="genre" placeholder="Genre" required />
              <input value={userData.subgenre} onChange={handleChange} type="text" className="mb-4 block w-full h-10 rounded-md p-2 border-0 py-1.5 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#d38473] sm:text-sm sm:leading-6" name="subgenre" placeholder="Subgenre" required />
              <input value={userData.publisher} onChange={handleChange} type="text" className="mb-4 block w-full h-10 rounded-md p-2 border-0 py-1.5 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#d38473] sm:text-sm sm:leading-6" name="publisher" placeholder="Publisher" required />


              <button disabled={loader}
                type="submit"
                className="w-full text-center py-3 rounded bg-green bg-[#d38473] text-white hover:bg-[#bd7667] focus:outline-none my-1"
              >
                Add
              </button>
            </form>
            <p className="mt-2 text-center text-sm text-gray-500">
              <a
                href={"/#/addbook"}
                className="font-semibold leading-6 text-[#d38473] hover:[#bd7667]"
              >
                Add Book Scan Barcode
              </a>
            </p>
          </div>
        </div>
        <BookQrPopUp isOpen={isPopupOpen} onClose={() => setPopupOpen(false)} bookId={book_id} title={book_title} isbn={book_isbn} />
      </div>
    </div>
  )
}

export default AddBook