import React, { useContext, useEffect, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { globalContext } from '../../contextapi/GlobalContext'
import CryptoJS from 'crypto-js'
import { DotLoader } from 'react-spinners'

const Exchange = () => {
  const globalCon = useContext(globalContext)
  const qrVideoRef = useRef(null)
  const barcodeVideoRef = useRef(null)
  const qrScannerRef = useRef(null)
  const barcodeReaderRef = useRef(null)
  const [stage, setStage] = useState('scanUser') // scanUser -> scanIssue -> scanAdd -> done
  const [loading, setLoading] = useState(false)
  const [readerId, setReaderId] = useState(null)
  const [readerInfo, setReaderInfo] = useState(null)
  const secretKey = 'your-secret-key-book'

  // Helper: stop any active scanners
  const stopAll = async () => {
    try {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop()
        qrScannerRef.current.destroy()
        qrScannerRef.current = null
      }
    } catch (e) {
    }
    try {
      if (barcodeReaderRef.current) {
        barcodeReaderRef.current.reset()
        barcodeReaderRef.current = null
      }
    } catch (e) {
    }
  }

  // QR: scan user
  useEffect(() => {
    if (stage !== 'scanUser') return
    let initTimeout = null
    const startQr = async () => {
      if (!qrVideoRef.current) return
      qrScannerRef.current = new QrScanner(qrVideoRef.current, async (result) => {
        if (!result) return
        // try AES decrypt then fallback to raw text
        let payload = ''
        try {
          const bytes = CryptoJS.AES.decrypt(result.data, secretKey)
          const decrypted = bytes.toString(CryptoJS.enc.Utf8)
          payload = decrypted || result.data
        } catch (err) {
          payload = result.data
        }
        // Stop QR scanner while processing
        try {
          await qrScannerRef.current.stop()
        } catch (e) {}
        setLoading(true)
        const ok = await globalCon.fetchReader(payload)
        setLoading(false)
        if (ok) {
          setReaderId(payload)
          setReaderInfo(globalCon.readerData)
          toast.success('Reader found', { autoClose: 1000 })
          setStage('scanIssue')
        } else {
          toast.error('Reader not found', { autoClose: 1200 })
          // restart after brief delay
          setTimeout(async () => {
            try { await qrScannerRef.current.start() } catch (e) {}
          }, 1200)
        }
      }, {
        highlightScanRegion: true,
        highlightCodeOutline: true
      })

      try {
        await qrScannerRef.current.start()
      } catch (err) {
        toast.error('Unable to access camera for QR scan')
      }
    }
    initTimeout = setTimeout(startQr, 400)

    return () => {
      clearTimeout(initTimeout)
      if (qrScannerRef.current) {
        qrScannerRef.current.stop()
        qrScannerRef.current.destroy()
        qrScannerRef.current = null
      }
    }
  }, [stage])

  // Barcode: generic function to start zxing reader with callback
  const startBarcodeReader = (onResult) => {
    if (!barcodeVideoRef.current) return
    const hints = new Map()
    const reader = new BrowserMultiFormatReader(hints)
    barcodeReaderRef.current = reader
    reader.decodeFromVideoDevice(null, barcodeVideoRef.current, (res, err) => {
      if (res) {
        onResult(res.getText())
      }
      if (err && err.name !== 'NotFoundException') {
        console.error('Barcode decode error:', err)
      }
    }).catch((e) => {
      console.error('Failed to start barcode reader:', e)
      toast.error('Unable to access camera for barcode scanning')
    })
  }

  // Issue book stage
  useEffect(() => {
    if (stage !== 'scanIssue') return
    setLoading(false)
    const onBarcode = async (text) => {
      // Assume scanned text is book copy id
      if (!text) return
      try {
        barcodeReaderRef.current.reset()
      } catch (e) {}
      setLoading(true)
      const added = await globalCon.addLedgerEntry(text, readerId)
      setLoading(false)
      if (added) {
        toast.success('Book issued to reader', { autoClose: 1200 })
        setStage('scanAdd')
      } else {
        toast.error('Failed to issue book', { autoClose: 1200 })
        // restart scanning
        setTimeout(() => {
          try { startBarcodeReader(onBarcode) } catch (e) {}
        }, 1200)
      }
    }

    startBarcodeReader(onBarcode)

    return () => {
      try { barcodeReaderRef.current?.reset() } catch (e) {}
      barcodeReaderRef.current = null
    }
  }, [stage, readerId])

  // Add book stage (scan ISBN and add book/copy)
  useEffect(() => {
    if (stage !== 'scanAdd') return
    const onBarcode = async (text) => {
      if (!text) return
      try { barcodeReaderRef.current.reset() } catch (e) {}
      setLoading(true)
      // call addBook with isbn in second argument
      const res = await globalCon.addBook('', text, '', '', '', '')
      setLoading(false)
      if (res) {
        toast.success('Book added to library', { autoClose: 1200 })
        setStage('done')
      } else {
        toast.error('Failed to add book', { autoClose: 1200 })
        setTimeout(() => { try { startBarcodeReader(onBarcode) } catch (e) {} }, 1200)
      }
    }

    startBarcodeReader(onBarcode)

    return () => {
      try { barcodeReaderRef.current?.reset() } catch (e) {}
      barcodeReaderRef.current = null
    }
  }, [stage])

  // cleanup on unmount
  useEffect(() => {
    return () => { stopAll() }
  }, [])

  return (
    <div className="p-4">
      <ToastContainer position="top-center" />
      {loading && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"><DotLoader color="#d38473" /></div>}

      {stage === 'scanUser' && (
        <div>
          <h2 className="text-xl font-bold mb-2">Step 1 — Scan Reader QR</h2>
          <p className="mb-4">Hold the reader's QR code in front of the camera.</p>
          <video ref={qrVideoRef} style={{ width: '100%', maxWidth: 640, borderRadius: 8 }} />
        </div>
      )}

      {stage === 'scanIssue' && (
        <div>
          <h2 className="text-xl font-bold mb-2">Step 2 — Scan Book to Issue</h2>
          {readerInfo && <div className="mb-2">Reader: {readerInfo.name || JSON.stringify(readerInfo)}</div>}
          <p className="mb-4">Scan the book copy barcode to issue to this reader.</p>
          <video ref={barcodeVideoRef} style={{ width: '100%', maxWidth: 640, borderRadius: 8 }} />
        </div>
      )}

      {stage === 'scanAdd' && (
        <div>
          <h2 className="text-xl font-bold mb-2">Step 3 — Scan Book to Add</h2>
          <p className="mb-4">Scan the book ISBN barcode to add to library.</p>
          <video ref={barcodeVideoRef} style={{ width: '100%', maxWidth: 640, borderRadius: 8 }} />
        </div>
      )}

      {stage === 'done' && (
        <div>
          <h2 className="text-xl font-bold mb-2">Exchange Completed</h2>
          <p className="mb-4">The book was issued and a new book copy was added.</p>
          <button className="px-4 py-2 bg-[#d38473] text-white rounded" onClick={() => { setStage('scanUser'); setReaderInfo(null); setReaderId(null); }}>
            Start Another
          </button>
        </div>
      )}
    </div>
  )
}

export default Exchange