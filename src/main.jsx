import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Profile from "./components/Header/Profile.jsx";
import Home from "./components/Home/Home.jsx";
import SignUp from "./components/Form/SignUp.jsx";
import Login from "./components/Form/Login.jsx";
import App from "./App.jsx";
import Teachers, { teacherData } from "./components/Teacher/Teachers.jsx";
import Show, { teacherLoader } from "./components/Teacher/Show.jsx";
import Edit from "./components/Teacher/edit.jsx";
import AuthCheck, { authLoader } from "./components/Form/Authcheck.jsx";
import { AuthProvider } from "./components/Header/AuthContext.jsx";
import VideoMeet from "./components/Video/VideoMeet.jsx";
import CreateMeeting from "./components/Teacher/CreateMeeting.jsx";
import History from "./components/Teacher/History.jsx";
import BookSession from "./components/Teacher/BookSession.jsx";
import  TeacherHistory  from "./components/Teacher/TeacherHistory.jsx";
import UserHistory from "./components/Teacher/UserHistory.jsx";
import PaymentPage from "./components/Teacher/PaymentPage.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/beteacher" element={<AuthCheck />} loader={authLoader} />
      <Route path="/CreateMeeting" element={<CreateMeeting/>} />
      <Route path="/history" element={<History/>}/>
      <Route path="/teachers/:id/booksession" element={<BookSession />} />
      <Route loader={teacherData} path="teachers" element={<Teachers />} />
      <Route path="/teacher-history/:teacherId" element={<TeacherHistory />} />
      <Route path="/user-history/:userId" element={<UserHistory />} />
      <Route path="/payment/:bookingId" element={<PaymentPage/>} />
      <Route
        loader={teacherLoader}
        path="/teachers/:id/show"
        element={<Show />}
      />
      <Route  path="/teachers/:id/edit" element={<Edit />} />
      <Route path="/:url" element={<VideoMeet />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);



/*
Use :param (slugs) in react-router-dom routes to capture dynamic URL segments.
Access these parameters in your component using the useParams hook.
*/
