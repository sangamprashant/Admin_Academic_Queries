import React, { useContext, useEffect, useState } from "react";
import Count from "./ReuseComponent/Count/Count";
function Admin() {
  return (
    <div style={{ paddingTop: "100px" }}>
      <Count />
    </div>
  );
}

export default Admin;
