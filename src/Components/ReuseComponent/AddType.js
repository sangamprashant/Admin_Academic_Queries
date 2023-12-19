import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNav from "../ReuseComponent/AdminNav";
import { toast } from "react-toastify";

function AddType() {
  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();
  const [pdfFiles, setPdfFiles] = useState([]);

  const [inputValuePath, setInputValuePath] = useState();
  const [inputValueName, setInputValueName] = useState();

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  useEffect(() => {
    // Fetch PDF file data from the server
    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/get/types`)
      .then((response) => response.json())
      .then((data) => {
        setPdfFiles(data);
      })
      .catch((error) => {
        console.error("Failed to fetch PDF files:", error);
      });
  }, [notifyB]);

  const handleUpload = () => {
    console.log(inputValuePath);
    if (!inputValuePath || !inputValueName) {
      notifyA("Please fill all the fields.");
      return;
    }
    const requestBody = {
      valuePath: inputValuePath,
      valueName: inputValueName,
    };
    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/add/types`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then(({ message, error }) => {
        if (message) {
          notifyB(message);
          setInputValuePath("");
          setInputValueName("");
        } else {
          notifyA(error);
        }
      })
      .catch((error) => {
        console.error("Failed to upload question paper:", error);
      });
  };
  const handelDelete = (id) => {
    // Send a DELETE request to the server to delete the question paper
    fetch(
      `${process.env.REACT_APP_GLOBAL_LINK}/api/type/delete/by/admin/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    )
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
      <section id="portfolio" className="portfolio">
        <div className="container">
          <div className="section-title">
            <h2>Add College/University</h2>
          </div>
          <div class="row mt-5 justify-content-center">
            <div class="col-lg-10">
              <form role="form" class="php-email-form">
                <div class="row">
                  <div class="col-md-6 form-group">
                    <input
                      value={inputValueName}
                      type="text"
                      name="name"
                      class="form-control"
                      id="Subject"
                      placeholder="Type Name"
                      required
                      onChange={(e) => {
                        setInputValueName(e.target.value);
                      }}
                    />
                  </div>
                  <div class="col-md-6 form-group mt-3 mt-md-0">
                    <input
                      type="text"
                      class="form-control"
                      name="year"
                      id="year"
                      placeholder="Type Path"
                      required
                      value={inputValuePath}
                      onChange={(e) => {
                        setInputValuePath(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div class="text-center type-upload-button">
                  <button
                    className="btn btn-primary mt-4"
                    type="button"
                    onClick={() => {
                      handleUpload();
                    }}
                  >
                    Upload College/University
                  </button>
                </div>
              </form>
            </div>
          </div>
          <hr />
          <div class="sales-boxes">
            <div class="recent-sales box">
              <div class="title">List of College/University</div>
              <div class="sales-details">
                <ul class="details" style={{ marginRight: "20px" }}>
                  <li class="topic">College/University Name</li>
                  {pdfFiles.length !== 0
                    ? pdfFiles.map((Papers) => {
                        return (
                          <>
                            <hr />
                            <li key={Papers._id}>
                              {" "}
                              <a
                                style={{
                                  height: "30px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {" "}
                                {Papers.valueName}
                              </a>
                            </li>
                          </>
                        );
                      })
                    : ""}
                </ul>
                <ul class="details" style={{ marginRight: "20px" }}>
                  <li class="topic">College/University Path</li>
                  {pdfFiles.length !== 0
                    ? pdfFiles.map((Papers) => {
                        return (
                          <>
                            <hr />
                            <li key={Papers._id}>
                              <a
                                style={{
                                  height: "30px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {Papers.valuePath}
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
                    ? pdfFiles.map((Papers) => {
                        return (
                          <>
                            <hr />
                            <Link key={Papers._id}>
                              <a
                                onClick={() => {
                                  handelDelete(Papers._id);
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
      </section>
    </div>
  );
}

export default AddType;
