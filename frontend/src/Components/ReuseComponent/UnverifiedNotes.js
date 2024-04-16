import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function UnverifiedNotes() {
  const [unverifiedNotes, setUnverifiedNotes] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch unverified notes when the component mounts
    fetchUnverifiedNotes();
  }, []);

  const fetchUnverifiedNotes = async () => {
    try {
      const response = await Axios.get(`${process.env.REACT_APP_GLOBAL_LINK}/api/subject-notes/unverified`,{
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
      });
      setUnverifiedNotes(response.data);
    } catch (error) {
      console.error("Error fetching unverified notes:", error);
    }
  };

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="contact" className="contact section-bg">
        <div className="container">
          <div className="section-title">
            <h2>Unverified Notes</h2>
            <p>Format should be in IMG/PNG!</p>
          </div>
          <div className="row">
            {unverifiedNotes?.map((note) => (
              <div key={note._id} className="col-md-3">
                <div className="card p-2">
                  <iframe src={note.f_path} height={"300px"} width={"100%"} />
                  <p>{note.s_name}</p>
                  <p>{note.s_topic}</p>
                  <div className="d-flex justify-content-around">
                    <button className="btn btn-success" onClick={()=>{navigate(`/admin/unverified/subject/${note._id}`)}}>Verify</button>
                    <button className="btn btn-danger">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default UnverifiedNotes;
