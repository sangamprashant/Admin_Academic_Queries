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
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [passwordPart, setPasswordPart] = useState(false);
  const [passwordFromDataBase, setPasswordFromDatabase] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [rePasswordError, setRePasswordError] = useState(false);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);

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
            setPasswordFromDatabase(data.otp);
            setEnterOtp(true);
          } else {
            notifyA(data.error);
            setEnterOtp(false);
          }
        });
    }
  };

  const verifyOtp = () => {
    if (incorrectAttempts >= 2) {
      // Reload the page after three incorrect attempts
      window.location.reload();
      return;
    }

    if (passwordFromDataBase === Number(inputOtp)) {
      // When OTP matches
      setPasswordPart(true);
    } else {
      setOtpError(true);
      setIncorrectAttempts(incorrectAttempts + 1);
    }
  };

  const passwordReset = () => {
    if (password === rePassword) {
      // Sending data to server
      fetch(`${process.env.REACT_APP_GLOBAL_LINK}/api/admin/backend/reset-password`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          newPassword: password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            notifyB(data.message);
            navigate("/");
          } else {
            notifyA(data.error);
          }
        });
    } else {
      setRePasswordError(true);
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
                {!passwordPart ? (
                  <>
                    <>
                      <div class="form-group mt-3">
                        <input
                          type="email"
                          class="form-control"
                          placeholder="Email"
                          value={email}
                          readOnly={`${!enterOtp ? "" : "readonly"}`}
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                        />
                      </div>
                      {emailError && (
                        <p style={{ color: "red" }}>Enter your email..</p>
                      )}
                    </>
                    {incorrectAttempts >= 2 && (
                      <p style={{ color: "red" }}>
                        You have reached the maximum number of attempts. Please
                        reload the page.
                      </p>
                    )}

                    {enterOtp && incorrectAttempts < 2 && (
                      <>
                        <div class="form-group mt-3">
                          <input
                            type="number"
                            class="form-control"
                            placeholder="Otp"
                            value={inputOtp}
                            onChange={(e) => {
                              setInputOtp(e.target.value);
                            }}
                          />
                        </div>
                        {otpError && (
                          <p style={{ color: "red" }}>
                            Wrong OTP, Please check your email..
                          </p>
                        )}
                      </>
                    )}
                    {!enterOtp ? (
                      <div class="text-center">
                        <button
                          type="button"
                          onClick={() => {
                            getOtp();
                          }}
                        >
                          Generate otp
                        </button>
                      </div>
                    ) : (
                      <div class="text-center">
                        <button
                          type="button"
                          onClick={() => {
                            verifyOtp();
                          }}
                        >
                          Verify
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div class="form-group mt-3">
                      <input
                        type="password"
                        class="form-control"
                        placeholder="New password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                    </div>
                    <div class="form-group mt-3">
                      <input
                        type="password"
                        class="form-control"
                        placeholder="Re-enter"
                        value={rePassword}
                        onChange={(e) => {
                          setRePassword(e.target.value);
                        }}
                      />
                    </div>
                    {rePasswordError && (
                      <p style={{ color: "red" }}>Password did not match..</p>
                    )}
                    <div class="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          passwordReset();
                        }}
                      >
                        Set New Password
                      </button>
                    </div>
                  </>
                )}
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
