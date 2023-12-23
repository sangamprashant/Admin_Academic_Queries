import React, { useState, useEffect } from "react";
import "../css/Signin.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function ForgotPassword() {
  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [inputOtp, setInputOtp] = useState();
  const [enterOtp, setEnterOtp] = useState(false);
  const [emailError, setEmailError] = useState(false);

  //get otp
  const getOtp = () => {
    if (!email) {
      setEmailError(true);
    } else {
      // Sending data to server
      fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/check/email`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            notifyB(data.message);
          } else {
            notifyA(data.error);
          }
        });
    }
  };

  return (
    <div style={{ marginTop: "70px" }}>
      <section id="contact" class="contact section-bg">
        <div class="container">
          <div class="section-title">
            <h2>Forgot password</h2>
          </div>
          <div class="row mt-5 justify-content-center">
            <div class="col-lg-5 ">
              <form role="form" class="signin">
                <div class="form-group mt-3">
                  <input
                    type="email"
                    class="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                {emailError && (
                  <p style={{ color: "red" }}>Enter your email..</p>
                )}

                <div class="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      getOtp();
                    }}
                  >
                    Verify Email
                  </button>
                </div>

                <Link to="/" className="forgot_password">
                  SignIn
                </Link>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ForgotPassword;
