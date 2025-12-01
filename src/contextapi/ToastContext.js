// GlobalContext.js
import React, { createContext, useState } from 'react';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toastMessage, setToastMessage] = useState(null);

  return (
    <ToastContext.Provider value={{ toastMessage, setToastMessage }}>
      {children}
    </ToastContext.Provider>
  );
};
