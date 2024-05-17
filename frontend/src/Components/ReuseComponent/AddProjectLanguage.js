import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

function AddProjectLanguage() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [inputName, setInputName] = useState("");
  const [inputPath, setInputPath] = useState("");
  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();
  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  });

  useEffect(() => {
    // Fetch PDF file data from the server
    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/project/languages`)
      .then((response) => response.json())
      .then((data) => {
        setPdfFiles(data);
      })
      .catch((error) => {
        console.error("Failed to fetch PDF files:", error);
      });
  }, [notifyB]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };
  const uploadFile = () => {
    if (!selectedFile || !inputName) {
      notifyA("Please fill all the fields.");
      return;
    }
    const fileRef = ref(storage, `image/${selectedFile.name + uuidv4()}`);
    uploadBytes(fileRef, selectedFile).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        // Send the download URL to your server for storage in MongoDB
        handleUpload(url);
      });
    });
  };
  const handleUpload = (url) => {
    if (!selectedFile || !inputName) {
      notifyA("Please fill all the fields.");
      return;
    }
    const requestBody = {
      ProjectImage: url,
      ProjectName: inputName,
    };
    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/project/languages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          notifyB(data.message);
          setSelectedFile(null);
          setPreviewUrl(null);
          setInputName("");
        } else {
          notifyA(data.error);
        }
      })
      .catch((error) => {
        console.error("Failed to upload question paper:", error);
      });
  };
  const handelDelete = (id) => {
    // Send a DELETE request to the server to delete the question paper
    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/project/language/delete/by/admin/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          notifyB(data.message);
          // Remove the deleted paper from the pdfFiles state
          setPdfFiles((prevFiles) =>
            prevFiles.filter((file) => file._id !== id)
          );
        } else {
          notifyA(data.error);
        }
      })
      .catch((error) => {
        console.error("Failed to delete question paper:", error);
      });
  };
  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="contact" class="contact section-bg">
        <div class="container">
          <div class="section-title">
            <h2>Add Project Language</h2>
            <p>Format should be in IMG/PNG!</p>
          </div>

          <div class="row mt-5 justify-content-center">
            <div class="col-lg-10">
              <form role="form" class="php-email-form">
                <div class="row">
                  <div class="col-md-6 form-group">
                    <input
                      value={inputName}
                      type="text"
                      class="form-control"
                      placeholder="Language"
                      required
                      onChange={(e) => {
                        setInputName(e.target.value);
                      }}
                    />
                  </div>
                  <div class="col-md-6 form-group ">
                    <input
                      type="file"
                      class="form-control"
                      name="pdf"
                      id="pdf"
                      placeholder="Paper in pdf"
                      required
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                {previewUrl && (
                  <div>
                    <h4>Selected File Preview:</h4>
                    <embed
                      src={previewUrl}
                      type="application/pdf"
                      width="100%"
                      height="600px"
                    />
                  </div>
                )}
                <div class="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      uploadFile();
                    }}
                  >
                    Upload file
                  </button>
                </div>
              </form>
            </div>
            <hr />
            <div class="sales-boxes">
              <div class="recent-sales box">
                <div class="title">List of project language</div>
                <div class="sales-details">
                  <ul class="details" style={{ marginRight: "20px" }}>
                    <li class="topic">Language</li>
                    {pdfFiles.length !== 0
                      ? pdfFiles.map((Projects) => {
                          return (
                            <>
                              <hr />
                              <li key={Projects._id}>
                                {" "}
                                <a
                                  style={{
                                    height: "30px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {" "}
                                  {Projects.ProjectName}
                                </a>
                              </li>
                            </>
                          );
                        })
                      : ""}
                  </ul>
                  <ul class="details" style={{ marginRight: "20px" }}>
                    <li class="topic">Action</li>
                    {pdfFiles.length !== 0
                      ? pdfFiles.map((Projects) => {
                          return (
                            <>
                              <hr />
                              <Link key={Projects._id}>
                                <a
                                  onClick={() => {
                                    handelDelete(Projects._id);
                                  }}
                                  style={{
                                    height: "30px",
                                    whiteSpace: "nowrap",
                                    color: "red",
                                  }}
                                >
                                  Delete
                                </a>
                              </Link>
                            </>
                          );
                        })
                      : ""}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AddProjectLanguage;
