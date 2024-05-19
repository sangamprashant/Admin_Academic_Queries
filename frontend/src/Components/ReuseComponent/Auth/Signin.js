import React, { useState, useContext, useEffect } from "react";
import "../../css/Signin.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginContext } from "../../../context/LoginContext";
import { SERVER } from "../../../context/config";
function Signin() {
  const { setUserLogin, token, handleModel } = useContext(LoginContext);
  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState();

  useEffect(() => {
    if (token) navigate("/");
  });

  return (
    <div style={{ marginTop: "70px" }}>
      <section id="contact" class="contact section-bg">
        <div class="container">
          <div class="section-title">
            <h2>SignIn</h2>
          </div>

          <div class="row mt-5 justify-content-center">
            <div class="col-lg-5 ">
              <form role="form" class="signin">
                <div class="form-group mt-3">
                  <input
                    class="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div class="form-group mt-3">
                  <input
                    class="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
                <div class="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      postData();
                    }}
                  >
                    SignIn
                  </button>
                </div>
                <Link to="/forgot/password" className="forgot_password">
                  Forgot Password?
                </Link>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
  function postData() {
    fetch(`${SERVER}/api/signin`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          notifyB(data.message);
          setUserLogin(true);
          navigate("/");
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          notifyA(data.error);
        }
        console.log(data);
      });
  }
}

export default Signin;
