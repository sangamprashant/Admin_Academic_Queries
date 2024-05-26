import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginContext } from "./context/LoginContext";
import UploadPaper from "./Components/ReuseComponent/QuestionPaper/UploadPaper";
import Signin from "./Components/ReuseComponent/Auth/Signin";
import Responses from "./Components/ReuseComponent/Response/Responses";
import Admin from "./Components/ReuseComponent/Count/Admin";
import AddType from "./Components/ReuseComponent/QuestionPaper/AddCollegeUni";
import AddCourse from "./Components/ReuseComponent/QuestionPaper/AddCourse";
import GetPaperToAdmin from "./Components/ReuseComponent/Response/GetPaperToAdmin";
import EmailToUser from "./Components/ReuseComponent/Response/EmailToUser";
import AdminCourse from "./Components/ReuseComponent/QuestionPaper/AdminCourse";
import AdminPaper from "./Components/ReuseComponent/QuestionPaper/AdminPaperList";
import AdminEditPaper from "./Components/ReuseComponent/QuestionPaper/AdminEditPaper";
import ForgotPassword from "./Components/ReuseComponent/Auth/ForgotPassword";
import AddProject from "./Components/ReuseComponent/Project/AddProject";
import AdminProjectLanguageSelected from "./Components/ReuseComponent/Project/AdminProjectLanguageSelected";
import TokenVerifification from "./Components/ReuseComponent/Auth/TokenVerifification";
import AddSubject from "./Components/ReuseComponent/Notes/AddSubject";
import VerifyNotes from "./Components/ReuseComponent/Response/VerifyNotes";
import AdminNav from "./Components/ReuseComponent/Navbar/AdminNav";
import AddNotes from "./Components/ReuseComponent/Notes/AddNotes";
import { Modal } from "antd";
import AdminProjectHome from "./Components/ReuseComponent/Project/AdminProjectHome";
import AddProjectLanguage from "./Components/ReuseComponent/Project/AddProjectLanguage";
import PageNotFound from "./Components/ReuseComponent/PageNotFound";
import OpenSubjectSelected from "./Components/ReuseComponent/Notes/OpenSubjectSelected";
import OpenNote from "./Components/ReuseComponent/Notes/OpenNote";
import Applink from "./Components/ReuseComponent/AppLink";

function App() {
  const [userLogin, setUserLogin] = useState(localStorage.getItem("jwt")? true:false);
  const [modalOpen,setModalOpen] = React.useState(false)
  const [modelContent,setModelContent] = React.useState(null)
  const token = localStorage.getItem("jwt");
  return (
    <BrowserRouter>
      <LoginContext.Provider value={{ setUserLogin,token, handleModel }}>
        {userLogin ? (
          <>
            <AdminNav login={userLogin} />
            <Routes>
              <Route exact path="/" element={<Admin />}/>
              <Route exact path="/admin/upload" element={<UploadPaper/>}/>
              <Route exact path="/admin/add/type" element={<AddType />}/>              
              <Route exact path="/admin/add/course" element={<AddCourse />}/>
              <Route exact path="/admin/course" element={<AdminCourse />}/>
              <Route exact path="/course/to/update/:branch/:course" element={<AdminPaper />}/>
              <Route exact path="/responses" element={<Responses/>}/>
              <Route exact path="/admin/response/email/:emailId" element={<EmailToUser />}/>
              <Route exact path="/admin/add/project" element={<AddProject/>}/>
              <Route exact path="/admin/edit/project" element={<AdminProjectHome/>}/>
              <Route exact path="/admin/add/project/language" element={<AddProjectLanguage/>}/>
              <Route exact path="/admin/modify/correction/:paperId" element={<AdminEditPaper />}/>
              <Route exact path="/admin/modify/:paperId" element={<GetPaperToAdmin />}/>
              <Route exact path="/admin/projects/:language" element={<AdminProjectLanguageSelected/>}/>
              <Route exact path="/admin/add/subject" element={<AddSubject/>}/>
              <Route exact path="/admin/unverified/subject/:id" element={<VerifyNotes/>}/>
              <Route exact path="/admin/add/notes" element={<AddNotes/>}/>
              <Route exact path="/admin/view/notes/:name" element={<OpenSubjectSelected/>}/>
              <Route exact path="/admin/view/notes/:name/:id" element={<OpenNote/>}/>
              <Route exact path="/admin/app-links" element={<Applink/>}/>

              <Route exact path="*" element={<PageNotFound/>}/>
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
          title="Academic Queries"
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
