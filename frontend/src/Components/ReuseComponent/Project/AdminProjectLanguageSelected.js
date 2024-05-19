import { Table } from "antd";
import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { LoginContext } from "../../../context/LoginContext";
import { SERVER } from "../../../context/config";
import "../../css/ProjectsList.css";

function AdminProjectLanguageSelected() {
  const { language } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const { token, handleModel } = React.useContext(LoginContext);

  React.useLayoutEffect(() => {
    fetchProjects();
  }, [language]);

  const projectList = [
    {
      title: "Topic",
      dataIndex: "topic",
      key: "topic",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (_id) => (
        <button className="btn btn-danger" onClick={() => handleDelete(_id)}>
          DELETE
        </button>
      ),
    },
  ];

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="portfolio" className="portfolio">
        <div className="container">
          <div className="section-title">
            <h2>Admin Projects List of {language}</h2>
          </div>
          {isLoading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p>Loading...</p>
            </div>
          ) : (
            <div className="project-type">
              <Table dataSource={projects} columns={projectList} />
            </div>
          )}
        </div>
      </section>
    </div>
  );

  async function fetchProjects() {
    fetch(`${SERVER}/api/get/project/by/type/${language}`)
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
        handleModel(<p className="text-danger">Failed to fetch projects</p>);
        setIsLoading(false);
      });
  }

  function handleDelete(projectId) {
    fetch(`${SERVER}/api/admin/delete/project/${projectId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          handleModel(
            <p className="text-success">Project deleted successfully.</p>
          );
          fetchProjects();
        } else {
          handleModel(
            <p className="text-danger">
              {data.message || "Failed to delete project."}
            </p>
          );
        }
      })
      .catch((error) => {
        handleModel(
          <p className="text-danger">
            Failed to delete project due to an error.
          </p>
        );
      });
  }
}

export default AdminProjectLanguageSelected;
