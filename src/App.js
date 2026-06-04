import { lazy, Suspense, useEffect } from "react";
/// Components
// import { useLocation } from 'react-router-dom';
import Index from "./jsx/index";
import { connect, useDispatch } from "react-redux";
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
// action
import { checkAutoLogin } from "./services/AuthService";
import { isAuthenticated } from "./store/selectors/AuthSelectors";
/// Style

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./css/style.css";

// import HomePage from "./jsx/pages/Home/HomePage";
// import JobDetailed from "./jsx/pages/jobComponents/jobDetailed";
import PasswordReset from "./jsx/pages/PasswordReset";
import EmploymentSystem from "./jsx/pages/employmentSystem/EmploymentSystem";
import ChangePassword from "./jsx/pages/PasswordChange";
import ReactivateActivate from "./jsx/pages/reactivateLink";
import Activate from "./jsx/pages/activate";
import InterviewExam from "./jsx/pages/interviewSystem/InterviewExam";
import InterviewVideo from "./jsx/pages/interviewSystem/interviewVideo";
import Interview from './jsx/pages/interviewSystem/interview';
import CandidateReference from "./jsx/pages/referenceCheck/candidateReference";
import CandidateComponent from "./jsx/pages/referenceCheck/RefereeComponent";
import ExtraQuestionDocs from "./jsx/pages/extraQuestionDocs/extraQuestionDocs";
import RateConfirmationForm from "./jsx/pages/rateConfirmation/rateConfirmationForm";

const SignUp = lazy(() => import("./jsx/pages/Registration"));
const ForgotPassword = lazy(() => import("./jsx/pages/ForgotPassword"));
const Login = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./jsx/pages/Login")), 500);
  });
});

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();

    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}

function App(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation(); // Get the current location here
  useEffect(() => {
    checkAutoLogin(dispatch, navigate, location.pathname); // Pass location.pathname to checkAutoLogin
  }, [dispatch, navigate, location.pathname]);

  let routeblog = (
    <Routes>
      {/* <Route path='/' element={<HomePage />} /> */}
      {/* <Route path="/job/detailed" element={<JobDetailed />} /> */}
      <Route path="/employeresetpassword" element={<PasswordReset />} />
      <Route path="/reactivate-link" element={<ReactivateActivate />} />
      <Route path="/activate" element={<Activate />} />
      <Route path='/interview' element={<Interview />} />
      <Route path='/interview-Candidate-exam' element={<InterviewExam />} />
      <Route path='/interview-Video-exam' element={<InterviewVideo />} />
      <Route path='/employment-submission' element={<EmploymentSystem />} />
      <Route path="/login" element={<Login />} />

      {/* <Route path='/forgot-password' element={<Login />} /> */}
      <Route path="/page-register" element={<SignUp />} />
      <Route path="/page-forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-password" element={<ChangePassword />} />
      <Route path="/candidate-reference" element={<CandidateReference />} />
      <Route path="/reference-check" element={<CandidateComponent />} />
      <Route path="/extra-questions" element={<ExtraQuestionDocs />} />
      <Route path="/rate-confirmation/" element={<RateConfirmationForm />} />
    </Routes>
  );
  if (props.isAuthenticated) {
    return (
      <>
        <Suspense
          fallback={
            <div id="preloader">
              <div className="sk-three-bounce">
                <div className="sk-child sk-bounce1"></div>
                <div className="sk-child sk-bounce2"></div>
                <div className="sk-child sk-bounce3"></div>
              </div>
            </div>
          }
        >
          <Index />
        </Suspense>
      </>
    );
  } else {
    return (
      <div className={`vh-100  ${location.pathname === "/interview-Video-exam" ? "videoInterviewPage" : ""}`}>
        <Suspense
          fallback={
            <div id="preloader">
              <div className="sk-three-bounce">
                <div className="sk-child sk-bounce1"></div>
                <div className="sk-child sk-bounce2"></div>
                <div className="sk-child sk-bounce3"></div>
              </div>
            </div>
          }
        >
          {routeblog}
        </Suspense>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: isAuthenticated(state),
  };
};

export default withRouter(connect(mapStateToProps)(App));
