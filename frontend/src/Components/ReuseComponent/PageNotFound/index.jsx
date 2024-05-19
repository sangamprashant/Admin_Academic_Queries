import { Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <Result
      status="404"
      title="404"
      style={{ paddingTop: "100px" }}
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Link className="btn btn-primary" to="/">
          Back Home
        </Link>
      }
    />
  );
};

export default PageNotFound;
