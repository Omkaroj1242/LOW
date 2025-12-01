import React, { useEffect, useContext } from 'react'
import QrReader from './QRScanner/QrReader'
import { useNavigate } from 'react-router-dom'
import { globalContext } from '../contextapi/GlobalContext'
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const Home = () => {
  const location = useLocation();
  const globalCon = useContext(globalContext);
  const navigate = useNavigate();
  useEffect(()=>{
    if(localStorage.getItem("token") && localStorage.getItem("libraryId") && localStorage.getItem("merchantId")){
      globalCon.setPayload({
        "token": localStorage.getItem("token"),
        "merchantId": localStorage.getItem("merchantId"),
        "libraryId" : localStorage.getItem("libraryId")
      })
    }else{
      navigate("/login-signup")
    }
  },[])
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const error = queryParams.get('error');

    if (error === 'maximum_limit_reached') {
      toast.error('Maximum Limit Reached', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    }
  }, [location,navigate]);
  return (
    <>
    <div>
    <QrReader/>
    </div>
    </>
  )
}

export default Home
