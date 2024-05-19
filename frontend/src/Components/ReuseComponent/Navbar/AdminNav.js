import React, { useContext, useEffect, useState } from "react";
import { Nav, NavDropdown, Navbar } from "react-bootstrap"; 
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../../../context/LoginContext";

function AdminNav() {
  const { setUserLogin } = useContext(LoginContext);
  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); 

  useEffect(() => {
    if (!token) navigate("/");
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
      title: "Question Paper",
      items: [
        { label: "Add Question Paper", to: "/admin/upload" },
        { label: "Add&View College/University", to: "/admin/add/type" },
        { label: "Add&View Course", to: "/admin/add/course" },
        { label: "Update Paper", to: "/admin/course" },
      ],
    },
    {
      title: "Project",
      items: [
        { label: "Projects List", to: "/admin/edit/project" },
        { label: "Add New Project", to: "/admin/add/project" },
        {
          label: "Add&View Project Language",
          to: "/admin/add/project/language",
        },
      ],
    },
    {
      title: "Notes",
      items: [
        { label: "Add Notes", to: "/admin/add/notes" },
        { label: "Add&View Subject", to: "/admin/add/subject" },
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
      <Navbar.Brand
        as={Link}
        to="/"
        className=" text-white"
        style={{ fontSize: "30px" }}
      >
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
