import React, { useEffect, useState } from "react";
import "../css/Count.css";

function Count() {
  const [count, setCount] = useState(0);
  const [visitors, setVisitors] = useState(0);

  useEffect(() => {
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

  useEffect(() => {
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

  useEffect(() => {
    // Clear the flag after 10 seconds
    setTimeout(() => {
      localStorage.removeItem("postRequestSent");
    }, 10000);
  }, []); // Empty dependency array to run the effect only once on page load

  return (
    <div>
      <section id="counts" className="counts">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-6">
              <div className="count-box">
                <i className="fa fa-eye"></i>
                <span>{visitors}</span>
                <p>Number of visitors</p>
              </div>
            </div>

            <div className="col-lg-3 col-6">
              <div className="count-box">
                <i className="fa fa-file-text"></i>
                <span>{count}</span>
                <p>Papers</p>
              </div>
            </div>

            <div className="col-lg-3 col-6 mt-5 mt-lg-0">
              <div className="count-box">
                <i className="fa fa-headset"></i>
                <span>24/7</span>
                <p>Hours Of Support</p>
              </div>
            </div>

            <div className="col-lg-3 col-6 mt-5 mt-lg-0">
              <div className="count-box">
                <i className="fa fa-user"></i>
                <span>02</span>
                <p>Developers</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Count;
