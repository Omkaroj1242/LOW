import React from 'react'
import {
  // BrowserRouter as Router,
  Routes,
  HashRouter as Router,
  Route
} from "react-router-dom";
import About from './components/About/About';
import Home from './components/Home';
import AddBook from './components/BookMeta/AddBook';
import Services from './components/Services';
import Login from './components/Login_Signup/Login';
import Signup from './components/Login_Signup/Signup';
import Navbar from './components/Layout/Navbar';
import Isuue from './components/IssueFlow/Isuue';
import Return from './components/ReturnFlow/Return';
import GlobalContext from './contextapi/GlobalContext';
import Profile from './components/UserMeta/Profile';
import Issued from './components/IssueFlow/Issued';
import AddReader from './components/ReaderMeta/AddReader';
import MyAccount from './components/UserMeta/MyAccount';
import Genqr from './components/ReaderMeta/ReaderGenqr';
import Dashboard from './components/Dashboard';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import AddReaderTCS from './components/ReaderMeta/AddReaderTCS';
import AboutTCS from './components/About/AboutTCS';
import NotFoundPage from './components/NotFoundPage';
import BarcodeReaderBetaV from './components/BarcodeReaderBeta/BarcodeReaderBetaV';

const App = () => {
  return (
    <GlobalContext>
    <Router>
    <Navbar/>
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
    <Routes>
     <Route path="/" element={<Home/>}/>
     <Route path="/about" element={<About/>}/>
     <Route path="/issue" element={<Isuue/>}/>
     <Route path="/issued" element={<Issued/>}/>
     <Route path="/return" element={<Return/>}/>
     <Route path="/addbook" element={<AddBook/>}/>
     <Route path="/addreader" element={<AddReader/>}/>
     <Route path="/services" element={<Services/>}/>
     <Route path="/login-signup" element={<Login/>}/>
     <Route path="/signup" element={<Signup/>}/>
     <Route path="/profile" element={<Profile/>}/>
     <Route path="/myaccount" element={<MyAccount/>}/>
     <Route path="/genqr" element={<Genqr/>}/>
     <Route path="/dashboard" element={<Dashboard/>}/>
     <Route path="/barcodebeta" element={<BarcodeReaderBetaV />} />
     <Route path="*" element={<NotFoundPage />} />
     {/* For TCS */}
     {/* <Route path="/abouttcs" element={<AboutTCS/>}/> */}
     {/* <Route path="/addreader/tcssubscription" element={<AddReaderTCS/>}/> */}
    </Routes>
    </Router>
    </GlobalContext>
  )
}

export default App

