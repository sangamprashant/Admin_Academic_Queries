import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import "../css/ProjectsList.css";
import AdminNav from "./AdminNav";

function AdminProjectLanguageSelected() {
  const { language } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [language]);

  const fetchProjects = async () => {
    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/get/project/by/type/${language}`)
      .then((response) => response.json())
      .then((data) => {
        setProjects(
          data.map((project) => ({
            ...project,
            createdAt: new Date(project.createdAt).toLocaleDateString(),
          }))
        );
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch projects:", error);
        setIsLoading(false);
      });
  };

  const handleDelete = (projectId) => {
    // Send a DELETE request to the server to delete the project
    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/admin/delete/project/${projectId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          // Refresh the project list after successful deletion
          fetchProjects();
        } else {
          console.error("Failed to delete project:", data.error);
        }
      })
      .catch((error) => {
        console.error("Failed to delete project:", error);
      });
  };

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="portfolio" className="portfolio">
        <div className="container">
          <div className="section-title">
            <h2>Admin Projects List for {language}</h2>
          </div>
          {isLoading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p>Loading...</p>
            </div>
          ) : (
            <div className="project-type">
              <h4>Top Projects ({projects.length})</h4>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead className="head">
                    <tr>
                      <th>Sr no.</th>
                      <th>Topic</th>
                      <th>Created At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, index) => (
                      <tr key={project._id}>
                        <td>{index + 1}</td>
                        <td>
                          <Link>{project.topic}</Link>
                        </td>
                        <td>{project.createdAt}</td>
                        <td>
                          <Link
                            className="text-danger"
                            onClick={() => handleDelete(project._id)}
                          >
                            Delete
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminProjectLanguageSelected;
