//Temporary 


// import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import qrGenBulk from "./qrGenBulk";

// const createZipAndDownload = async (validEntries, discardedEntries, route) => {
//   const zip = new JSZip();

//   // Add QR codes to the zip
//   const qrFolder = zip.folder("QR Codes");
//   if(route==="book"){
//     for (let entry of validEntries) {
//         const qrCodeBlob = await qrGenBulk(entry.ISBN);
//         qrFolder.file(`${entry.ISBN}.png`, qrCodeBlob);
//       }
//   }else{
//     for (let entry of validEntries) {
//         const qrCodeBlob = await qrGenBulk(entry.Mobile);
//         qrFolder.file(`${entry.Mobile}.png`, qrCodeBlob);
//       }
//   }
  

//   // Add discarded entries to the zip
//   const discardedContent = discardedEntries.join("\n");
//   zip.file("discarded_entries.txt", discardedContent);

//   // Generate and download the zip
//   const zipBlob = await zip.generateAsync({ type: "blob" });
//   saveAs(zipBlob, "entries.zip");
// };

// export default createZipAndDownload;