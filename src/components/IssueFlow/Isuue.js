import React, { useState,useContext, useEffect } from 'react'
import StudentQrscanner from '../QRScanner/StudentQrscanner'
import { globalContext } from '../../contextapi/GlobalContext'

const Isuue = () => {
    const globalCon = useContext(globalContext);
    const [qr, setQr]= useState(true);

   return (
    <>
   <div>
        {!globalCon.bookData && <div className='flex justify-center m-4'>
        <div className="w-[80%] items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
<div className="flex flex-col justify-between pt-0 p-4 leading-normal">
    {/* {globalCon.readerData && <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">Reader Details</h5>}
   {globalCon.readerData && <div className='flex justify-center rounded-md'> <table className='border-2 border-black w-min'>
   <thead>
   <tr className='border-2 border-black'>
   <th className='border-2 p-2 border-black text-center'>ReaderName</th>
   <th className='border-2 p-2 border-black text-center'>ReaderID</th>
   </tr>
   </thead>
   <tbody>
   <tr className='border-2 border-black'>
   <td className='border-2 p-2 border-black text-center'>{globalCon.readerData.name}</td>
   <td className='border-2 p-2 border-black text-center'>{globalCon.readerData.reader_id}</td>
   </tr>
   </tbody>
  </table></div>} */}
    <h5 className="mb-2 mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">Book Details</h5>
     <div className='text-center'>No Data</div>
    </div>
{/* {globalCon.readerData && <div className='flex justify-center mb-10'>
  <button className='p-[5px] m-4 mb-[2px] rounded-xl border-none text-white bg-[#d38473]'>AddBook</button>
  <button onClick={issueBook} className='p-[5px] m-4 mb-[2px] rounded-xl border-none text-white bg-[#d38473]'>Issue</button>
</div>} */}
</div>
</div>}
{(qr && !globalCon.readerData && globalCon.bookData) && <StudentQrscanner/>}


    </div>
    </>
  )
}

export default Isuue
