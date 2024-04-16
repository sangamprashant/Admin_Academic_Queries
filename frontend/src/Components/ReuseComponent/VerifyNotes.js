// React component
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function VerifyNotes() {
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

  useEffect(() => {
    fetchSubject(id);
  }, [id]);

  const fetchSubject = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_GLOBAL_LINK}/api/subjects-notes/${id}`
      );
      setSubject(response.data);
      setFormData({
        s_name: response.data.s_name,
        s_topic: response.data.s_topic,
        f_path: response.data.f_path,
        p_image: response.data.p_image,
      });
    } catch (error) {
      console.error("Error fetching subject:", error);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    if (!formData.s_name || !formData.s_topic) {
      toast.error("Plese snter valid input");
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_GLOBAL_LINK}/api/subject-notes/update/${id}`,
        { ...formData, valid: true },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      if (response.status===200) {
        toast.success("Updated successfully")
        navigate("/admin/unverified/subject");
      }
    } catch (error) {
      console.error("Error updating subject notes:", error);
    }
  };

  useEffect(() => {
    // Fetch PDF file data from the server
    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/get/subject/names`)
      .then((response) => response.json())
      .then((data) => {
        setSubjectsList(data);
      })
      .catch((error) => {
        console.error("Failed to fetch PDF files:", error);
      });
  }, []);

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="contact" className="contact section-bg">
        <div className="container">
          <div className="section-title">
            <h2>Unverified Notes</h2>
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
                  {/* Add more details as needed */}
                </ul>
              </div>

              {/* Update Form */}
              <div>
                <h3>Update Subject Details:</h3>
                <form>
                  <label>
                    Subject Name:
                    <select
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
                  </label>
                  <label>
                    Topic:
                    <input
                      type="text"
                      name="s_topic"
                      value={formData.s_topic}
                      onChange={handleFormChange}
                    />
                  </label>
                  {/* Add more fields as needed */}
                  <button type="button" onClick={handleUpdate}>
                    Update
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default VerifyNotes;
