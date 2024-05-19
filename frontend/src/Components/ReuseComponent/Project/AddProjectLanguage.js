import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { SERVER } from "../../../context/config";
import { storage } from "../../../firebase";

function AddProjectLanguage() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [inputName, setInputName] = useState("");
  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();
  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    if (!token) navigate("/");
    else fetchData();
  },[]);

  const tableColumns = [
    {
      title: "Image",
      dataIndex: "ProjectImage",
      key: "ProjectImage",
      render: (link) => {
        return <img src={link} alt="project photo" height={100} width={100} />;
      },
    },
    {
      title: "Name",
      dataIndex: "ProjectName",
      key: "ProjectName",
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (_id) => {
        return (
          <div
            className="btn btn-danger"
            onClick={() => {
              handelDelete(_id);
            }}
          >
            Delete
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="contact" class="contact section-bg">
        <div class="container">
          <div class="section-title">
            <h2>Add Project Language</h2>
          </div>

          <div class="row justify-content-center">
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
                      accept=".jpg,.jpeg,.png"
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
            <div class="sales-boxes">
              <div class="recent-sales box">
                <div class="title">List of Project Language</div>
                <Table dataSource={pdfFiles} columns={tableColumns} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  function fetchData() {
    // Fetch PDF file data from the server
    fetch(`${SERVER}/api/project/languages`)
      .then((response) => response.json())
      .then((data) => {
        setPdfFiles(data);
      })
      .catch((error) => {
        console.error("Failed to fetch PDF files:", error);
      });
  }

  function handleFileChange(event) {
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
  }
  function uploadFile() {
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
  }
  function handleUpload(url) {
    if (!selectedFile || !inputName) {
      notifyA("Please fill all the fields.");
      return;
    }
    const requestBody = {
      ProjectImage: url,
      ProjectName: inputName,
    };
    fetch(`${SERVER}/api/project/languages`, {
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
  }
  function handelDelete(id) {
    const yes = window.confirm("Are you sure want to delete");
    if (yes) {
      fetch(`${SERVER}/api/project/language/delete/by/admin/${id}`, {
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
          // console.error("Failed to delete question paper:", error);
        });
    }
  }
}

export default AddProjectLanguage;
