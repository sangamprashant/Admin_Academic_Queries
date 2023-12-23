import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

function AddProject() {
  const [types, setTypes] = useState([]);//fetched languages
  const [reportUrl, setReportUrl] = useState(null);
  const [pptUrl, setPptUrl] = useState(null);
  const [images, setImages] = useState([]);
  const [imagesLink,setImagesLink] = useState(null)
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("");
  const [waiting ,setWaiting] = useState(false);
  const [waitingReport, setWaitingReport] = useState(false);
  const [waitingPpt, setWaitingPpt] = useState(false);
  const [waitingImages, setWaitingImages] = useState(false);

  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();
  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  //fetch types
  useEffect(() => {
    // Fetch PDF file data from the server
    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/project/languages`)
      .then((response) => response.json())
      .then((data) => {
        setTypes(data);
      })
      .catch((error) => {
        console.error("Failed to fetch PDF files:", error);
      });
  }, []);

  const handleFileChangeReport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setWaitingReport(true);
      await handleGetReportLink(file);
    } else {
      setReportUrl(null);
    }
  };

  const handleFileChangePpt = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setWaitingPpt(true);
      await handleGetPptLink(file);
    } else {
      setPptUrl(null);
    }
  };

  const handleImageSelection = async (event) => {
    const files = event.target.files;
    const imageArray = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      imageArray.push({ file });
    }
    setImages(imageArray);
    setWaitingImages(true)
    await handleGetImagesLink(imageArray);
  };
  
  const uploadFile = async () => {
    if (!topic) {
      notifyA("Please fill the topic.");
      return;
    }
    if (!language) {
      notifyA("Please select the language.");
      return;
    }
    if (images.length === 0) {
      notifyA("Please select at least one image.");
      return;
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
  };
  
  //firebase wait
  const handleGetReportLink =async (reportFile) => {
    const reportRef = ref(storage, `ProjectReport/${reportFile.name + uuidv4()}`);
    const reportSnapshot = await uploadBytes(reportRef, reportFile);
    const reportUrl = await getDownloadURL(reportSnapshot.ref);
    setReportUrl(reportUrl);
    setWaitingReport(false);
  }
  const handleGetPptLink = async (pptFile) => {
    const pptRef = ref(storage, `ProjectPPT/${pptFile.name + uuidv4()}`);
    const pptSnapshot = await uploadBytes(pptRef, pptFile);
    const pptUrl = await getDownloadURL(pptSnapshot.ref);
    setPptUrl(pptUrl);
    setWaitingPpt(false);
  }
  const handleGetImagesLink = async (images) => {
    const imageUploadPromises = [];
    images.forEach((image) => {
      const imageRef = ref(storage, `ProjectImages/${image.file.name + uuidv4()}`);
      const imageSnapshot = uploadBytes(imageRef, image.file);
      imageUploadPromises.push(imageSnapshot);
    });
    // Wait for all image uploads to complete
    const imageSnapshots = await Promise.all(imageUploadPromises);
    // Extract the image URLs and store them in the imagesLink state
    const imageUrls = await Promise.all(imageSnapshots.map((snapshot) => getDownloadURL(snapshot.ref)));
    setImagesLink(imageUrls);
    setWaitingImages(false)
  }

  const handleUpload = (requestBody) => {
    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/admin/upload/project`, {
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
          // Reset the form fields and state
          setTopic("");
          setLanguage("");
          setReportUrl(null);
          setPptUrl(null);
          setImages([]);
          setImagesLink(null);
        } else {
          notifyA(data.error);
        }
      })
      .catch((error) => {
        console.error("Failed to upload project:", error);
      })
      .finally(() => {
        setWaiting(false);
        setWaitingReport(false);
        setWaitingPpt(false);
        setWaitingImages(false);
      });
  };

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="contact" class="contact section-bg">
        <div class="container">
          <div class="section-title">
            <h2>Add Project</h2>
            <p>Format should be in PDF!</p>
          </div>

          <div class="row mt-5 justify-content-center">
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
                  </label><br/>
                  {!images.length>0&&<sup>select at atleast one</sup>}
                  <input
                    type="file"
                    class="form-control"
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
                    disabled={waiting||waitingReport||waitingPpt || waitingImages}
                    onClick={() => {
                      uploadFile();
                    }}
                  >
                    {waiting ||waitingReport ||waitingPpt || waitingImages ?"please wait...":"upload file"}
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

export default AddProject;
