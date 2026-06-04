import React, { } from "react";
import { PanelLeft, PanelLeftOpen, PanelRightOpen } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { useDispatch , useSelector } from 'react-redux';
/// React router dom
import { Link } from "react-router-dom";
import { navtoggle } from "../../../store/actions/AuthActions";
/// images
// import logo from "../../../images/site_logo.jpg";
import logo from "../../../images/site_logo.svg";
import "./extStyles.css"
import logoText from "../../../images/logo-text.png";

const NavHader = () => {
   //const [toggle, setToggle] = useState(false);
   const dispatch = useDispatch();
   const sideMenu = useSelector(state => state.sideMenu);
   const location = useLocation();
   const handleToogle = () => {
     dispatch(navtoggle());
   //   if(sideMenu===false){
   //      setTimeout(()=> {dispatch(navtoggle());

   //       console.log(sideMenu);     
   //      },10000)
   //   }
   };
   return (
      <div className="nav-header">
         {location.pathname ==='/resume-upload'?(
            // <Link to="/" className="brand-logo">
            // <h3 >
            //       <img src={logo} className="logo-img" alt="logo"/>
            //       <span className="logo-title">Career Savvy</span>
            // </h3>
            // </Link>
            <></>
         ):(
            <Link to="#" className="brand-logo">
            <h3 >
                  <img src={logo} className="logo-img" alt="logo"/>
                  <span className="logo-title">CareerSavvy</span>
            </h3>
            </Link>
         )}
         

         <div className="nav-control" 
            onClick={() => {              
               handleToogle()
             }}
         >
            <div className={`hamburger ${sideMenu ? "is-active" : ""}`}>
                {sideMenu ?(<>
                <PanelLeft size={22} style={{
                      
               }}/>
                </>):(<>
                <PanelRightOpen size={22} style={{
                      
               }}/>
                </>)}
               
               {/* <span className="line"></span>
               <span className="line"></span>
               <span className="line"></span> */}
            </div>
         </div>
      </div>
   );
};

export default NavHader;
