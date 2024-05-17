import React from "react";
import { SERVER } from "../../../context/config";
import { LoginContext } from "../../../context/LoginContext";
import { Link } from "react-router-dom";

const ResponsePaper = () => {
  const { handleModel, token } = React.useContext(LoginContext);
  const [pdfFiles, setPdfFiles] = React.useState([]);

  React.useLayoutEffect(() => {
    fetchPaper()
  }, []);

  return (
    <div className="row portfolio-container">
      <>
        {pdfFiles.length !== 0 &&
          pdfFiles.map((paper) => (
            <>
              {!paper.valid && (
                <div className="card col-md-4 my-3 px-2" key={paper._id}>
                  <iframe
                    className="card-img-top"
                    src={`${paper.pdfPath}`}
                    alt="Card image cap"
                    style={{ height: "500px" }}
                  />
                  <Link className="card-body" to={`/admin/modify/${paper._id}`}>
                    <h5 className="card-title">Subject: {paper.subject}</h5>
                    <p className="card-text">Course: {paper.course}</p>
                    <p className="card-text">Year: {paper.year}</p>
                    <p className="card-text">Type: {paper.type}</p>
                    <p className="card-text">Name: {paper.name}</p>
                  </Link>
                  <a
                    className="btn btn-danger my-2"
                    onClick={() => {
                      handleDelete(paper._id);
                    }}
                  >
                    Delete Paper
                  </a>
                </div>
              )}
            </>
          ))}
      </>
    </div>
  );

  function fetchPaper() {
    // Fetch PDF file data from the server
    fetch(`${SERVER}/api/question-papers`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPdfFiles(data);
      })
      .catch((error) => {
        console.error("Failed to fetch PDF files:", error);
      });
  }

  function handleDelete(id) {
    fetch(`${SERVER}/api/delete/paper/${id}`, {
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
          fetchPaper()
        } else {
          handleModel(<p className="text-danger">Failed to delete response</p>);
        }
      })
      .catch((error) => {
        handleModel(<p className="text-danger">Failed to delete response</p>);
      });
  }
};

export default ResponsePaper;
