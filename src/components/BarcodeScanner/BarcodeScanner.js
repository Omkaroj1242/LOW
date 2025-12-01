import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";

const BarcodeScanner = () => {
    const videoRef = useRef(null);
    const [result, setResult] = useState("");

    useEffect(() => {
        // restrict decoder to barcode formats only (no QR_CODE)
        const hints = new Map();
        const barcodeFormats = [
            BarcodeFormat.CODE_128,
            BarcodeFormat.CODE_39,
            BarcodeFormat.EAN_13,
            BarcodeFormat.EAN_8,
            BarcodeFormat.UPC_A,
            BarcodeFormat.UPC_E,
            BarcodeFormat.ITF,
            BarcodeFormat.CODABAR
        ];
        hints.set(DecodeHintType.POSSIBLE_FORMATS, barcodeFormats);
        const reader = new BrowserMultiFormatReader(hints);

        // start decoding from default device
        reader.decodeFromVideoDevice(null, videoRef.current, (res, err) => {
            if (res) {
                setResult(res.getText());
            }
            // NotFoundException is expected frequently while scanning; log other errors
            if (err && err.name !== "NotFoundException") {
                console.error("Barcode decode error:", err);
            }
        }).catch((e) => {
            console.error("Failed to start decodeFromVideoDevice:", e);
        });

        return () => {
            // stop camera and decoding 
            try {
                reader.reset();
            } catch (e) {
                console.error("Failed to reset reader:", e);
            }
        };
    }, []);

    return (
        <>
            <div>Barcode Scanner Component</div>
            <div style={{ textAlign: "center" }}>
                <h2>Scanner</h2>
                <video
                    ref={videoRef}
                    width="300"
                    height="300"
                    autoPlay
                    muted
                    playsInline
                />
                <h3>Result: {result}</h3>
            </div>

        </>
    )
}

export default BarcodeScanner