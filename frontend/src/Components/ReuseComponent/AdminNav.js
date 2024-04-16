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
    window.location.reload();
  };

  const dropdownData = [
    {
      title: "Responses",
      items: [{ label: "Responses", to: "/responses" }],
    },
    {
      title: "Paper",
      items: [
        { label: "Add Paper", to: "/admin/upload" },
        { label: "Add College/University", to: "/admin/add/type" },
        { label: "Add Course", to: "/admin/add/course" },
        { label: "Update Paper", to: "/admin/course" },
      ],
    },
    {
      title: "Course",
      items: [
        { label: "Add Projects", to: "/admin/add/project" },
        { label: "Edit Projects", to: "/admin/edit/project" },
        { label: "Add Project Language", to: "/admin/add/project/language" },
      ],
    },
    {
      title: "Subject",
      items: [
        { label: "Add Subject", to: "/admin/add/subject" },
        { label: "Unverified Subject", to: "/admin/unverified/subject" },
      ],
    },
  ];

  return (
    <Navbar
      bg="dark"
      expand="lg"
      variant="dark"
      className=" position-fixed w-100 z-3 px-4"
    >
      <Navbar.Brand as={Link} to="/" className=" text-white" style={{fontSize:"30px"}}> 
        Academic Queries
      </Navbar.Brand>
      <Navbar.Toggle
        onClick={() => setIsOpen(!isOpen)} // Toggle Navbar when clicked
        aria-controls="admin-navbar"
      />
      <Navbar.Collapse id="admin-navbar" className="justify-content-end">
        <Nav className="mr-auto">
          {dropdownData.map((dropdown, index) => (
            <NavDropdown
              title={dropdown.title}
              id={`dropdown-${index}`}
              key={index}
            >
              {dropdown.items.map((item, idx) => (
                <NavDropdown.Item as={Link} to={item.to} key={idx}>
                  {item.label}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          ))}
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
