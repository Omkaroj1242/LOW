import React, { useRef, useState } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FiDownload, FiUpload, FiX } from 'react-icons/fi';
import { IoIosCloseCircle } from 'react-icons/io';
import ExcelToJson from '../Utils/ExcelToJson';
import createZipAndDownload from '../Utils/createZipAndDownlaod';


const ReaderBulkUploadModal = ({ closeModal }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();
  const [errorMessage, setErrorMessage] = useState('');
  

  const downloadSampleTemplate = () => {
    const sampleData = [
      ['Name', 'Mobile', 'Email'],
      ['xyz', 'xxxxxxxxxx', 'xyz@gmail.com'],
    ];
    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'sample_template.xlsx');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setSelectedFile(file);
      setErrorMessage('');
    } else {
      setErrorMessage('Please upload a valid Excel file.');
      setSelectedFile(null);
      fileInputRef.current.value = null;
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    fileInputRef.current.value = null;
  };

  const handleSubmit = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) {
        setErrorMessage('Please upload a file before submitting.');
        setTimeout(() => {
          setErrorMessage('');
        }, 2000);
        return;
    }
    // Handle the submit action here
    const data = await ExcelToJson(file);
    if (data.length > 50) {
      setErrorMessage('Limit Exceeded! Should not be more than 50');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    const validEntries = [];
    const discardedEntries = [];
    data.forEach((row, index) => {
      const hasEmptyField = Object.values(row).some(value => value === undefined || value === null || value === '');
      if (hasEmptyField) {
        discardedEntries.push(`Row ${index + 2}`); // +2 to account for header row
      } else {
        validEntries.push(row);
      }
    });
    // Create and download the zip file
    await createZipAndDownload(validEntries, discardedEntries, "reader");

    const jsonObj = {
      merchant_id: localStorage.getItem("merchantId"),
      library_id : localStorage.getItem("libraryId"),
      readers: data
    }
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="m-2 sm:m-0 bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md">
      <button className="absolute top-2 right-2 text-2xl text-[#d38473]" onClick={closeModal}>
        <IoIosCloseCircle />
        </button>
        <button
          className="absolute top-2 left-2 px-2 py-1  text-black rounded-lg  hover:text-gray-800 focus:outline-none transition ease-in-out duration-300 flex items-center"
          onClick={downloadSampleTemplate}
        >
          <FiDownload className="mr-2" />
          Template
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Bulk Upload</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Upload Excel File</label>
          <div className="mt-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md px-6 pt-5 pb-6">
            <div className="space-y-1 text-center">
              <FiUpload size={48} className="mx-auto text-gray-400" />
              <div className="flex flex-col items-center text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-[#d38473] hover:text-[#bd7667] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-200"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".xlsx"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </label>
              </div>
              {selectedFile && (
                <div className="flex items-center space-x-2 mt-2">
                  <p className="text-xs text-gray-500">Selected file: {selectedFile.name}</p>
                  <button
                    className="text-[#d38473] hover:text-[#bd7667] focus:outline-none"
                    onClick={handleRemoveFile}
                  >
                    <FiX size={16} />
                  </button>
                </div>
              )}
              {errorMessage && (
                <p className="text-xs text-red-500 mt-2">{errorMessage}</p>
              )}
              <p className="text-xs text-gray-500">XLSX up to 10MB</p>
            </div>
          </div>
        </div>
        <button
          className="w-full px-4 py-2 bg-[#d38473] text-white rounded-lg shadow hover:bg-[#bd7667] focus:outline-none transition ease-in-out duration-300"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ReaderBulkUploadModal;
