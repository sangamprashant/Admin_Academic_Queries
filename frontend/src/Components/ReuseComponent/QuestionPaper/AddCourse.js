import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { storage } from "../../../firebase";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { Table } from "antd";
import { LoginContext } from "../../../context/LoginContext";
import { SERVER } from "../../../context/config";

function UploadPaper() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [inputName, setInputName] = useState("");
  const [inputPath, setInputPath] = useState("");
  const { token, handleModel } = React.useContext(LoginContext);
  const navigate = useNavigate();

  React.useLayoutEffect(() => {
    if (token) fetchCourses();
    else navigate("/");
  }, []);

  let tableColumns = [
    {
      title: "Image",
      dataIndex: "courseImage",
      key: "courseImage",
      render: (image) => {
        return (
          <img
            src={image}
            alt=""
            height={100}
            width={100}
            className="object-fit-cover"
            loading="lazy"
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "courseName",
      key: "courseName",
    },
    {
      title: "Path",
      dataIndex: "coursePath",
      key: "coursePath",
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (_id) => (
        <div>
          <button
            className="btn btn-danger"
            onClick={() => {
              handelDelete(_id);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="contact" class="contact section-bg">
        <div class="container">
          <div class="section-title">
            <h2>Add New Course</h2>
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
                      placeholder="Course Name"
                      required
                      onChange={(e) => {
                        setInputName(e.target.value);
                      }}
                    />
                  </div>
                  <div class="col-md-6 form-group mt-3 mt-md-0">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Paper Path"
                      required
                      value={inputPath}
                      onChange={(e) => {
                        setInputPath(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <sub className="text-danger">Format should be in IMG/PNG!</sub>
                <div className="form-group">
                  <input
                    type="file"
                    className="form-control"
                    required
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
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
                <div class="title">List of course</div>
                <Table dataSource={pdfFiles} columns={tableColumns} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  function fetchCourses() {
    // Fetch PDF file data from the server
    fetch(`${SERVER}/api/get/course`)
      .then((response) => response.json())
      .then((data) => {
        console.log({ data });
        setPdfFiles(data);
      })
      .catch((error) => {
        console.error("Failed to fetch PDF files:", error);
      });
  }

  function handelDelete(id) {
    // Send a DELETE request to the server to delete the question paper
    fetch(`${SERVER}/api/course/delete/by/admin/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          handleModel(
            <p className="p-0 m-0 text-success">
              {data.message || "Course deleted."}
            </p>
          );
          // Remove the deleted paper from the pdfFiles state
          setPdfFiles((prevFiles) =>
            prevFiles.filter((file) => file._id !== id)
          );
        } else {
          handleModel(
            <p className="p-0 m-0 text-danger">
              {data.error || "Failed to delete."}
            </p>
          );
        }
      })
      .catch((error) => {
        console.error("Failed to delete question paper:", error);
        handleModel(<p className="p-0 m-0 text-danger">Failed to delete</p>);
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
    if (!selectedFile || !inputName || !inputPath) {
      return handleModel(
        <p className="p-0 m-0 text-danger">Please fill all the fields.</p>
      );
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
    if (!selectedFile || !inputName || !inputPath) {
      return handleModel(
        <p className="p-0 m-0 text-danger">Please fill all the fields.</p>
      );
    }
    const requestBody = {
      courseImage: url,
      coursePath: inputPath,
      courseName: inputName,
    };
    fetch(`${SERVER}/api/add/course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          handleModel(<p className="p-0 m-0 text-success">{data.message}</p>);
          setSelectedFile(null);
          setPreviewUrl(null);
          setInputName("");
          setInputPath("");
        } else {
          handleModel(<p className="p-0 m-0 text-danger">{data.error}</p>);
        }
      })
      .catch((error) => {
        console.error("Failed to upload question paper:", error);
        handleModel(
          <p className="p-0 m-0 text-danger">Failed to add course</p>
        );
      });
  }
}

export default UploadPaper;
