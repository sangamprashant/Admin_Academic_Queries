import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNav from "./ReuseComponent/AdminNav";
import { toast } from "react-toastify";

function Responses() {
  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(true);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [messages, setMessages] = useState([]);

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  useEffect(() => {
    if (isActive) {
      // Fetch PDF file data from the server
      fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/question-papers`, {
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
    } else {
      // Fetch messages from the server
      fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/get/contact`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setMessages(data);
        })
        .catch((error) => {
          console.error("Failed to fetch messages:", error);
        });
    }
  }, [isActive,notifyB]);

  const handleDelete = (id) => {
    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/delete/paper/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          notifyB(data.message);
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
            <h2>Responses</h2>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <ul id="portfolio-flters">
                <li
                  className={isActive ? "filter-active" : ""}
                  onClick={() => {
                    setIsActive(true);
                  }}
                >
                  User Paper
                </li>
                <li
                  className={!isActive ? "filter-active" : ""}
                  onClick={() => {
                    setIsActive(false);
                  }}
                >
                  User Message
                </li>
              </ul>
            </div>
          </div>

          <div className="row portfolio-container">
            {isActive && (
              <>
                {pdfFiles.length !== 0 &&
                  pdfFiles.map((paper) => (
                    <>
                      {!paper.valid && (
                        <div
                          className="card col-md-6 my-3 px-2"
                          key={paper._id}
                        >
                          <iframe
                            className="card-img-top"
                            src={`${paper.pdfPath}`}
                            alt="Card image cap"
                            style={{ height: "500px" }}
                          />
                          <Link
                            className="card-body"
                            to={`/admin/modify/${paper._id}`}
                          >
                            <h5 className="card-title">
                              Subject: {paper.subject}
                            </h5>
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
            )}
            {!isActive && (
              <div className="card-columns">
                {messages.length !== 0 &&
                  messages.map((message) => {
                    return (
                      <div className="card text-center p-3 my-1" key={message._id} onClick={()=>{navigate(`/admin/response/email/${message._id}`)}}>
                      <p>{message.subject}</p>
                        <blockquote className="blockquote mb-0">
                        <h5>Message</h5>
                          <p>{message.message}</p>
                          <footer className="blockquote-footer">
                            <small>
                              {message.name} - {message.email}
                            </small>
                          </footer>
                        </blockquote>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Responses;
