import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminNav from "../ReuseComponent/AdminNav";
import { toast } from "react-toastify";

function GetPaperToAdmin() {
  const { paperId } = useParams();
  const [pdfFile, setPdfFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [types, setTypes] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [type, setType] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const [name, setName] = useState("");
  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  useEffect(() => {
    // Fetch the question paper by ID
    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/get/paper/${paperId}`)
      .then((response) => response.json())
      .then((data) => {
        setPdfFile(data);
        setName(data.name);
        setPreviewUrl(data.pdfPath);
      })
      .catch((error) => {
        console.error("Failed to fetch question paper:", error);
      });
  }, [paperId]);

  //fetch courses
  useEffect(() => {
    // Fetch PDF file data from the server
    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/get/course`)
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
      })
      .catch((error) => {
        console.error("Failed to fetch PDF files:", error);
      });
  }, []);
  //fetch types
  useEffect(() => {
    // Fetch PDF file data from the server
    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/get/types`)
      .then((response) => response.json())
      .then((data) => {
        setTypes(data);
      })
      .catch((error) => {
        console.error("Failed to fetch PDF files:", error);
      });
  }, []);

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const handleUpload = () => {
    if (!name || !type || !subject || !year || !course || !previewUrl) {
      notifyA("Please fill all the fields.");
      return;
    }
    const requestBody = {
      path: previewUrl,
      type: type,
      subject: subject,
      year: year,
      course: course,
      name: name,
      valid: true,
    };
    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/update/paper/${paperId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          notifyB(data.message);
          navigate("/responses")
        } else {
          notifyA(data.error);
        }
      })
      .catch((error) => {
        console.error("Failed to upload question paper:", error);
      });
  };

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="portfolio" className="portfolio">
        <div className="container">
          <div className="section-title">
            <h2>Get Paper To Admin</h2>
          </div>
          <div className="row portfolio-container">
            {pdfFile && !pdfFile.valid && (
              <div className="card col-md-12 my-3 px-2">
                <iframe
                  className="card-img-top"
                  src={`${pdfFile.pdfPath}`}
                  alt="Card image cap"
                  style={{ height: "700px" }}
                />
                <div className="card-body">
                  <h5 className="card-title">Subject: {pdfFile.subject}</h5>
                  <p className="card-text">Course: {pdfFile.course}</p>
                  <p className="card-text">Year: {pdfFile.year}</p>
                  <p className="card-text">Type: {pdfFile.type}</p>
                  <p className="card-text">Name: {pdfFile.name}</p>
                </div>

                <section id="" class="contact section-bg">
                  <div class="">
                    <h1 style={{ textAlign: "center" }}>Admin update</h1>
                    <div class="row justify-content-center">
                      <div class="col-lg-10">
                        <form role="form" class="php-email-form">
                          <div class="row">
                            <div class="col-md-6 form-group">
                              <input
                                value={subject}
                                type="text"
                                name="Subject"
                                class="form-control"
                                id="Subject"
                                placeholder=" Enter subject name"
                                required
                                onChange={(e) => {
                                  setSubject(e.target.value);
                                }}
                              />
                            </div>
                            <div class="col-md-6 form-group mt-3 mt-md-0">
                              <input
                                type="number"
                                class="form-control"
                                name="year"
                                id="year"
                                placeholder="Paper Conducted in"
                                required
                                value={year}
                                onChange={(e) => {
                                  setYear(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                          <div class="form-group mt-3">
                            <select
                              class="form-control"
                              value={type}
                              onChange={(e) => {
                                setType(e.target.value);
                              }}
                            >
                              <option value=""> Select Paper Type..</option>
                              {types.length !== 0
                                ? types.map((type) => {
                                    return (
                                      <option value={type.valuePath}>
                                        {type.valueName}
                                      </option>
                                    );
                                  })
                                : ""}
                            </select>
                          </div>
                          <div class="form-group mt-3">
                            <select
                              class="form-control"
                              value={course}
                              onChange={(e) => {
                                setCourse(e.target.value);
                              }}
                            >
                              <option value=""> Select Course Type..</option>
                              {courses.length !== 0
                                ? courses.map((course) => {
                                    return (
                                      <option value={course.coursePath}>
                                        {course.courseName}
                                      </option>
                                    );
                                  })
                                : ""}
                            </select>
                          </div>
                          <div class="text-center">
                            <button
                              type="button"
                              onClick={() => {
                                handleUpload();
                              }}
                            >
                              Upload file
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default GetPaperToAdmin;
