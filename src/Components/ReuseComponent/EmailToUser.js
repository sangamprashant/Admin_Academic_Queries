import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/Contact.css";
import AdminNav from "./AdminNav";

function EmailToUser() {
  const { emailId } = useParams(); // Get the email ID from URL parameters
  const [emailContent, setEmailContent] = useState();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Fetch the email content based on the email ID
    const fetchEmailContent = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/get/contact/${emailId}`);
        const data = await response.json();
        setEmailContent(data);
      } catch (error) {
        console.error("Failed to fetch email content:", error);
      }
    };

    fetchEmailContent();
  }, [emailId]);

  const handleSendEmail = () => {
    if (!message) {
      setErrorMessage("Please enter a response message.");
      return;
    }

    setLoading(true);

    const requestBody = {
      response: message,
      subject: `Response to - ${emailContent?.subject}`,
    };

    fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/reply/${emailId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data._id) {
          setSuccessMessage("Your response has been sent successfully.");
          setMessage("");
          setErrorMessage("");
        } else {
          setErrorMessage("Failed to send the response. Please try again later.");
        }
      })
      .catch((error) => {
        setLoading(false);
        setErrorMessage("Failed to send the response. Please try again later.");
        console.error("Failed to send the response:", error);
      });
  };

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="contact" className="contact section-bg">
        <div className="container">
          <div className="section-title">
            <h2>Message response</h2>
            <p>{emailContent?.message}</p>
          </div>

          <div className="row mt-5 justify-content-center">
            <div className="col-lg-10">
              <form role="form" className="php-email-form">
                <div className="row">
                  <div className="col-md-6 form-group">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      id="name"
                      placeholder="Your Name"
                      required
                      value={emailContent?.name}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 form-group mt-3 mt-md-0">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      id="email"
                      placeholder="Your Email"
                      required
                      value={emailContent?.email}
                      disabled
                    />
                  </div>
                </div>
                <div className="form-group mt-3">
                  <input
                    type="text"
                    className="form-control"
                    name="subject"
                    id="subject"
                    placeholder="Subject"
                    required
                    value={`Response to - ${emailContent?.subject}`}
                    disabled
                  />
                </div>
                <div className="form-group mt-3">
                  <textarea
                    className="form-control"
                    name="message"
                    rows="5"
                    placeholder="Message"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
                <div className="my-3">
                  {loading && <div className="loading">Loading</div>}
                  {errorMessage && <div className="error-message">{errorMessage}</div>}
                  {successMessage && <div className="sent-message">{successMessage}</div>}
                </div>
                <div className="text-center">
                  <button type="button" onClick={handleSendEmail}>
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EmailToUser;
