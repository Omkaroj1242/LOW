import React,{useContext, useEffect, useState} from 'react'
import { globalContext } from '../../contextapi/GlobalContext'
import Issueimg from "../../assets/pngegg.png"
import useCountDown from '../Utils/useCountDown';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const Issued = () => {
  const navigate = useNavigate();
    const globalCon = useContext(globalContext);

    const {secondsLeft, start} = useCountDown();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [successIssue, setSuccessIssue] = useState(true);

    const addEntry= ()=>{
      const res = globalCon.addLedgerEntry(globalCon.bookData.bookId,globalCon.readerData.reader_id);
      setSuccessIssue(res);
      if(res){
        toast.success('Successfully Issued', {
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
    }

    useEffect(()=>{
      if(globalCon.bookData){
        addEntry()
      start(6);
      setTimeout(() => {
        navigate("/");
      }, 6000);
    };
    },[])

  return (
    <>
        <div className='text-2xl text-center m-4 font-bold'>Book Issued</div>
    {successIssue && globalCon.bookData && <div className='text-center'>
        <div className='sm:flex justify-center'>
        <img className='mt-[50px] m-auto sm:m-0 sm:mt-14 w-[300px] h-[300px]'  src={Issueimg} alt="returnimage" />
        <div className='border-2 p-10 w-[80%] sm:w-[33%] content-center m-[auto] sm:m-[5%] mt-[40px] sm:mt-[80px] bg-white rounded-xl'>Student with ID: {globalCon.readerData.reader_id} has Successfully issued the Book with ID:{globalCon.bookData.bookId}</div>
        </div>
      <div>Redirecting in {secondsLeft}..</div>
    </div>}
    {!successIssue && globalCon.bookData && <div className='text-center'>
        <div className='sm:flex justify-center'>
        <img className='mt-[50px] m-auto sm:m-0 sm:mt-14 w-[300px] h-[300px]'  src={Issueimg} alt="returnimage" />
        <div className='border-2 p-10 w-[80%] sm:w-[33%] content-center m-[auto] sm:m-[5%] mt-[40px] sm:mt-[80px] bg-white rounded-xl'>Something went wrong!! Try again</div>
        </div>
      <div>Redirecting in {secondsLeft}..</div>
    </div>}
    {!globalCon.bookData && <div className='text-center'>No data</div>}
    </>
  )
}

export default Issued

