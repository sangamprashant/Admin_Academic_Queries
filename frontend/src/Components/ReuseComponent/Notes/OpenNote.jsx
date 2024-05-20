import React from "react";
import { useParams } from "react-router-dom";
import { LoginContext } from "../../../context/LoginContext";
import axios from "axios";
import { SERVER } from "../../../context/config";

const OpenNote = () => {
  const { id } = useParams();
  const { handleModel } = React.useContext(LoginContext);
  const [data, setData] = React.useState(null);

  React.useLayoutEffect(() => {
    if (id) fetchData();
  }, [id]);

  return (
    <div style={{ paddingTop: "70px" }}>
      {data && (
        <section id="contact" class="contact section-bg">
          <div class="container">
            <div class="section-title">
              <h2>Notes of: {data.s_topic}</h2>
              <p className="p-0 m-0">Subject: {data.s_name}</p>
            </div>
            <iframe
              src={data.f_path}
              width="100%"
              height="500px"
              title="Subject Notes"
            />
          </div>
        </section>
      )}
    </div>
  );

  async function fetchData() {
    try {
      const response = await axios.get(`${SERVER}/api/subjects-note/${id}`);
      if (response?.status === 200) {
        setData(response?.data);
      }
    } catch (error) {
      handleModel(
        <p className="text-danger">
          {error?.response?.data?.error || "Failed to fetch the note."}
        </p>
      );
    }
  }
};

export default OpenNote;
