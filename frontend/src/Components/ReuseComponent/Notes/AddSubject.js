import React, { useEffect, useState } from "react";

import { Image, Table } from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { LoginContext } from "../../../context/LoginContext";
import { SERVER } from "../../../context/config";
import { storage } from "../../../firebase";

function AddSubject() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [inputName, setInputName] = useState("");
  const [inputPath, setInputPath] = useState("");
  const { token, handleModel } = React.useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/");
    else fetchData();
  }, []);

  const subjectList = [
    {
      title: "Image",
      dataIndex: "subjectImage",
      key: "subjectImage",
      render: (link) => {
        return (
          <Image src={link} height={100} width={100} alt="" loading="lazy" />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "subjectName",
      key: "subjectName",
    },
    {
      title: "Path",
      dataIndex: "subjectPath",
      key: "subjectPath",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "data._id",
      render: (data) => {
        return (
          <div className="d-flex gap-2">
            <Link
              className="btn btn-primary"
              to={`/admin/view/notes/${data.subjectPath}`}
            >
              View
            </Link>
            <button
              className="btn btn-danger"
              onClick={() => {
                handelDelete(data._id);
              }}
            >
              Delete
            </button>
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
            <h2>Add Subject</h2>
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
                      placeholder="Subject Name"
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
                      placeholder="subject Path"
                      required
                      value={inputPath}
                      onChange={(e) => {
                        setInputPath(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <sub className="text-danger">Format should be in IMG/PNG!</sub>
                <div class="form-group ">
                  <input
                    type="file"
                    class="form-control"
                    accept=".jpg,.png,.jpeg"
                    required
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
                <Table dataSource={pdfFiles} columns={subjectList} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  function fetchData() {
    fetch(`${SERVER}/api/get/subject/names`)
      .then((response) => response.json())
      .then((data) => {
        setPdfFiles(data);
      })
      .catch((error) => {
        console.error("Failed to fetch PDF files:", error);
        handleModel(
          <p className="text-danger">
            Failed to fetch data. Please try again later.
          </p>
        );
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
        <p className="text-danger">Please fill all the fields.</p>
      );
    }
    const fileRef = ref(storage, `image/${selectedFile.name + uuidv4()}`);
    uploadBytes(fileRef, selectedFile).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        handleUpload(url);
      });
    });
  }

  function handleUpload(url) {
    if (!selectedFile || !inputName || !inputPath) {
      return handleModel(
        <p className="text-danger">Please fill all the fields.</p>
      );
    }
    const requestBody = {
      subjectImage: url,
      subjectPath: inputPath.trim(),
      subjectName: inputName.trim(),
    };
    fetch(`${SERVER}/api/create/subject-names`, {
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
          handleModel(<p className="text-success">{data.message}</p>);
          setSelectedFile(null);
          setPreviewUrl(null);
          setInputName("");
          setInputPath("");
        } else {
          handleModel(<p className="text-danger">{data.error}</p>);
        }
      })
      .catch((error) => {
        handleModel(<p className="text-danger">Failed to add subject.</p>);
      });
  }

  function handelDelete(id) {
    const yes = window.confirm("Are you sure you want to delete.");
    if (yes) {
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
            handleModel(<p className="text-success">{data.message}</p>);
            setPdfFiles((prevFiles) =>
              prevFiles.filter((file) => file._id !== id)
            );
          } else {
            handleModel(<p className="text-danger">{data.error}</p>);
          }
        })
        .catch((error) => {
          handleModel(<p className="text-danger">Failed to delete subject.</p>);
        });
    }
  }
}

export default AddSubject;
