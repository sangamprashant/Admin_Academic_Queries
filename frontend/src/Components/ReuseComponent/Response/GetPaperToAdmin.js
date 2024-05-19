import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../../context/LoginContext";
import { SERVER } from "../../../context/config";

function GetPaperToAdmin() {
  const { paperId } = useParams();
  const { token, handleModel } = React.useContext(LoginContext);
  const [pdfFile, setPdfFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [types, setTypes] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [type, setType] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useLayoutEffect(() => {
    if (!token) navigate("/");
    else fetchData();
  }, [navigate, token, paperId]);

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="portfolio" className="portfolio">
        <div className="container">
          <div className="section-title">
            <h2>Get Paper To Verify</h2>
          </div>
          <div className="row portfolio-container">
            {pdfFile && !pdfFile.valid && (
              <div className="col-md-12 ">
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
                <hr />
                <sub className=" text-danger-emphasis">
                  If college/University or Course is not in list then first add
                  them.
                </sub>
                <div class="row justify-content-center">
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
                        <option value=""> Select College/University</option>
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
                        <option value=""> Select Course</option>
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
                    <div class="text-center mt-2">
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={loading}
                        onClick={() => {
                          handleUpload();
                        }}
                      >
                        {loading ? "Loading" : "Verify Paper "}
                      </button>
                    </div>
                  </form>
                </div>
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
      setPdfFile(paperResponse);
      setName(paperResponse.name);
      setPreviewUrl(paperResponse.pdfPath);

      // Setting the state for courses and types
      setCourses(coursesResponse);
      setTypes(typesResponse);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      handleModel(<p>Failed to fetch data. Please try again later.</p>);
    }
  }

  function handleUpload() {
    if (!name || !type || !subject || !year || !course || !previewUrl) {
      return handleModel(
        <p className="text-danger">All fields are required.</p>
      );
    }
    setLoading(true);
    const requestBody = {
      path: previewUrl,
      type: type,
      subject: subject,
      year: year,
      course: course,
      name: name,
      valid: true,
    };
    fetch(`${SERVER}/api/update/paper/${paperId}`, {
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
          navigate("/responses");
        } else {
          handleModel(<p className="text-danger">{data.error}</p>);
        }
      })
      .catch((error) => {
        handleModel(<p className="text-danger">Failed to update paper</p>);
      })
      .finally(setLoading(false));
  }
}

export default GetPaperToAdmin;
