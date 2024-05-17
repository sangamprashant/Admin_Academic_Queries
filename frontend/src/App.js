import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginContext } from "./context/LoginContext";
import UploadPaper from "./Components/UploadPaper";
import Signin from "./Components/Signin";
import Responses from "./Components/Responses";
import Admin from "./Components/Admin";
import AddType from "./Components/ReuseComponent/AddType";
import AddCourse from "./Components/ReuseComponent/AddCourse";
import GetPaperToAdmin from "./Components/ReuseComponent/GetPaperToAdmin";
import EmailToUser from "./Components/ReuseComponent/EmailToUser";
import AdminCourse from "./Components/ReuseComponent/AdminCourse";
import AdminPaper from "./Components/ReuseComponent/AdminPaper";
import AdminEditPaper from "./Components/ReuseComponent/AdminEditPaper";
import ForgotPassword from "./Components/ReuseComponent/ForgotPassword";
import AddProjectLanguage from "./Components/ReuseComponent/AddProjectLanguage";
import AddProject from "./Components/ReuseComponent/AddProject";
import AdminProjectHome from "./Components/ReuseComponent/AdminProjectHome";
import AdminProjectLanguageSelected from "./Components/ReuseComponent/AdminProjectLanguageSelected";
import TokenVerifification from "./Components/ReuseComponent/TokenVerifification";
import AddSubject from "./Components/ReuseComponent/AddSubject";
import UnverifiedNotes from "./Components/ReuseComponent/UnverifiedNotes";
import VerifyNotes from "./Components/ReuseComponent/VerifyNotes";
import AdminNav from "./Components/ReuseComponent/Navbar/AdminNav";
import AddNotes from "./Components/ReuseComponent/Notes/AddNotes";
import { Modal } from "antd";

function App() {
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen,setModalOpen] = React.useState(false)
  const [modelContent,setModelContent] = React.useState(null)
  const token = localStorage.getItem("jwt");
  return (
    <BrowserRouter>
      <LoginContext.Provider value={{ setUserLogin,token, handleModel }}>
        {token || userLogin ? (
          <>
            <AdminNav login={userLogin} />
            <Routes>
              <Route exact path="/" element={<Admin />}/>
              <Route exact path="/admin/upload" element={<UploadPaper/>}/>
              <Route exact path="/admin/add/type" element={<AddType />}/>
              <Route exact path="/admin/add/course" element={<AddCourse />}/>
              <Route exact path="/admin/course" element={<AdminCourse />}/>
              <Route exact path="/responses" element={<Responses/>}/>
              <Route exact path="/admin/add/project" element={<AddProject/>}/>
              <Route exact path="/admin/edit/project" element={<AdminProjectHome/>}/>
              <Route exact path="/admin/add/project/language" element={<AddProjectLanguage/>}/>
              <Route exact path="/course/to/update/:branch/:course" element={<AdminPaper />}/>
              <Route exact path="/admin/modify/correction/:paperId" element={<AdminEditPaper />}/>
              <Route exact path="/admin/modify/:paperId" element={<GetPaperToAdmin />}/>
              <Route exact path="/admin/response/email/:emailId" element={<EmailToUser />}/>
              <Route exact path="/admin/projects/:language" element={<AdminProjectLanguageSelected/>}/>
              <Route exact path="/admin/add/subject" element={<AddSubject/>}/>
              <Route exact path="/admin/unverified/subject" element={<UnverifiedNotes/>}/>
              <Route exact path="/admin/add/notes" element={<AddNotes/>}/>
              <Route exact path="/admin/unverified/subject/:id" element={<VerifyNotes/>}/>
            </Routes>
          </>
        ) : (
          <Routes>
            <Route exact path="/" element={<Signin/>}/>
            <Route exact path="/forgot/password" element={<ForgotPassword />}/>
            <Route exact path="/verify/:token" element={<TokenVerifification />}/>
          </Routes>
        )}
        <ToastContainer theme="dark" />
        <Modal
          title="20px to Top"
          // style={{ top: 50 }}
          centered
          open={modalOpen}
          onOk={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
        >
          {modelContent}
      </Modal>
      </LoginContext.Provider>
    </BrowserRouter>
  );

  function handleModel(content) {
    setModalOpen(true)
    setModelContent(content)
  }

}

export default App;
