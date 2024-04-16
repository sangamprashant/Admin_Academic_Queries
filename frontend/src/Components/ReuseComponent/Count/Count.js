import React, { useEffect, useState } from "react";
import "../../css/Count.css";
import CountDisplay from "./CountDisplay";

function Count() {
  const [count, setCount] = useState(0);
  const [visitors, setVisitors] = useState(0);

  React.useLayoutEffect(() => {
    // Fetch the count of valid question papers
    fetch(
      `${process.env.REACT_APP_GLOBAL_LINK}/api/count/valid-question-papers`
    )
      .then((response) => response.json())
      .then((data) => {
        setCount(data.count);
      })
      .catch((error) => {
        console.error("Failed to fetch count of valid question papers:", error);
      });

    // Check if the POST request has already been sent using local storage
    const postRequestSent = localStorage.getItem("postRequestSent");
    if (!postRequestSent) {
      // Send the visitor count to the backend
      fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/increment/visitors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setVisitors(data.count);
          // Set the flag in local storage to prevent further POST requests
          localStorage.setItem("postRequestSent", "true");
        })
        .catch((error) => {
          console.error("Failed to save visitor count to the backend:", error);
        });
    }
  }, []); // Empty dependency array to run the effect only once on page load

  React.useLayoutEffect(() => {
    // Fetch the count of visitors
    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/count/visitors`)
      .then((response) => response.json())
      .then((data) => {
        setVisitors(data.count);
      })
      .catch((error) => {
        console.error("Failed to fetch count of visitors:", error);
      });
  }, []);

  return (
    <div>
      <section id="counts" className="counts">
        <div className="container">
          <div className="row">
            <CountDisplay icon="eye" number={visitors} title="Number of visitors" />
            <CountDisplay icon="file-text" number={count} title="Papers" />
            <CountDisplay icon="headset" number="24/7" title="Hours Of Support" />
            <CountDisplay icon="user" number={2} title="Developers" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Count;
