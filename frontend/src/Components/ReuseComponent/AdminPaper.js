import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "../css/Course.css";
import AdminNav from "./AdminNav";
import { toast } from "react-toastify";

function AdminPaper() {
  const { branch, course } = useParams();
  const [pdfFiles, setPdfFiles] = useState([]);
  const [allData, setAllData] = useState([]);
  const [searchInput, setSetInput] = useState();
  const [searchYear, setSearchYear] = useState();
  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    // Fetch PDF file data from the server
    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/course/${branch}`)
      .then((response) => response.json())
      .then((data) => {
        setAllData(data);
      })
      .catch((error) => {
        console.error("Failed to fetch PDF files:", error);
      });
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

  const handelDelete = (id) => {
    // Send a DELETE request to the server to delete the question paper
    fetch(
      `${process.env.REACT_APP_GLOBAL_LINK}/api/paper/delete/by/admin/${id}`,
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
            <h2>Papers of {course} to Admin</h2>

            <input
              className="Paper_search"
              placeholder="Search.."
              onChange={(e) => {
                setSetInput(e.currentTarget.value);
              }}
            />
          </div>

          <div class="sales-boxes">
            <div class="recent-sales box">
              <div class="title">List of Papers</div>
              <div class="sales-details">
                <ul class="details" style={{ marginRight: "20px" }}>
                  <li class="topic">Subject Name</li>
                  {pdfFiles.length !== 0
                    ? pdfFiles.map((Papers) => {
                        return (
                          <>
                            <hr />
                            <li key={Papers._id}>
                              <a
                                href={`/admin/modify/correction/${Papers._id}`}
                                style={{
                                  height: "30px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {Papers.subject}
                              </a>
                            </li>
                          </>
                        );
                      })
                    : ""}
                </ul>
                <ul class="details" style={{ marginRight: "20px" }}>
                  <li class="topic">Year</li>
                  {pdfFiles.length !== 0
                    ? pdfFiles.map((Papers) => {
                        return (
                          <>
                            <hr />
                            <li key={Papers._id}>
                              <a
                                href={`/admin/modify/correction/${Papers._id}`}
                                style={{
                                  height: "30px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {Papers.year}
                              </a>
                            </li>
                          </>
                        );
                      })
                    : ""}
                </ul>
                <ul class="details">
                  <li class="topic">College/University</li>
                  {pdfFiles.length !== 0
                    ? pdfFiles.map((Papers) => {
                        return (
                          <>
                            <hr />
                            <li key={Papers._id}>
                              <a
                                href={`/admin/modify/correction/${Papers._id}`}
                                style={{
                                  height: "30px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {Papers.type}
                              </a>
                            </li>
                          </>
                        );
                      })
                    : ""}
                </ul>
                <ul class="details">
                  <li class="topic">Action</li>
                  {pdfFiles.length !== 0
                    ? pdfFiles.map((Papers) => {
                        return (
                          <>
                            <hr />
                            <li key={Papers._id}>
                              <a
                                onClick={() => {
                                  handelDelete(Papers._id);
                                }}
                                style={{
                                  height: "30px",
                                  whiteSpace: "nowrap",
                                  color: "red",
                                  cursor: "pointer",
                                }}
                              >
                                Delete
                              </a>
                            </li>
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

export default AdminPaper;
