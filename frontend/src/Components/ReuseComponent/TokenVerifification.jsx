import React from 'react'
import { Link } from 'react-router-dom'

function TokenVerifification() {
  return (
    <div style={{ marginTop: "70px" }}>
    <section id="contact" class="contact section-bg">
      <div class="container">
        <div class="section-title">
          <h2>"Please wait..":"Forgot password"</h2>
        </div>
        {/* <div class="row mt-5 justify-content-center">
          <div class="col-lg-5 ">
            <form role="form" class="signin">
              <div class="form-group mt-3">
                <input
                  type="email"
                  class="form-control"
                  placeholder="Email"
                //   value={email}
                //   onChange={(e) => {
                //     setEmail(e.target.value);
                //   }}
                />
              </div>
     

              <div class="text-center">
                <button
                  type="button"
                //   onClick={() => {
                //     getOtp();
                //   }}
                >
                  Verify Email
                </button>
              </div>

              <Link to="/" className="forgot_password">
                SignIn
              </Link>
            </form>
          </div>
        </div> */}
      </div>
    </section>
  </div>
  )
}

export default TokenVerifification
