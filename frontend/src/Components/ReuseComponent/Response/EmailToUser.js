import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/Contact.css";
import { SERVER } from "../../../context/config";
import { LoginContext } from "../../../context/LoginContext";

function EmailToUser() {
  const { emailId } = useParams(); // Get the email ID from URL parameters
  const { handleModel, token } = React.useContext(LoginContext);
  const [emailContent, setEmailContent] = useState();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    if (emailId) fetchEmailContent();
  }, [emailId]);

  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="contact" className="contact section-bg">
        <div className="container">
          <div className="section-title">
            <h2>Write a response</h2>
          </div>

          <div className="row justify-content-center">
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
                  <textarea
                    className="form-control"
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
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={loading}
                  >
                    {loading ? "Loading" : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  async function fetchEmailContent() {
    try {
      const response = await fetch(`${SERVER}/api/get/contact/${emailId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setEmailContent(data);
    } catch (error) {
      console.error("Failed to fetch email content:", error);
    }
  }

  function handleSendEmail() {
    if (!message) {
      return handleModel(
        <p className="text-danger">Please enter a response message.</p>
      );
    }

    setLoading(true);

    const requestBody = {
      response: message,
      subject: `Response to - ${emailContent?.subject}`,
    };

    fetch(`${SERVER}/api/reply/${emailId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data._id) {
          setMessage("");
          handleModel(
            <p className="text-danger">
              Your response has been sent successfully.
            </p>
          );
          navigate("/responses")
        } else {
          handleModel(
            <p className="text-danger">
              Failed to send the response. Please try again later.
            </p>
          );
        }
      })
      .catch((error) => {
        setLoading(false);
        handleModel(
          <p className="text-danger">
            Failed to send the response. Please try again later.
          </p>
        );
        // console.error("Failed to send the response:", error);
      });
  }
}

export default EmailToUser;
