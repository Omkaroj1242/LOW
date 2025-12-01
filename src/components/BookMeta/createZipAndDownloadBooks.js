import JSZip from "jszip";
import { saveAs } from "file-saver";
import qrGenBulk from "../Utils/qrGenBulk";

const createZipAndDownload = async (response,discardedEntries) => {
  const { books } = response;
  const zip = new JSZip();

  

  for (let book of books) {
    const { title, book_copies, isbn } = book;
    
    if (!book_copies?.length) {
      discardedEntries.push(`Book with title "${title}" has no copies.`);
      continue;
    }

    const folder = zip.folder(title);

    for (let id of book_copies) {
      const qrCodeBlob = await qrGenBulk(id.toString(),title,isbn);
      folder.file(`${id}.jpg`, qrCodeBlob);
    }
  }

  // Add discarded entries to the zip
  const discardedContent = discardedEntries.join("\n");
  zip.file("discarded_entries.txt", discardedContent);

  // Generate and download the zip
  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, "books_qr_codes.zip");
};

export default createZipAndDownload;
