import React from "react";
import { SERVER } from "../../../context/config";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "antd";
import { LoginContext } from "../../../context/LoginContext";

const ResponseMessage = () => {
  const { token } = React.useContext(LoginContext);
  const [messages, setMessages] = React.useState([]);

  React.useLayoutEffect(() => {
    fetchMessages();
  }, []);

  const tableContent = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (_id) => {
        return (
          <Link className="btn btn-primary" to={`/admin/response/email/${_id}`}>
            View
          </Link>
        );
      },
    },
  ];

  return (
    <div className="card-columns">
      <Table columns={tableContent} dataSource={messages} />
    </div>
  );

  function fetchMessages() {
    // Fetch messages from the server
    fetch(`${SERVER}/api/get/contact`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => {
        console.error("Failed to fetch messages:", error);
      });
  }
};

export default ResponseMessage;
