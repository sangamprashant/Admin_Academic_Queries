import React from "react";
import { Link } from "react-router-dom";
import { LoginContext } from "../../../context/LoginContext";
import { SERVER } from "../../../context/config";
import "../../css/Signin.css";
function ForgotPassword() {
  const { handleModel } = React.useContext(LoginContext);
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");

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

                <div class="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      getOtp();
                    }}
                  >
                    {loading ? "Please wait" : "Get Verification Link"}
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

  function getOtp() {
    if (!email.trim()) {
      handleModel(<p className="text-denger">Please enter a email.</p>);
    } else {
      setLoading(true);
      fetch(`${SERVER}/api/check/email`, {
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
            handleModel(<p className="text-success">{data.message}</p>);
          } else {
            handleModel(<p className="text-denger">{data.error}</p>);
          }
        })
        .catch((error) => {
          handleModel(
            <p className="text-denger">
              {error?.response?.data.error || "Something went wrong"}
            </p>
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }
}

export default ForgotPassword;
