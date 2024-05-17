import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../../../context/LoginContext";
import { SERVER } from "../../../context/config";
import { Table } from "antd";

function AddType() {
  const { token, handleModel } = React.useContext(LoginContext);
  const navigate = useNavigate();
  const [pdfFiles, setPdfFiles] = useState([]);

  const [inputValuePath, setInputValuePath] = useState();
  const [inputValueName, setInputValueName] = useState();

  React.useLayoutEffect(() => {
    if (token) fetchCollegeUniversity();
    else navigate("/");
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "valueName",
      key: "valueName",
    },
    {
      title: "Path",
      dataIndex: "valuePath",
      key: "valuePath",
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (Id) => {
        return (
          <button
            className="btn btn-danger"
            onClick={() => {
              handelDelete(Id);
            }}
          >
            Delete
          </button>
        );
      },
    },
  ];

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="portfolio" className="portfolio">
        <div className="container">
          <div className="section-title">
            <h2>Add College/University</h2>
          </div>
          <div class="row justify-content-center">
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
              <Table dataSource={pdfFiles} columns={columns} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  function fetchCollegeUniversity() {
    // Fetch PDF file data from the server
    fetch(`${SERVER}/api/get/types`)
      .then((response) => response.json())
      .then((data) => {
        setPdfFiles(data);
      })
      .catch((error) => {
        console.error("Failed to fetch PDF files:", error);
      });
  }

  function handleUpload() {
    if (!inputValuePath || !inputValueName) {
      return handleModel(
        <p className="p-0 m-0 text-danger">Please fill all the fields.</p>
      );
    }
    const requestBody = {
      valuePath: inputValuePath,
      valueName: inputValueName,
    };
    fetch(`${SERVER}/api/add/types`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then(({ message, error }) => {
        if (message) {
          handleModel(<p className="p-0 m-0 text-success">{message}</p>);
          setInputValuePath("");
          setInputValueName("");
        } else {
          handleModel(<p className="p-0 m-0 text-danger">{error}</p>);
        }
      })
      .catch((error) => {
        console.error("Failed to upload question paper:", error);
        handleModel(
          <p className="p-0 m-0 text-danger">
            Failed to add the College/University
          </p>
        );
      });
  }

  function handelDelete(id) {
    fetch(`${SERVER}/api/type/delete/by/admin/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          handleModel(<p className="p-0 m-0 text-success">{data.message}</p>);
          setPdfFiles((prevFiles) =>
            prevFiles.filter((file) => file._id !== id)
          );
        } else {
          handleModel(<p className="p-0 m-0 text-danger">{data.error}</p>);
        }
      })
      .catch((error) => {
        console.error("Failed to delete question paper:", error);
        handleModel(
          <p className="p-0 m-0 text-danger">
            Failed to delete the College/University
          </p>
        );
      });
  }
}

export default AddType;
