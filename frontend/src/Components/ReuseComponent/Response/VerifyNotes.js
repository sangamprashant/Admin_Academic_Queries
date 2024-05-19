import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../../context/LoginContext";
import { SERVER } from "../../../context/config";

function VerifyNotes() {
  const { handleModel, token } = React.useContext(LoginContext);
  const [subject, setSubject] = useState(null);
  const [subjectsList, setSubjectsList] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    s_name: "",
    s_topic: "",
    f_path: "",
    p_image: "",
  });

  const { id } = useParams();

  React.useLayoutEffect(() => {
    if (!token) navigate("/");
    else if (id) fetchSubject(id);

    fetchSubjectName();
  }, [id]);

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="contact" className="contact section-bg">
        <div className="container">
          <div className="section-title">
            <h2>Varify Note</h2>
          </div>
          {subject && (
            <div className="container">
              <iframe src={subject.f_path} width={"100%"} height={"500px"} />
              <div>
                <h3>Subject Details:</h3>
                <ul>
                  <li>
                    <strong>Subject Name:</strong> {subject.s_name}
                  </li>
                  <li>
                    <strong>Topic:</strong> {subject.s_topic}
                  </li>
                  <li>
                    <strong>Uploader Name:</strong> {subject.u_name}
                  </li>
                </ul>
              </div>
              <hr />
              <div>
                <h3>Update Subject Details:</h3>
                <form>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Subject Name: </label>
                      <select
                        className="form-control rounded-0"
                        type="text"
                        name="s_name"
                        value={formData.s_name}
                        onChange={handleFormChange}
                      >
                        <option value="">select a subject</option>
                        {subjectsList.map((data, index) => (
                          <option value={data.subjectPath} key={index}>
                            {data.subjectName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label>Topic:</label>
                      <input
                        type="text"
                        name="s_topic"
                        className="form-control rounded-0"
                        value={formData.s_topic}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>

                  {/* Add more fields as needed */}
                  <div className="text-center mt-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  async function handleUpdate() {
    if (!formData.s_name || !formData.s_topic) {
      return handleModel(<p>Please enter all the fields.</p>);
    }
    try {
      const response = await axios.post(
        `${SERVER}/api/subject-notes/update/${id}`,
        { ...formData, valid: true },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        handleModel(<p className="text-danger">Updated Successfully</p>);
        navigate("/admin/unverified/subject");
      }
    } catch (error) {
      handleModel(
        <p className="text-danger">
          {error.response.data.error || "Error updating subject"}
        </p>
      );
    }
  }
  function handleFormChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }
  async function fetchSubject(id) {
    try {
      const response = await axios.get(`${SERVER}/api/subjects-notes/${id}`);
      setSubject(response.data);
      setFormData({
        s_name: response.data.s_name,
        s_topic: response.data.s_topic,
        f_path: response.data.f_path,
        p_image: response.data.p_image,
      });
    } catch (error) {
      handleModel(
        <p className="text-danger">
          {error?.response?.data?.error || "Error fetching subject"}
        </p>
      );
    }
  }
  function fetchSubjectName() {
    // Fetch PDF file data from the server
    fetch(`${SERVER}/api/get/subject/names`)
      .then((response) => response.json())
      .then((data) => {
        setSubjectsList(data);
      })
      .catch((error) => {
        handleModel(
          <p className="text-danger">
            {error?.response?.data?.error || "Error fetching subject"}
          </p>
        );
      });
  }
}

export default VerifyNotes;
