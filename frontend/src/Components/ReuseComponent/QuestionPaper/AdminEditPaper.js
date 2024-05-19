import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../../context/LoginContext";
import { SERVER } from "../../../context/config";

function AdminEditPaper() {
  const { paperId } = useParams();
  const { token, handleModel } = React.useContext(LoginContext);
  const [courses, setCourses] = useState([]);
  const [types, setTypes] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [type, setType] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const navigate = useNavigate();

  React.useLayoutEffect(() => {
    if (!token) navigate("/");
    else fetchData();
  }, [navigate, token, paperId, handleModel]);

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="portfolio" className="portfolio">
        <div className="container">
          <div className="section-title">
            <h2>Paper Correction</h2>
          </div>
          <div className="row portfolio-container">
            {previewUrl && (
              <div className="col-md-12 ">
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
                      className="btn btn-primary my-2"
                      onClick={() => {
                        handleUpload();
                      }}
                    >
                      Upload file
                    </button>
                  </div>
                </div>

                <iframe
                  className="card-img-top"
                  src={`${previewUrl}`}
                  alt="Card image cap"
                  style={{ height: "700px" }}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );

  async function fetchData() {
    try {
      const [paperResponse, coursesResponse, typesResponse] = await Promise.all(
        [
          fetch(`${SERVER}/api/get/paper/${paperId}`).then((res) => res.json()),
          fetch(`${SERVER}/api/get/course`).then((res) => res.json()),
          fetch(`${SERVER}/api/get/types`).then((res) => res.json()),
        ]
      );

      // Setting the state for the paper
      setPreviewUrl(paperResponse.pdfPath);
      setSubject(paperResponse.subject);
      setYear(paperResponse.year);
      setType(paperResponse.type);
      setCourse(paperResponse.course);

      // Setting the state for courses and types
      setCourses(coursesResponse);
      setTypes(typesResponse);
    } catch (error) {
      handleModel(<p>Failed to fetch data. Please try again later.</p>);
    }
  }

  function handleUpload() {
    const requestBody = {
      type: type,
      subject: subject,
      year: year,
      course: course,
    };
    fetch(`${SERVER}/api/edit/paper/${paperId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          handleModel(<p className="text-success">{data.message}</p>);
          navigate("/admin/course");
        } else {
          handleModel(<p className="text-danger">{data.error}</p>);
        }
      })
      .catch((error) => {
        // console.error("Failed to upload question paper:", error);
        handleModel(
          <p className="text-danger">Failed to upload question paper</p>
        );
      });
  }
}

export default AdminEditPaper;
