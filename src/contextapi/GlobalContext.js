import { createContext, useState } from "react";

const contextCreated = createContext();

const GlobalContext = (props) => {
  const [bookData, setBookData] = useState(null);
  const [readerData, setReaderData] = useState(null);
  const [ledgerData, setLedgerData] = useState(null);
  const [payload, setPayload] = useState(null);



  const fetchReaderLedgerEntry = async (readerId) => {
    try {
      const body = JSON.stringify({
        merchant_id: localStorage.getItem("merchantId"),
        library_id: localStorage.getItem("libraryId"),
        reader_id: readerId
      });

      const response = await fetch(
        "https://coffee-beans.addlib.club/ledger/reader/get",
        {
          method: "POST",
          body: body,
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.return_code === 0) {
        return "Maximum Limit Reached";
      } else if (data.return_code === 1)
        return "No entry found";
    } catch (err) {
      return "No entry found";
    }
  };
  const fetchLedgerEntry = async (bookId) => {
    try {
      const body = JSON.stringify({
        merchant_id: localStorage.getItem("merchantId"),
        library_id: localStorage.getItem("libraryId"),
        book_copy_id: bookId
      });

      const response = await fetch(
        "https://coffee-beans.addlib.club/ledger/book-copy/get",
        {
          method: "POST",
          body: body,
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      setLedgerData(data)
      return true;
    } catch (err) {
      return false;
    }
  };
  const fetchBook = async (bookId) => {
    try {
      const body = JSON.stringify({
        merchant_id: localStorage.getItem("merchantId"),
        library_id: localStorage.getItem("libraryId"),
        book_copy_id: bookId
      });
      const response = await fetch(
        "https://coffee-beans.addlib.club/books/copies/get",
        {
          method: "POST",
          body: body,
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      const bookData = await fetchBookByIsbn(data.isbn);
      if (bookData === null) {
        return false;
      }
      setBookData({
        ...bookData,
        bookId: bookId
      });
      return true;
    } catch (err) {
      return false;
    }

  };
  const addBook = async (bookname, isbn, genre, subgenre, author, publisher) => {
    try {
      const body = JSON.stringify({
        merchant_id: localStorage.getItem("merchantId"),
        library_id: localStorage.getItem("libraryId"),
        isbn: isbn
      });
      const response = await fetch(
        "https://coffee-beans.addlib.club/books/get",
        {
          method: "POST",
          body: body,
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json"
          },
        }
      );
      if (!response.ok) {
        try {
          const body = JSON.stringify({
            merchant_id: localStorage.getItem("merchantId"),
            library_id: localStorage.getItem("libraryId"),
            isbn: isbn,
            title: bookname,
            author: author,
            genre: genre,
            subgenre: subgenre,
            publishers: publisher
          });
          const response = await fetch(
            "https://coffee-beans.addlib.club/books",
            {
              method: "POST",
              body: body,
              headers: {
                Authorization: localStorage.getItem("token"),
                "Content-Type": "application/json"
              },
            }
          );
          if (!response.ok) {
            return null;
          }
          const bookCopyData = await addBookCopy(isbn);
          return bookCopyData;
        } catch (err) {
          return null;
        }
      } else {
        const bookCopyData = await addBookCopy(isbn);
        return bookCopyData;
      }
    } catch (err) {
      return null;
    }
  };
  const addBookCopy = async (isbn) => {
    try {
      const body = JSON.stringify({
        merchant_id: localStorage.getItem("merchantId"),
        library_id: localStorage.getItem("libraryId"),
        isbn: isbn,
        status: "A"
      });
      const response = await fetch(
        "https://coffee-beans.addlib.club/books/copies",
        {
          method: "POST",
          body: body,
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json"
          },
        }
      );
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return data;
    } catch (err) {
      return null;
    }
  };
  const addBulkBook = async (bulkObj) => {
    try {
      const body = JSON.stringify({
        merchant_id: localStorage.getItem("merchantId"),
        library_id: localStorage.getItem("libraryId"),
        books: bulkObj
      });
      const response = await fetch(
        "https://coffee-beans.addlib.club/books/bulk",
        {
          method: "POST",
          body: body,
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json"
          },
        }
      );
      const resData = await response.json();
      return resData;
    } catch (err) {
      return false;
    }
  };
  const addLedgerEntry = async (bookId, readerId) => {
    try {
      const body = JSON.stringify({
        merchant_id: localStorage.getItem("merchantId"),
        library_id: localStorage.getItem("libraryId"),
        "book_copy_id": bookId,
        "reader_id": readerId,
      });
      const response = await fetch(
        "https://coffee-beans.addlib.club/ledger",
        {
          method: "POST",
          body: body,
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      return true;
    } catch (err) {
      return false;
    }

  };
  const addReader = async (library_id, fullname, mobile, email) => {
    try {
      if(localStorage.getItem("token")){
      const body = JSON.stringify({
        merchant_id: localStorage.getItem("merchantId"),
        library_id: localStorage.getItem("libraryId"),
        contact: mobile,
        email: email,
        name: fullname
      });
      const response = await fetch(
        "https://coffee-beans.addlib.club/readers/noauth",
        {
          method: "POST",
          body: body,
          headers: {
            "Content-Type": "application/json"
          },
        }
      );
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return data;
    }else{
      const body = JSON.stringify({
        merchant_id: 1,
        library_id: library_id || 1,
        contact: mobile,
        email: email,
        name: fullname
      });
      const response = await fetch(
        "https://coffee-beans.addlib.club/readers/noauth",
        {
          method: "POST",
          body: body,
          headers: {
            "Content-Type": "application/json"
          },
        }
      );
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return data;
    }
    } catch (err) {
      return null;
    }

  };
  const fetchReaderOnPhoneAndEmail = async (phone,email) => {
    try {
      if(localStorage.getItem("token")){
        const response = await fetch(
        "https://coffee-beans.addlib.club/readers/search",
        {
          method: "POST",
          body: JSON.stringify({
            merchant_id: localStorage.getItem("merchantId"),
            library_id: localStorage.getItem("libraryId"),
            contact: phone,
            email: email
          }),
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json"
          },
        }
      );
      if (response.ok) {
        return true;
      }
      return false;
    }else{
      const response = await fetch(
        "https://coffee-beans.addlib.club/readers/search/noauth",
        {
          method: "POST",
          body: JSON.stringify({
            merchant_id: 1,
            library_id: 1,
            contact: phone,
            email: email
          }),
          headers: {
            "Content-Type": "application/json"
          },
        }
      );
      if (response.ok) {
        return true;
      }
      return false;
    }
    } catch (err) {
      return false;
    }   
  };
  const fetchReaderOnPhone = async (phone) => {
    try {
      if(localStorage.getItem("token")){
        const response = await fetch(
        "https://coffee-beans.addlib.club/readers/search",
        {
          method: "POST",
          body: JSON.stringify({
            merchant_id: localStorage.getItem("merchantId"),
            library_id: localStorage.getItem("libraryId"),
            contact: phone
          }),
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json"
          },
        }
      );
      const json = await response.json()
      if (response.ok) {
        return await json.readers[0].reader_id;
      }
      return "Reader not found";
    }else{
      const response = await fetch(
        "https://coffee-beans.addlib.club/readers/search/noauth",
        {
          method: "POST",
          body: JSON.stringify({
            merchant_id: 1,
            library_id: 1,
            contact: phone
          }),
          headers: {
            "Content-Type": "application/json"
          },
        }
      );
      const json = await response.json()
      if (response.ok) {
        return await json.readers[0].reader_id;
      }
      return "Reader not found";
    }
    } catch (err) {
      return "Reader not found";
    }   
  };
  const fetchReader = async (readerId) => {
    try {
      const response = await fetch(
        "https://coffee-beans.addlib.club/readers/get",
        {
          method: "POST",
          body: JSON.stringify({
            merchant_id: localStorage.getItem("merchantId"),
            library_id: localStorage.getItem("libraryId"),
            reader_id: readerId
          }),
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json"
          },
        }
      );
      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      setReaderData(data)
      return true;
    } catch (err) {
      return false;
    }

  };
  const removeLedgerEntry = async (ledgerId) => {
    try {
      const body = JSON.stringify({
        merchant_id: localStorage.getItem("merchantId"),
        library_id: localStorage.getItem("libraryId"),
        ledger_id: ledgerId,
      });
      const response = await fetch(
        "https://coffee-beans.addlib.club/ledger/return",
        {
          method: "POST",
          body: body,
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      if (data.message === "Book returned successfully") return true;
    } catch (err) {
      return false;
    }

  };
  const fetchBookByIsbn = async (bookIsbn) => {
    try {
      const body = JSON.stringify({
        merchant_id: localStorage.getItem("merchantId"),
        library_id: localStorage.getItem("libraryId"),
        isbn: bookIsbn,
      });
      const response = await fetch(
        "https://coffee-beans.addlib.club/books/get",
        {
          method: "POST",
          body: body,
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return data;
    } catch (err) {
      return null;
    }

  };
  const createOrder = async (libraryId, orderData) => {
    try {
      const body = JSON.stringify({
        merchant_id: 1,
        library_id: libraryId || 1,
        order_data: orderData
      });
      const response = await fetch(
        "https://coffee-beans.addlib.club/payment/createOrder",
        {
          method: "POST",
          body: body,
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxOTE0ODk3NSwianRpIjoiNzkwYmUyZTAtN2EwZi00OTFlLWFmYzUtYmEzYmUyODExZmNlIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6Imhhc2gxIiwibmJmIjoxNzE5MTQ4OTc1fQ.vjlkIJgXeOC9cM0XBD8hNJno0OZImN1-x8Q_LgJqj4Q",
            "Content-Type": "application/json"
          },
        }
      );
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return data.order_response.id;
    } catch (err) {
      return null;
    }

  };


  return (
    <contextCreated.Provider
      value={{
        addBook,
        bookData,
        setBookData,
        readerData,
        ledgerData,
        setReaderData,
        fetchLedgerEntry,
        fetchBook,
        fetchReader,
        addLedgerEntry,
        removeLedgerEntry,
        setLedgerData,
        payload,
        setPayload,
        addReader,
        addBulkBook,
        createOrder,
        fetchReaderLedgerEntry,
        fetchReaderOnPhoneAndEmail,
        fetchReaderOnPhone
      }}
    >
      {props.children}
    </contextCreated.Provider>
  );
};

export default GlobalContext;
export const globalContext = contextCreated;
