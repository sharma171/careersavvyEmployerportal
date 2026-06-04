import React from "react";
/// React router dom
import { useLocation } from "react-router-dom";
import { Routes, Route, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
// import { Elements } from '@stripe/react-stripe-js';
// import StripeProvider from './stripeProvider';

// import { loadStripe } from "@stripe/stripe-js";
/// Css
import "./index.css";
import "./chart.css";
import "./step.css";

/// Layout
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";

/// Deshboard
// import Home from "./components/Dashboard/Home/MockInterview";
// import TestingPage from './components/Dashboard/testingPage/testinngPage';
// import JobDetailed from "./components/jobComponents/jobDetailed";
// import DashboardDark from "./components/Dashboard/Home/DashboardDark";
// import SubscriptionPage from "./components/Dashboard/Home/subscription/Subscriptions";
// import InterviewPrep from "./components/Dashboard/Interview/InterviewPrep";
// import InterviewExam from "./components/Dashboard/Interview/InterviewExam";
// import Activate from "./components/Dashboard/Home/activate";
// import CheckOutPage from "./components/Dashboard/Home/checkOutPage";
// import ResumeUpload from "./components/Forms/ResumeUpload/Resume";
import Application from "./components/Dashboard/Application/Application";
import Profile from "./components/Dashboard/Profile/Profile";
// import SearchJobs from "./components/Dashboard/SearchJobs/SearchJobs";
import JobPosting from "./components/RecruiterComponents/jobPosting/jobPostingComponent";
import CandidateListing from "./components/RecruiterComponents/candidateListing/candidateListing";
import JobsDashboardHome from "./components/RecruiterComponents/JobsHome/JobsDasboard";
import CreateNewJobs from "./components/RecruiterComponents/JobsHome/createNewJobs";
import OverviewPage from "./components/RecruiterComponents/JobsHome/overview";

/// Product List
import ProductGrid from "./components/AppsMenu/Shop/ProductGrid/ProductGrid";
import ProductList from "./components/AppsMenu/Shop/ProductList/ProductList";
import ProductDetail from "./components/AppsMenu/Shop/ProductGrid/ProductDetail";
import Checkout from "./components/AppsMenu/Shop/Checkout/Checkout";
import Invoice from "./components/AppsMenu/Shop/Invoice/Invoice";
import ProductOrder from "./components/AppsMenu/Shop/ProductOrder";
import EcomCustomers from "./components/AppsMenu/Shop/Customers/Customers";
 
/// Plugins
import Select2 from "./components/PluginsMenu/Select2/Select2";
// import MainSweetAlert from './components/PluginsMenu/SweetAlert/SweetAlert'
import Toastr from "./components/PluginsMenu/Toastr/Toastr";
import JqvMap from "./components/PluginsMenu/JqvMap/JqvMap";
// import Lightgallery from './components/PluginsMenu/Lightgallery/Lightgallery'

/// Widget
// import Widget from "./pages/Widget";

/// Form
import Element from "./components/Forms/Element/Element";
import Wizard from "./components/Forms/Wizard/Wizard";
// import CkEditor from './components/Forms/CkEditor/CkEditor'
import Pickers from "./components/Forms/Pickers/Pickers";
import FormValidation from "./components/Forms/FormValidation/FormValidation";

// /// Pages
// import Registration from "./pages/Registration";
// import Login from "./pages/Login";
import LockScreen from "./pages/LockScreen";
import Error400 from "./pages/Error400";
import Error403 from "./pages/Error403";
import Error404 from "./pages/Error404";
import Error500 from "./pages/Error500";
import Error503 from "./pages/Error503";
import Todo from "./pages/Todo";

//Scroll To Top
import ScrollToTop from "./layouts/ScrollToTop";
import Users from "./components/RecruiterComponents/Components/users";

const Markup = () => {
  const options = {
    // passing the client secret obtained from the server
    clientSecret: "{{CLIENT_SECRET}}",
  };
  // Replace with your Stripe public key
  // const stripePromise = loadStripe(
  //   "pk_live_51Q9pepP9YE5TMcZPcE3MSMauCQCy2CjCgRVEtKazyCDmC5FDxYIicB2iZk8lpi0NRff1SoVOgbjHgrjzA1xWGT3e00KOiECVOW"
  // );

  const allroutes = [
    /// Dashboard
    // { url: '', component: <DashboardDark/> },
    // { url: 'job/detailed', component: <JobDetailed/> },
    // { url: 'testing-page', component: <TestingPage/> },
    { url: "dashboard", component: <JobPosting /> },
    { url: "users", component: <Users /> },
    { url: "jobposting", component: <JobPosting /> },
    { url: "candidatelist", component: <CandidateListing /> },
    // { url: 'subscription', component: <SubscriptionPage/> },
    // { url: 'interview-prep', component: <InterviewPrep/> },
    // { url: 'interview-exam', component: <InterviewExam/> },
    // { url: 'activate', component: <Activate/> },
    // { url: 'checkout', component: <CheckOutPage /> },
    // { url: 'resume-upload', component: <ResumeUpload/> },
    // { url: 'recording', component: <Home/> },
    // { url: 'dashboard-dark', component: <DashboardDark/> },
    // { url: "application", component: <Application/> },
    { url: "profile", component: <Profile /> },
    // { url: "search-job", component: <SearchJobs /> },
    { url: "", component: <JobPosting /> },
    { url: "createjobs", component: <CreateNewJobs /> },
    { url: "overviewPage", component: <OverviewPage /> },

    // { url: "statistics", component: <Statistics/> },

    // /// Plugin
    // { url: 'uc-select2', component: <Select2/> },
    // { url: 'uc-sweetalert', component: <MainSweetAlert/> },
    // { url: 'uc-toastr', component: <Toastr/> },
    // { url: 'map-jqvmap', component: <JqvMap/> },
    // { url: 'uc-lightgallery', component: <Lightgallery/> },

    // /// Widget
    // { url: 'widget-basic', component: <Widget/> },

    // /// Shop
    // { url: 'ecom-product-grid', component: <ProductGrid/> },
    // { url: 'ecom-product-list', component: <ProductList/> },
    // { url: 'ecom-product-detail', component: <ProductDetail/> },
    // { url: 'ecom-product-order', component: <ProductOrder/> },
    // { url: 'ecom-checkout', component: <Checkout/> },
    // { url: 'ecom-invoice', component: <Invoice/> },
    // { url: 'ecom-product-detail', component: <ProductDetail/> },
    // { url: 'ecom-customers', component: <EcomCustomers/> },

    /// Form

    // { url: 'form-element', component: <Element/> },
    // { url: 'form-wizard', component: <Wizard/> },
    // { url: 'form-ckeditor', component: <CkEditor/> },
    // { url: 'form-pickers', component: <Pickers/> },
    // { url: 'form-validation', component: <FormValidation/> },
    // /// pages
    // { url: 'page-register', component: <Registration/> },
    // { url: 'page-login', component: <Login/> },
    // { url: 'todo', component: <Todo/> },
  ];

  return (
    <>
      {/* <StripeProvider>
              <Elements stripe={stripePromise}>     */}

      <Routes>
        <Route path="page-lock-screen" element={<LockScreen />} />
        <Route path="page-error-400" element={<Error400 />} />
        <Route path="page-error-403" element={<Error403 />} />
        <Route path="page-error-404" element={<Error404 />} />
        <Route path="page-error-500" element={<Error500 />} />
        <Route path="page-error-503" element={<Error503 />} />
        <Route element={<MainLayout />}>
          {allroutes.map((data, i) => (
            <Route key={i} exact path={`${data.url}`} element={data.component} />
          ))}
        </Route>
      </Routes>

      <ScrollToTop />
      {/* </Elements>
          </StripeProvider> */}
    </>
  );
};

function MainLayout() {
  const sideMenu = useSelector((state) => state.sideMenu);
  const location = useLocation();
  let minHeightValue;

  switch (location.pathname) {
    case "/users":
      minHeightValue = "100vh";
      break;
    // case "/videoInterview":
    //   minHeightValue = "100vh"; // You can change this if needed
    //   break;
    default:
      minHeightValue = "calc(100vh - 0px)";
      break;
  }
  return (
    <div id="main-wrapper" className={`show ${sideMenu ? "menu-toggle" : ""}`}>
      <Nav />
      <div
        className={`content-body ${location.pathname === "/videoInterview" ? "videoInterviewPage" : "jobPostingBg"}`}
        style={{ minHeight: minHeightValue }}
      >
        <div className="container-fluid">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default Markup;
