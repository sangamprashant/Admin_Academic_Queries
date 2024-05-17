import React, { useState } from "react";
import "../../css/Paper.css";
import { Link } from "react-router-dom";
import { SERVER } from "../../../context/config";

function AdminCourse() {
  const [pdfFiles, setPdfFiles] = useState([]);

  React.useLayoutEffect(() => {
    // Fetch PDF file data from the server
    fetch(`${SERVER}/api/get/course`)
      .then((response) => response.json())
      .then((data) => {
        setPdfFiles(data);
      })
      .catch((error) => {
        console.error("Failed to fetch PDF files:", error);
      });
  }, []);

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="portfolio" className="portfolio">
        <div className="container">
          <div className="section-title">
            <h2>Admin Course</h2>
          </div>

          <div className="row portfolio-container">
            {pdfFiles.map((Papers) => (
              <Link
                className="col-lg-4 col-md-6 portfolio-item filter-app wow fadeInUp"
                to={`/course/to/update/${Papers.coursePath}/${Papers.courseName}`}
              >
                <div className="portfolio-wrap">
                  <figure>
                    <img
                      src={`${Papers.courseImage}`}
                      type="application/pdf"
                      width="100%"
                      height="200px"
                    />
                  </figure>
                  <div className="portfolio-info">
                    <h4>
                      <a href="portfolio-details.html">{Papers.courseName}</a>
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminCourse;
