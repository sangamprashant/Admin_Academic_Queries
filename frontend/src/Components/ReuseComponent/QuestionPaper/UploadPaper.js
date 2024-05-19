import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../../../firebase";
import "../../css/Contact.css";

function UploadPaper() {
  const [courses, setCourses] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [type, setType] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const token = localStorage.getItem("jwt");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  useEffect(() => {
    const fetchCourses = fetch(
      `${process.env.REACT_APP_GLOBAL_LINK}/api/get/course`
    ).then((response) => response.json());

    const fetchTypes = fetch(
      `${process.env.REACT_APP_GLOBAL_LINK}/api/get/types`
    ).then((response) => response.json());

    Promise.all([fetchCourses, fetchTypes])
      .then(([coursesData, typesData]) => {
        setCourses(coursesData);
        setTypes(typesData);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const uploadFile = () => {
    if (!selectedFile || !type || !subject || !year || !course) {
      notifyA("Please fill all the fields.");
      return;
    }
    setLoading(true);
    const fileRef = ref(storage, `Pdf/${selectedFile.name + uuidv4()}`);
    uploadBytes(fileRef, selectedFile).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        // Send the download URL to your server for storage in MongoDB
        handleUpload(url);
      });
    });
  };

  const handleUpload = (url) => {
    if (!selectedFile || !type || !subject || !year || !course || !url) {
      notifyA("Please fill all the fields.");
      return;
    }
    const requestBody = {
      path: url,
      type: type,
      subject: subject,
      year: year,
      course: course,
    };
    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/admin/upload`, {
      method: "POST",
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
          setSelectedFile(null);
          setPreviewUrl(null);
          setType("");
          setSubject("");
          setYear("");
          setCourse("");
          setLoading(false);
        } else {
          notifyA(data.error);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Failed to upload question paper:", error);
      });
  };

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="contact" class="contact section-bg">
        <div class="container">
          <div class="section-title">
            <h2>Add Question Paper</h2>
          </div>

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
                      placeholder="Subject Name"
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

                <div className="row">
                  <div class="form-group mt-3 col-md-6">
                    <select
                      class="form-control rounded-0"
                      value={type}
                      onChange={(e) => {
                        setType(e.target.value);
                      }}
                    >
                      <option value=""> Select a College/University</option>
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
                  <div class="form-group mt-3 col-md-6">
                    <select
                      class="form-control rounded-0"
                      value={course}
                      onChange={(e) => {
                        setCourse(e.target.value);
                      }}
                    >
                      <option value=""> Select a Course</option>
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
                </div>
                <sub className="text-danger">Format should be in PDF!</sub>
                <div class="form-group ">
                  <input
                    type="file"
                    class="form-control"
                    accept=".pdf"
                    required
                    onChange={handleFileChange}
                  />
                </div>
                {previewUrl && (
                  <div>
                    <h4>Selected File Preview:</h4>
                    <embed
                      src={previewUrl}
                      type="application/pdf"
                      width="100%"
                      height="600px"
                    />
                  </div>
                )}
                <div class="text-center">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      uploadFile();
                    }}
                  >
                    {loading ? "Please wait.." : "Upload file"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UploadPaper;
