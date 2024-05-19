import axios from "axios";
import React from "react";
import { Button, Modal } from "antd";
import { SERVER } from "../../../context/config";
import { LoginContext } from "../../../context/LoginContext";
import { storage } from "../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddNotes = () => {
  const [subject, setSubject] = React.useState([]);
  const [s_name, setS_name] = React.useState("");
  const [s_topic, setS_topic] = React.useState("");
  const [waiting, setWaiting] = React.useState(false);

  const [selectedFile, setSelectedFile] = React.useState(null);
  const [previewUrl, setPreviewUrl] = React.useState(null);

  const { handleModel, token } = React.useContext(LoginContext);

  React.useLayoutEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await axios.get(`${SERVER}/api/get/subject/names`);
        if (response.status === 200) {
          setSubject(response.data);
        }
      } catch (error) {
        // console.log({ error });
      }
    };

    fetchSubject();
  }, []);

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="contact" class="contact section-bg">
        <div class="container">
          <div class="section-title">
            <h2>Add Notes</h2>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <form role="form" className="php-email-form">
                <div className="row">
                  <div className="col-md-6 form-group">
                    <select
                      value={s_name}
                      className="form-control rounded-0 p-2"
                      id="Subject"
                      required
                      onChange={(e) => {
                        setS_name(e.target.value);
                      }}
                    >
                      <option value="">Select a subject name</option>
                      {subject.map((data, index) => {
                        return (
                          <option key={index} value={data.subjectPath}>
                            {data.subjectName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-md-6 form-group mt-3 mt-md-0">
                    <input
                      type="text"
                      className="form-control"
                      name="topic"
                      id="topic"
                      placeholder="Note's topic"
                      required
                      value={s_topic}
                      onChange={(e) => {
                        setS_topic(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <sub className="text-danger">Format should be in PDF!</sub>
                <div className="form-group ">
                  <input
                    type="file"
                    className="form-control"
                    name="pdf"
                    id="pdf"
                    accept=".pdf"
                    placeholder="Paper in pdf"
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
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      uploadFile();
                    }}
                  >
                    {waiting ? "Please Wait.." : "Add Notes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  function handleFileChange(event) {
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
  }

  function uploadFile() {
    if (!selectedFile || !s_name.trim() || !s_topic.trim()) {
      return handleModel(
        <p className="m-0 p-0">Please fill all the fields.</p>
      );
    }
    setWaiting(true);
    const fileRef = ref(storage, `Notes/${Date.now() + selectedFile.name}`);
    uploadBytes(fileRef, selectedFile).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        handleUpload(url);
      });
    });
  }

  function handleUpload(url) {
    if (!s_name.trim() || !s_topic.trim() || !url) {
      return handleModel(
        <p className="m-0 p-0">Please fill all the fields.</p>
      );
    }
    const requestBody = {
      f_path: url,
      s_name: s_name.trim(),
      s_topic: s_topic.trim(),
    };
    fetch(`${SERVER}/api/admin/upload/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          handleModel(
            <p className="m-0 p-0">
              {data.message || "Notes uploaded successfully"}
            </p>
          );
          setSelectedFile(null);
          setPreviewUrl(null);
          setS_topic("");
          setWaiting(false);
        } else {
          handleModel(
            <p className="m-0 p-0">
              {data.error || "Failed to upload question paper."}
            </p>
          );
        }
      })
      .catch((error) => {
        console.error("Failed to upload question paper:", error);
        handleModel(
          <p className="m-0 p-0">Failed to upload question paper."</p>
        );
        setWaiting(false);
      });
  }
};

export default AddNotes;
