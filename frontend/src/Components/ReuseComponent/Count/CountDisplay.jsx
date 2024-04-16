import React from "react";

function CountDisplay({ icon, number, title }) {
  return (
    <div className="col-lg-6 col-6 mt-5 mt-2">
      <div className="count-box">
        <i className={`fa fa-${icon}`}></i>
        <span>{number}</span>
        <p>{title}</p>
      </div>
    </div>
  );
}

export default CountDisplay;
