import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SERVER } from "../../../context/config";
import { LoginContext } from "../../../context/LoginContext";

function TokenVerification() {
  const { token } = useParams(); // Extract token from URL parameters
  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [password, setPassword] = useState("");
  const { handleModel } = React.useContext(LoginContext);

  React.useLayoutEffect(() => {
    if (token) verifyToken();
  }, [token]);

  return (
    <div style={{ marginTop: "70px" }}>
      <section id="contact" className="contact section-bg">
        <div className="container">
          <div className="section-title">
            <h2>Forgot Password</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-5">
              <form role="form" className="signin">
                {loading ? (
                  <div className="text-center text-white loading">
                    Loading...
                  </div>
                ) : tokenValid ? (
                  <>
                    <div className="form-group mt-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="text-center">
                      <button type="button" onClick={handlePasswordReset}>
                        Reset Password
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-white">
                    Invalid or expired token
                  </div>
                )}

                <Link to="/" className="forgot_password">
                  Back To SignIn
                </Link>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  async function verifyToken() {
    try {
      setTokenValid(false);
      const response = await fetch(`${SERVER}/api/verify-token/${token}`);
      const data = await response.json();
      if (data.valid) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
      }
    } catch (error) {
      handleModel(
        <p className="text-danger">
          {error?.response?.data?.error || "Failed to verify token"}
        </p>
      );
      setTokenValid(false);
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset() {
    if (password.trim()) {
      try {
        const response = await fetch(`${SERVER}/api/reset-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword: password }),
        });
        const data = await response.json();

        if (data.success) {
          handleModel(
            <p className="text-success">Password reset successfully</p>
          );
          setPassword("");
        } else {
          handleModel(
            <p className="text-danger">
              {data.error || "Failed to reset password"}
            </p>
          );
        }
      } catch (error) {
        handleModel(
          <p className="text-danger">
            An error occurred while resetting the password
          </p>
        );
      }
    } else {
      handleModel(<p className="text-danger">Please enter a new password</p>);
    }
  }
}

export default TokenVerification;
