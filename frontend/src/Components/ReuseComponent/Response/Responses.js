import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../../context/LoginContext";
import { Tabs } from "antd";
import ResponseMessage from "./ResponseMessage";
import ResponsePaper from "./ResponsePaper";
import UnverifiedNotes from "./UnverifiedNotes";

function Responses() {
  const { token } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/");
  }, [navigate, token]);

  const responseItem = [
    {
      label: `Message`,
      key: "0",
      children: <ResponseMessage />,
    },
    {
      label: `Paper`,
      key: "1",
      children: <ResponsePaper />,
    },
    {
      label: `Notes`,
      key: "2",
      children: <UnverifiedNotes />,
    },
  ];

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="portfolio" className="portfolio">
        <div className="container">
          <div className="section-title">
            <h2>Response</h2>
          </div>

          <Tabs defaultActiveKey="0" centered items={responseItem} />
        </div>
      </section>
    </div>
  );
}

export default Responses;
