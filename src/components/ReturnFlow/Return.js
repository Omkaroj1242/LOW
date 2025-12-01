import React,{useContext, useEffect} from 'react'
import { globalContext } from '../../contextapi/GlobalContext'
import ReturnImg from "../../assets/PngItem_117454.png"
import useCountDown from '../Utils/useCountDown';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const Return = () => {
  const navigate = useNavigate();
    const globalCon = useContext(globalContext);

    const {secondsLeft, start} = useCountDown();

    useEffect(()=>{
      if(globalCon.bookData){
      const bookReturned = globalCon.removeLedgerEntry(globalCon.ledgerData.ledger_id);
      if(bookReturned){
        toast.success('Returned Successfully',{
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          });
      }else{
        toast.error('Some Error!! Try again', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          });
      }
      start(6);
      setTimeout(() => {
        navigate("/");
      }, 6000);
    }
    },[])

  return (<>    <ToastContainer
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
    <div className='text-center'>
        <div className='text-2xl text-center m-4 font-extrabold'>Return Book</div>
        {globalCon.bookData && <div className='sm:flex justify-center'>
        <img className='mt-[50px] m-auto sm:m-0 sm:mt-14 w-[200px] h-[290px]'  src={ReturnImg} alt="returnimage" />
        <div className='border-2 p-10 w-[80%] sm:w-[33%] content-center m-[auto] sm:m-[5%] mt-[40px] sm:mt-[80px] bg-white rounded-xl'>Thank you,Book with ID:{globalCon.bookData.bookId} has been successfully returned</div>
        </div>}
        {globalCon.bookData && <div>Redirecting in {secondsLeft} seconds...</div>}
        {!globalCon.bookData && <div className='text-center'>No data</div>}
    </div></>
  )
}

export default Return
