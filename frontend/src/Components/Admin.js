import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import AdminNav from "./ReuseComponent/AdminNav";
import Count from "./ReuseComponent/Count/Count";
function Admin() {
  return (
    <div style={{ paddingTop: "100px" }}>
      <Count />
    </div>
  );
}

export default Admin;
