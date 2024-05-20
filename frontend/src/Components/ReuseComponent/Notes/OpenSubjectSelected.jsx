import React from "react";
import { Link, useParams } from "react-router-dom";
import { LoginContext } from "../../../context/LoginContext";
import axios from "axios";
import { SERVER } from "../../../context/config";
import { Table } from "antd";

const OpenSubjectSelected = () => {
  const { name } = useParams();
  const { handleModel, token } = React.useContext(LoginContext);
  const [notes, setNotes] = React.useState([]);

  React.useLayoutEffect(() => {
    if (name) fetchNotes();
  }, [name]);

  const notesColumn = [
    {
      title: "Topic",
      dataIndex: "s_topic",
      key: "s_topic",
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (_id) => {
        return (
          <div className="d-flex gap-2">
            <Link className="btn btn-primary" to={_id}>View</Link>
            <button className="btn btn-danger" onClick={() => deleteANote(_id)}>
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="contact" class="contact section-bg">
        <div class="container">
          <div class="section-title">
            <h2>Add Project Language {name}</h2>
          </div>
          <Table dataSource={notes} columns={notesColumn} />
        </div>
      </section>
    </div>
  );

  async function fetchNotes() {
    try {
      const response = await axios.get(`${SERVER}/api/subject-notes/${name}`);
      if (response.data.success) {
        setNotes(response.data.notes);
      }
    } catch (error) {
      handleModel(
        <p className="text-danger">Failed to fetch the data try later</p>
      );
    }
  }

  async function deleteANote(id) {
    if (window.confirm("Do you want to delete?")) {
      try {
        const response = await axios.delete(
          `${SERVER}/api/subject-notes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          handleModel(
            <p className="text-success">
              {response?.data?.message || "Note is successfully deleted."}
            </p>
          );
          fetchNotes();
        }
      } catch (error) {
        handleModel(
          <p className="text-danger">
            {error?.response?.data?.message ||
              "Failed to delete the note, please try later.  "}
          </p>
        );
      }
    }
  }
};

export default OpenSubjectSelected;
