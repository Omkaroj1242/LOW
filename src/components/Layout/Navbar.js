import React, { useEffect, useState } from 'react';
import { IoReorderThreeOutline } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import logoImg from "../../assets/LoWIcon.webp";
import { AiOutlineLogin } from "react-icons/ai";
import { useRef } from 'react';
import { LuUserCircle } from "react-icons/lu";
import LoadingBar from 'react-top-loading-bar'
import 'primeicons/primeicons.css';
import { Link, useNavigate, useLocation } from "react-router-dom";


const Navbar = () => {
  const location = useLocation();

  // For TCS
  // const isOnlyTcsAddReaderEndpoint = location.pathname === '/addreader/tcssubscription';
  // const isOnlyTcsAbout = location.pathname === '/abouttcs';
  // const isAddReaderEndpoint = 
  // location.pathname === '/addreader' || location.pathname === '/addreader/tcssubscription' || location.pathname === '/abouttcs';

  // Check if the current path is "/addreader"
  const isAddReaderEndpoint = location.pathname === '/addreader';
  let navigate = useNavigate();
    const ref = useRef();
    const [showModal, setShowModal] = useState(false);
    const pathname = window.location.pathname;
    const [progress, setProgress] = useState(20);
    useEffect(()=>{
    setProgress(100);
  },[pathname])
  const toggleSideBar=()=>{
    if(showModal){
      setShowModal(false);
    }
    if(ref.current.classList.contains('translate-x-full')){
      ref.current.classList.remove('translate-x-full');
      ref.current.classList.add('translate-x-0');
    }else if(ref.current.classList.contains('translate-x-0')){
      ref.current.classList.remove('translate-x-0');
      ref.current.classList.add('translate-x-full');
    }
  }
  const handleShowModal =()=>{
    if(showModal){
      setShowModal(false)
    }else{
      setShowModal(true)
    }
  }
  const logout = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("libraryId");
    localStorage.removeItem("merchantId");
    if(showModal){
      setShowModal(false)
    }
    navigate("/login-signup")
  }
  
  return (
    <>
     <LoadingBar
        color='#f11946'
        progress={progress}
        staticStart={20}
        waitingTime={300}
        onLoaderFinished={() => setProgress(0)}
      />
      
    <nav className='sticky top-0 z-10 bg-white'>
    <header className="text-gray-600 body-font">
  <div className="mx-auto flex flex-wrap p-3 flex-row items-center shadow-md">
    <Link to={(isAddReaderEndpoint && !localStorage.getItem("token")) ? '#' : '/'} className="flex title-font font-medium cursor-pointer text-gray-900 sm:mb-0">
      <img className='mx-4' src={logoImg} width={50} height={20} alt="logoimage"/>
    </Link>
    {(!isAddReaderEndpoint || localStorage.getItem("token")) && <nav className="hidden sm:visible sm:mr-auto sm:ml-4 sm:py-1 sm:pl-4 sm:border-l sm:border-gray-400	sm:flex flex-wrap items-center text-base justify-center">
      <Link to="/" className="mr-5 hover:text-gray-900 font-bold cursor-pointer">Library</Link>
      {localStorage.getItem("token") && <Link to="/addbook" className="mr-5 hover:text-gray-900 font-bold cursor-pointer">AddBook</Link>}
      <Link to="/addreader" className="mr-5 hover:text-gray-900 font-bold cursor-pointer">AddReader</Link>
      {localStorage.getItem("token") && <Link to="/dashboard" className="mr-5 hover:text-gray-900 font-bold cursor-pointer">Dashboard</Link>}
      <Link to="/about" className="mr-5 hover:text-gray-900 font-bold cursor-pointer">About</Link>
    </nav>}
    
    {/* For TCS */}
    {/* {(isOnlyTcsAddReaderEndpoint && !localStorage.getItem("token")) && <nav className="hidden sm:visible sm:mr-auto sm:ml-4 sm:py-1 sm:pl-4 sm:border-l sm:border-gray-400	sm:flex flex-wrap items-center text-base justify-center">
      <Link to="/abouttcs" className="mr-5 hover:text-gray-900 font-bold cursor-pointer">About</Link>
    </nav>} */}
    {/* {(isOnlyTcsAbout && !localStorage.getItem("token")) && <nav className="hidden sm:visible sm:mr-auto sm:ml-4 sm:py-1 sm:pl-4 sm:border-l sm:border-gray-400	sm:flex flex-wrap items-center text-base justify-center">
      <Link to="/addreader/tcssubscription" className="mr-5 hover:text-gray-900 font-bold cursor-pointer">AddReader</Link>
    </nav>} */}

    {(!isAddReaderEndpoint || localStorage.getItem("token")) && <div className="sm:relative right-0 sm:top-0 absolute top-5 mr-[10px]"> 
        {!localStorage.getItem("token") && <div onClick={()=>{navigate("/login-signup")}} className='inline-flex items-center py-1 px-1 text-3xl  hover:bg-[#e4b0a5] rounded mt-0'><AiOutlineLogin /></div>}
        {localStorage.getItem("token") && <div onClick={handleShowModal} className='inline-flex items-center py-1 px-1 text-3xl  hover:bg-[#e4b0a5] rounded mt-0'><LuUserCircle /></div>}
        {localStorage.getItem("token") && <div onClick={toggleSideBar} className="sm:hidden visible inline-flex items-center py-1 px-1 text-3xl focus:outline-none hover:bg-[#e4b0a5] rounded mt-0"><IoReorderThreeOutline />
    </div>}
    </div>}
  </div>
</header>
      
    <aside ref={ref} className="sm:hidden visible sideBar z-20 absolute overflow-y-scroll flex flex-col right-0 top-0 bg-white h-[100vh] w-[100%] transform transition-transform translate-x-full">
    <div onClick={toggleSideBar} className='absolute right-3 top-6 text-2xl text-[#d38473]'><IoIosCloseCircle /></div>
    <a href="/" className="logo mt-12 mx-auto">
        <img alt="logo" src={logoImg} height="41" />
    </a>
    <nav className='mt-8'>
        <ol className="layout-menu">
            <li>
                <button type="button" className="p-link flex m-auto p-5">
                    <div onClick={()=>{toggleSideBar();navigate("/")}} className="cursor-pointer menu-icon mr-2">
                        <i className="pi pi-book"></i>
                    </div>
                    <span onClick={()=>{toggleSideBar();navigate("/")}}>Library On Wheels</span>
                </button>
            </li>
            <li>
                <button type="button" className="p-link flex m-auto p-5">
                    <div onClick={()=>{toggleSideBar();navigate("/services")}} className="cursor-pointer menu-icon mr-2">
                        <i className="pi pi-server"></i>
                    </div>
                    <span onClick={()=>{toggleSideBar();navigate("/services")}}>Services</span>
                </button>
            </li>
            <li>
                <button type="button" className="p-link flex m-auto p-5">
                    <div onClick={()=>{toggleSideBar();navigate("/addbook")}} className="cursor-pointer menu-icon mr-2">
                        <i className="pi pi-plus-circle"></i>
                    </div>
                    <span onClick={()=>{toggleSideBar();navigate("/addbook")}}>Add Book</span>
                </button>
            </li>
            <li>
                <button type="button" className="p-link flex m-auto p-5">
                    <div onClick={()=>{toggleSideBar();navigate("/addbook")}} className="cursor-pointer menu-icon mr-2">
                        <i className="pi pi-plus-circle"></i>
                    </div>
                    <span onClick={()=>{toggleSideBar();navigate("/addreader")}}>Add Reader</span>
                </button>
            </li>
            <li>
                <button type="button" className="p-link flex m-auto p-5">
                    <div onClick={()=>{toggleSideBar();navigate("/profile")}} className="cursor-pointer menu-icon mr-2">
                        <i className="pi pi-user"></i>
                    </div>
                    <span onClick={()=>{toggleSideBar();navigate("/profile")}}>Profile</span>
                </button>
            </li>
            <li>
                <button type="button" className="p-link flex m-auto p-5">
                    <div onClick={()=>{toggleSideBar();navigate("/dashboard")}} className="cursor-pointer menu-icon mr-2">
                        <i className="pi pi-user"></i>
                    </div>
                    <span onClick={()=>{toggleSideBar();navigate("/dashboard")}}>Dashboard</span>
                </button>
            </li>
            <li>
                <button type="button" className="p-link flex m-auto p-5" onClick={()=>{window.open('https://www.libraryonwheels.club/')}} target="_blank">
                    <div className="menu-icon mr-2">
                        <i className="pi pi-external-link"></i>
                    </div>
                    <span>Visit our Website</span>
                </button>
            </li>
        </ol>
    </nav>
</aside>
      
      </nav>
      {showModal ? (
        <>
          {/* <div className="w-[50%] h-[30%] sm:w-[30%] md:w-[15%] absolute right-14 z-20 sm:right-8 top-14 bg-[#d09e94] rounded-lg"/> */}
          <div className="font-semibold absolute top-14 right-14 z-20 sm:right-8 rounded-md border-2 shadow-lg bg-white md:w-64 w-52 p-2">
          <div onClick={handleShowModal} className='text-2xl text-[#d38473] absolute right-1 top-1'><IoIosCloseCircle className='cursor-pointer'/></div>
      <div className="flex items-center justify-center text-5xl m-4">
      <LuUserCircle />
          </div>
          <div className='mt-2 text-center text-xl'>
              Hello, User
            </div>
          <hr className='m-3'></hr>
         <div onClick={handleShowModal} className='text-center p-2'><Link to="/myaccount" className='outline-none border-0 text-l'><span className='hover:bg-[#e4b0a5] p-2 rounded-md'>My Account</span></Link></div>
         <div onClick={logout} className='p-2 text-l outline-none border-0 text-center cursor-pointer'><span className='hover:bg-[#e4b0a5] p-2 rounded-md'>Logout</span></div>
          </div>
        </>
      ) : null}
    </>
  )
}

export default Navbar