import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { SERVER } from "../../../context/config";
import { LoginContext } from "../../../context/LoginContext";

function UnverifiedNotes() {
  const [unverifiedNotes, setUnverifiedNotes] = useState([]);
  const { token } = React.useContext(LoginContext);

  useEffect(() => {
    fetchUnverifiedNotes();
  }, []);

  const fetchUnverifiedNotes = async () => {
    try {
      const response = await Axios.get(
        `${SERVER}/api/subject-notes/unverified`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUnverifiedNotes(response.data);
    } catch (error) {
      console.error("Error fetching unverified notes:", error);
    }
  };

  return (
    <div className="row">
      {unverifiedNotes?.map((note) => (
        <div key={note._id} className="col-md-3">
          <div className="card p-2">
            <iframe
              src={note.f_path}
              height={"300px"}
              width={"100%"}
              title={note.s_name}
            />
            <p>{note.s_name}</p>
            <p>{note.s_topic}</p>
            <div className="d-flex justify-content-around">
              <Link
                className="btn btn-success"
                to={`/admin/unverified/subject/${note._id}`}
              >
                Verify
              </Link>
              <button className="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UnverifiedNotes;
