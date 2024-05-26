import React, { useState, useContext } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { LoginContext } from "../../../context/LoginContext";
import { storage } from "../../../firebase";
import { SERVER } from "../../../context/config";
import { Table } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

const Applink = () => {
  const { token, handleModel } = useContext(LoginContext);
  const [appLink, setAppLink] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  React.useLayoutEffect(() => {
    if (token) fetchData();
  }, [token]);

  const listSet = [
    {
      title: "Image",
      dataIndex: "Image",
      key: "Image",
      render: (Image) => {
        return <img src={Image} height={100} />;
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "data._id",
      render: (data) => {
        return (
          <div className="d-flex gap-2">
            <Link className="btn btn-primary" to={data.Path} target="_blank">
              View
            </Link>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(data._id)}
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ paddingTop: "70px" }}>
      <section>
        <div className="container">
          <div className="section-title">
            <h2>Our App Links</h2>
          </div>
          <form>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="appLink">
                  App Link where the apk is located
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="appLink"
                  placeholder="Enter App Link "
                  value={appLink}
                  onChange={(e) => setAppLink(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="appImage">
                  Upload App Image that will be shown on apps to click and
                  navigate
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="appImage"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                {imagePreview ? (
                  <img src={imagePreview} alt="App Preview" height={200} />
                ) : (
                  <p>No image selected</p>
                )}
              </div>
            </div>
            <div className="text-center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={getImageLink}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </form>
          <hr />

          <Table dataSource={list} columns={listSet} />
        </div>
      </section>
    </div>
  );

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function getImageLink() {
    if (!appLink || !selectedImage) {
      return handleModel(
        <p className="text-danger">All fields are required</p>
      );
    }

    setLoading(true);
    const fileRef = ref(
      storage,
      `appLinks/${Date.now()}_${selectedImage.name}`
    );
    uploadBytes(fileRef, selectedImage)
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      })
      .then((url) => {
        saveToDatabase(url);
      })
      .catch((error) => {
        setLoading(false);
        handleModel(<p className="text-danger">Image upload failed</p>);
        console.error(error);
      });
  }

  async function saveToDatabase(url) {
    const payload = {
      Path: appLink,
      Image: url,
    };

    try {
      const response = await fetch(`${SERVER}/api/app-links/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        handleModel(
          <p className="text-success">App link created successfully</p>
        );
        setList([...list, result]);
        setAppLink("");
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        handleModel(<p className="text-danger">{result.error}</p>);
      }
    } catch (error) {
      handleModel(<p className="text-danger">Failed to save app link</p>);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchData() {
    try {
      const response = await axios.get(`${SERVER}/api/app-links/get`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setList(response.data);
    } catch (error) {}
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this app link?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${SERVER}/api/app-links/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setList(list.filter((item) => item._id !== id));
        handleModel(
          <p className="text-success">App link deleted successfully</p>
        );
      } else {
        const result = await response.json();
        handleModel(<p className="text-danger">{result.error}</p>);
      }
    } catch (error) {
      handleModel(<p className="text-danger">Failed to delete app link</p>);
      console.error(error);
    }
  }
};

export default Applink;
