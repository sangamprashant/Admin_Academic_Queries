import React, { useContext, useEffect, useState } from "react";
import Count from "./ReuseComponent/Count/Count";
function Admin() {
  return (
    <div style={{ paddingTop: "70px" }}>
      <section id="contact" class="contact section-bg">
        <div class="container">
          <div class="section-title">
            <h2>Admin Dashboard</h2>
          </div>
          <Count />
        </div>
      </section>
    </div>
  );
}

export default Admin;
