import React, {  useState, useEffect, } from "react";
import "./style/sidepopup.css"
import {ReferencePopup}  from "./referencePopup";
import {ScheduleInterview} from "./ScheduleInterview";
import ImportCandidate from "./importCandidate";
import ContactUsForm from "./ContactUsForm";

const SidePopup = ({setPopupType,popupType, paginatedCandidates, selectedProfile, detailedJobData,  setMessage, setType, setShowLoader }) => {
  return (
    <>
        <div className={`sideViewPopupOuter ${popupType!==""?"popupOpen":""}`}>
            <div className={`sideView ${popupType=='scheduleInterview'||popupType=='importCandidate'||popupType=='ContactUs'?"smallView":""}`}>
              {popupType=='referenceresults'&&(<>
                <ReferencePopup  popupType={popupType} setPopupType={setPopupType}/>
              </>)}
              {popupType=='interviewresults'&&(<>
                <ReferencePopup  popupType={popupType} setPopupType={setPopupType}/>
              </>)}
              {popupType=='scheduleInterview'&&(<>
                <ScheduleInterview detailedJobData={detailedJobData} popupType={popupType} setPopupType={setPopupType} selectedProfile={selectedProfile}  setMessage={setMessage} setType={setType}/>
              </>)}
              {popupType=='importCandidate'&&(<>
                <ImportCandidate popupType={popupType} paginatedCandidates={paginatedCandidates} detailedJobData={detailedJobData} setPopupType={setPopupType} setShowLoader={setShowLoader} setMessage={setMessage} setType={setType}/>
              </>)}
              {popupType=='ContactUs'&&(<>
                <ContactUsForm popupType={popupType} setPopupType={setPopupType} setShowLoader={setShowLoader} setMessage={setMessage} setType={setType} />
              </>)}
            </div>
        </div>
    </>
  )
}

export default SidePopup