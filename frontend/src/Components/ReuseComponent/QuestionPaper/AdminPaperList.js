import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LoginContext } from "../../../context/LoginContext";
import { SERVER } from "../../../context/config";
import "../../css/Course.css";

function AdminPaper() {
  const { branch, course } = useParams();
  const [pdfFiles, setPdfFiles] = useState([]);
  const [allData, setAllData] = useState([]);
  const [searchInput, setSetInput] = useState();
  const [searchYear, setSearchYear] = useState();
  const { token, handleModel } = React.useContext(LoginContext);

  React.useLayoutEffect(() => {
    fetchPapers();
  }, []);

  useEffect(() => {
    if (searchYear && !searchInput) {
      const filteredPdfFiles = allData.filter(
        (file) => file.year === Number(searchYear)
      );
      setPdfFiles(filteredPdfFiles);
    } else if (searchInput && !Number(searchYear)) {
      const filteredPdfFiles = allData.filter((file) => {
        const subject = file.subject.toLowerCase();
        const searchTerm = searchInput.toLowerCase();
        return subject.includes(searchTerm);
      });
      setPdfFiles(filteredPdfFiles);
    } else {
      setPdfFiles(allData);
    }
  }, [allData, searchYear, searchInput]);

  const columns = [
    {
      title: "Name",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "College/University",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (Id) => {
        return (
          <div className="d-flex gap-2">
            <Link
              className="btn btn-primary"
              to={`/admin/modify/correction/${Id}`}
            >
              Update
            </Link>
            <button
              className="btn btn-danger"
              onClick={() => {
                handelDelete(Id);
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
      <section id="portfolio" className="portfolio">
        <div className="container">
          <div className="section-title">
            <h2>Papers of {course} for Update</h2>

            <input
              className="Paper_search form-control"
              placeholder="Search.."
              onChange={(e) => {
                setSetInput(e.currentTarget.value);
              }}
            />
          </div>

          <div class="sales-boxes">
            <div class="recent-sales box">
              <div class="title">List of Papers</div>
              <Table dataSource={pdfFiles} columns={columns} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  function fetchPapers() {
    // Fetch PDF file data from the server
    fetch(`${SERVER}/api/course/${branch}`)
      .then((response) => response.json())
      .then((data) => {
        setAllData(data);
      })
      .catch((error) => {
        console.error("Failed to fetch PDF files:", error);
      });
  }

  function handelDelete(id) {
    const yes = window.confirm("do yot want to delete");
    if (yes) {
      fetch(`${SERVER}/api/paper/delete/by/admin/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            handleModel(<p className="p-0 m-0 text-danger">{data.message}</p>);
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
              Failed to delete question paper.
            </p>
          );
        });
    }
  }
}

export default AdminPaper;
