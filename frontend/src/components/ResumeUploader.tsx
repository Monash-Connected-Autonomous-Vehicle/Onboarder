import axios from "axios";
import { ChangeEvent, useState } from "react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function ResumeUploader({
  opening,
  applicantMobileNumber,
}: {
  opening: string;
  applicantMobileNumber: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  async function handleFileUpload() {
    if (!file) return;

    setStatus("uploading");

    const formData = new FormData();
    // prep backend data block
    formData.append("file", file);
    formData.append("opening_id", opening);
    formData.append("applicant_mobile", applicantMobileNumber);

    try {
      await axios.post("http://127.0.0.1:5000/upload-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }); // send the file to the flask server, change the url to your local flask url as-> "{your url}/upload-resume"

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />

      {file && (
        <div className="space-y-2">
          <p> File Name: {file.name}</p>
          <p> File Size: {(file.size / 1024).toFixed(2)} KB</p>
          <p> File Type: {file.type}</p>
        </div>
      )}

      {file && status !== "uploading" && (
        <button onClick={handleFileUpload}> Upload</button>
      )}

      {status === "success" && <p>File Uploaded Successfully</p>}

      {status === "error" && <p>Error, Please try again</p>}
    </div>
  );
}
