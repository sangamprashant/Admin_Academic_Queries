import React, { useEffect, useState } from "react";
import "../css/Paper.css";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import "../css/ProjectsList.css";

function AdminProjectHome() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch PDF file data from the server
    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/project/languages`)
      .then((response) => response.json())
      .then((data) => {
        setPdfFiles(data);
        setIsLoading(false); // Turn off loading state when data is fetched
      })
      .catch((error) => {
        console.error("Failed to fetch PDF files:", error);
        setIsLoading(false); // Turn off loading state in case of an error
      });
  }, []);
  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="portfolio" className="portfolio">
        <div className="container">
          <div className="section-title">
            <h2>Admin Projects</h2>
          </div>
          <div className="language-container">
            {isLoading ? (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p>Loading...</p>
              </div>
            ) : (
              pdfFiles.map((Projects) => (
                <Link
                  key={Projects._id}
                  className="m-2 portfolio-item filter-app wow fadeInUp"
                  to={`/admin/projects/${Projects.ProjectName}`}
                >
                  <div className="portfolio-wrap">
                    <figure>
                      <img
                        src={`${Projects.ProjectImage}`}
                        type="application/pdf"
                        width="100%"
                        height="200px"
                      />
                    </figure>
                    <div className="portfolio-info">
                      <h4>
                        <a>{Projects.ProjectName}</a>
                      </h4>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminProjectHome;
