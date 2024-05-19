import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { LoginContext } from "../../../context/LoginContext";
import { SERVER } from "../../../context/config";
import { storage } from "../../../firebase";

function AddProject() {
  const [types, setTypes] = useState([]); //fetched languages
  const [reportUrl, setReportUrl] = useState(null);
  const [pptUrl, setPptUrl] = useState(null);
  const [images, setImages] = useState([]);
  const [imagesLink, setImagesLink] = useState(null);
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [waitingReport, setWaitingReport] = useState(false);
  const [waitingPpt, setWaitingPpt] = useState(false);
  const [waitingImages, setWaitingImages] = useState(false);

  const { token, handleModel } = React.useContext(LoginContext);
  const navigate = useNavigate();

  React.useLayoutEffect(() => {
    if (!token) navigate("/");
    else fetchLanguages();
  }, [navigate, token]);

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="contact" class="contact section-bg">
        <div class="container">
          <div class="section-title">
            <h2>Add a New Project</h2>
          </div>

          <div class="row justify-content-center">
            <div class="col-lg-10">
              <form role="form" class="php-email-form">
                <div class="row">
                  <div class="col-md-6 form-group">
                    <label>
                      Project topic<sup>*</sup>
                    </label>
                    <input
                      value={topic}
                      type="text"
                      name="Subject"
                      class="form-control"
                      id="Subject"
                      placeholder="Project topic"
                      required
                      onChange={(e) => {
                        setTopic(e.target.value);
                      }}
                    />
                  </div>
                  <div class="col-md-6 form-group mt-3 mt-md-0">
                    <label>
                      Project language<sup>*</sup>
                    </label>
                    <select
                      class="form-control p-2"
                      value={language}
                      onChange={(e) => {
                        setLanguage(e.target.value);
                      }}
                    >
                      <option value=""> Select project language...</option>
                      {types.length !== 0
                        ? types.map((type) => {
                            return (
                              <option value={type.ProjectName}>
                                {type.ProjectName}
                              </option>
                            );
                          })
                        : ""}
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 form-group">
                    <label>Report</label>
                    <input
                      type="file"
                      class="form-control"
                      accept=".pdf"
                      onChange={handleFileChangeReport}
                    />
                    {reportUrl && (
                      <div>
                        <h5>Report Preview</h5>
                        <embed src={reportUrl} width="100%" height="300px" />
                      </div>
                    )}
                  </div>
                  <div class="col-md-6 form-group">
                    <label>Powerpoint </label>
                    <input
                      type="file"
                      class="form-control"
                      accept=".pdf"
                      onChange={handleFileChangePpt}
                    />
                    {pptUrl && (
                      <div>
                        <h5>Report Preview</h5>
                        <embed src={pptUrl} width="100%" height="300px" />
                      </div>
                    )}
                  </div>
                </div>
                <div class="form-group">
                  <label>
                    Project images<sup>*</sup>
                  </label>
                  <br />
                  {!images.length > 0 && (
                    <sub className="text-danger">select at atleast one</sub>
                  )}
                  <input
                    type="file"
                    class="form-control"
                    accept=".jpg,.jpeg,.png"
                    required
                    multiple
                    onChange={handleImageSelection}
                  />
                  {images.length > 0 && (
                    <div>
                      <p>Selected images</p>
                      <div className="project-input-image">
                        {images.map((image, index) => (
                          <img
                            key={index}
                            src={URL.createObjectURL(image.file)}
                            alt={`Selected Image ${index}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div class="text-center">
                  <button
                    type="button"
                    disabled={
                      waiting || waitingReport || waitingPpt || waitingImages
                    }
                    onClick={() => {
                      uploadFile();
                    }}
                  >
                    {waiting || waitingReport || waitingPpt || waitingImages
                      ? "please wait..."
                      : "upload file"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  async function handleFileChangeReport(event) {
    const file = event.target.files[0];
    if (file) {
      setWaitingReport(true);
      await handleGetReportLink(file);
    } else {
      setReportUrl(null);
    }
  }
  async function handleImageSelection(event) {
    const files = event.target.files;
    const imageArray = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      imageArray.push({ file });
    }
    setImages(imageArray);
    setWaitingImages(true);
    await handleGetImagesLink(imageArray);
  }
  async function handleFileChangePpt(event) {
    const file = event.target.files[0];
    if (file) {
      setWaitingPpt(true);
      await handleGetPptLink(file);
    } else {
      setPptUrl(null);
    }
  }
  //firebase wait
  async function handleGetReportLink(reportFile) {
    const reportRef = ref(
      storage,
      `ProjectReport/${reportFile.name + uuidv4()}`
    );
    const reportSnapshot = await uploadBytes(reportRef, reportFile);
    const reportUrl = await getDownloadURL(reportSnapshot.ref);
    setReportUrl(reportUrl);
    setWaitingReport(false);
  }
  async function handleGetPptLink(pptFile) {
    const pptRef = ref(storage, `ProjectPPT/${pptFile.name + uuidv4()}`);
    const pptSnapshot = await uploadBytes(pptRef, pptFile);
    const pptUrl = await getDownloadURL(pptSnapshot.ref);
    setPptUrl(pptUrl);
    setWaitingPpt(false);
  }
  function fetchLanguages() {
    // Fetch PDF file data from the server
    fetch(`${SERVER}/api/project/languages`)
      .then((response) => response.json())
      .then((data) => {
        setTypes(data);
      })
      .catch((error) => {
        console.error("Failed to fetch PDF files:", error);
      });
  }
  async function handleGetImagesLink(images) {
    const imageUploadPromises = [];
    images.forEach((image) => {
      const imageRef = ref(
        storage,
        `ProjectImages/${image.file.name + uuidv4()}`
      );
      const imageSnapshot = uploadBytes(imageRef, image.file);
      imageUploadPromises.push(imageSnapshot);
    });
    // Wait for all image uploads to complete
    const imageSnapshots = await Promise.all(imageUploadPromises);
    // Extract the image URLs and store them in the imagesLink state
    const imageUrls = await Promise.all(
      imageSnapshots.map((snapshot) => getDownloadURL(snapshot.ref))
    );
    setImagesLink(imageUrls);
    setWaitingImages(false);
  }
  async function uploadFile() {
    if (!topic) {
      return handleModel(<p className="text-danger">Please fill the topic.</p>);
    }
    if (!language) {
      return handleModel(
        <p className="text-danger">Please select the language.</p>
      );
    }
    if (images.length === 0) {
      return handleModel(
        <p className="text-danger">Please select at least one project image.</p>
      );
    }

    setWaiting(true);

    try {
      // Prepare the request body
      const requestBody = {
        type: language,
        topic,
        report: reportUrl || null,
        ppt: pptUrl || null,
        images: imagesLink,
        valid: true,
      };
      // Send the data to your server
      handleUpload(requestBody);
    } catch (error) {
      console.error("File upload error:", error);
    }
  }
  function handleUpload(requestBody) {
    fetch(`${SERVER}/api/admin/upload/project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setTopic("");
          setLanguage("");
          setReportUrl(null);
          setPptUrl(null);
          setImages([]);
          setImagesLink(null);
          handleModel(<p className="text-success">{data.message}</p>);
        } else {
          handleModel(<p className="text-danger">{data.error}</p>);
        }
      })
      .catch((error) => {
        // console.error("Failed to upload project:", error);
        handleModel(<p className="text-danger">Failed to upload project</p>);
      })
      .finally(() => {
        setWaiting(false);
        setWaitingReport(false);
        setWaitingPpt(false);
        setWaitingImages(false);
      });
  }
}

export default AddProject;
