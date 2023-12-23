import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";
import { Navbar, Nav, NavDropdown } from "react-bootstrap"; // Import Bootstrap components

function AdminNav() {
  const { setUserLogin } = useContext(LoginContext);
  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // State to manage the Navbar's collapse state

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  });

  const handleLogout = () => {
    localStorage.clear();
    setUserLogin(false);
    navigate("/");
    window.location.reload()
  };

  return (
    <Navbar bg="dark" expand="lg" variant="dark" className=" position-fixed w-100 z-3 px-4">
      <Navbar.Brand as={Link} to="/" style={{ color: "white" }}>
        Academic Quries
      </Navbar.Brand>
      <Navbar.Toggle
        onClick={() => setIsOpen(!isOpen)} // Toggle Navbar when clicked
        aria-controls="admin-navbar"
      />
      <Navbar.Collapse id="admin-navbar" className="justify-content-evenly">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/admin/upload" style={{ color: "white" }}>
            Add Paper
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/add/type" style={{ color: "white" }}>
            Add College/University
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/add/course" style={{ color: "white" }}>
            Add Course
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/course" style={{ color: "white" }}>
            Update Paper
          </Nav.Link>
          <Nav.Link as={Link} to="/responses" style={{ color: "white" }}>
            Responses
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/add/project" style={{ color: "white" }}>
            Add Projects
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/edit/project" style={{ color: "white" }}>
            Edit Projects
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/add/project/language" style={{ color: "white" }}>
            Add Project Language
          </Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link
            onClick={() => {
              handleLogout();
            }}
            style={{ color: "red" }}
          >
            Logout
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AdminNav;
