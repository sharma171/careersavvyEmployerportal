import React, {  useState, useEffect, } from "react";
import "../Components/style/centerViewPopup.css?ver0.99";
import { X } from "lucide-react";
import ProfileComponent from "./profileComponent";
import InterviewHistory from "./interviewHistory";
import SendReference from "./sendReference";
import DetailedReference from "./detailedReference";
import SubmissionDetailed from "./submissionComponents/submissionDetailed";
import RequestAdditional from "./submissionComponents/requestAdditionInfo";
import RequestDetailed from "./submissionComponents/requestDetailed";

const centerViewPopup = ({profileClicked,setProfileClicked,matchSummary,missingSkills,selectedProfile, detailedJobData, DownloadPdf, setShowPdfPopup, inteviewViewActive, setInterviewViewActive, setPopupType, setMessage, setType,message, centerViewType,setCenterViewType, refereeData, setRefereeData, setShowLoader, profileactiveTab, setProfileActiveTab, referencesData, setReferenceData, getCandidatesDetails, submissionSelected, setSubmissionSelected , base64Pdf, setBase64Pdf, inviteReminder, setInviteReminder  }) => {
  
 const renderCenterView = () => {
    switch (centerViewType) {
      case "sendReferRequest":
        return (
          <SendReference
            profileClicked={profileClicked}
            setProfileClicked={setProfileClicked}
            detailedJobData={detailedJobData}
            DownloadPdf={DownloadPdf}
            matchSummary={matchSummary}
            missingSkills={missingSkills}
            selectedProfile={selectedProfile}
            setShowPdfPopup={setShowPdfPopup}
            setInterviewViewActive={setInterviewViewActive}
            setPopupType={setPopupType}
            centerViewType={centerViewType}
            setCenterViewType={setCenterViewType}
             setMessage={setMessage} setType={setType} 
             setShowLoader={setShowLoader}
             referencesData={referencesData} setReferenceData={setReferenceData} 
             inviteReminder={inviteReminder} setInviteReminder={setInviteReminder}
          />
        );
      case "submissiondetailed":
        return (
          <SubmissionDetailed
            profileClicked={profileClicked}
            setProfileClicked={setProfileClicked}
            detailedJobData={detailedJobData}
            selectedProfile={selectedProfile}
            setPopupType={setPopupType}
            centerViewType={centerViewType}
            setCenterViewType={setCenterViewType}
            setMessage={setMessage} setType={setType}
            setShowLoader={setShowLoader}
            submissionSelected={submissionSelected}
            setSubmissionSelected={setSubmissionSelected}
            base64Pdf={base64Pdf} setBase64Pdf={setBase64Pdf}
            setShowPdfPopup={setShowPdfPopup}
          />
        );
      case "requestDetailed":
        return (
          <RequestDetailed
            profileClicked={profileClicked}
            setProfileClicked={setProfileClicked}
            detailedJobData={detailedJobData}
            selectedProfile={selectedProfile}
            setPopupType={setPopupType}
            centerViewType={centerViewType}
            setCenterViewType={setCenterViewType}
            setMessage={setMessage} setType={setType}
            setShowLoader={setShowLoader}
            submissionSelected={submissionSelected}
            setSubmissionSelected={setSubmissionSelected}
            base64Pdf={base64Pdf} setBase64Pdf={setBase64Pdf}
            setShowPdfPopup={setShowPdfPopup}
          />
        );
      case "requestAdditional":
        return (
          <RequestAdditional
            profileClicked={profileClicked}
            setProfileClicked={setProfileClicked}
            detailedJobData={detailedJobData}
            selectedProfile={selectedProfile}
            setPopupType={setPopupType}
            centerViewType={centerViewType}
            setCenterViewType={setCenterViewType}
            setMessage={setMessage} setType={setType}
            setShowLoader={setShowLoader}
          />
        );
      case "detailedView":
        return (
          <DetailedReference
            profileClicked={profileClicked}
            setProfileClicked={setProfileClicked}
            detailedJobData={detailedJobData}
            DownloadPdf={DownloadPdf}
            matchSummary={matchSummary}
            missingSkills={missingSkills}
            selectedProfile={selectedProfile}
            setShowPdfPopup={setShowPdfPopup}
            setInterviewViewActive={setInterviewViewActive}
            setPopupType={setPopupType}
            centerViewType={centerViewType}
            setCenterViewType={setCenterViewType}
            refereeData={refereeData}
            setRefereeData={setRefereeData}
            setMessage={setMessage} setType={setType} 
          />
        );
      default:
        return (
          <ProfileComponent
            profileClicked={profileClicked}
            setProfileClicked={setProfileClicked}
            detailedJobData={detailedJobData}
            DownloadPdf={DownloadPdf}
            matchSummary={matchSummary}
            missingSkills={missingSkills}
            selectedProfile={selectedProfile}
            setShowPdfPopup={setShowPdfPopup}
            setInterviewViewActive={setInterviewViewActive}
            setPopupType={setPopupType}
            centerViewType={centerViewType}
            submissionSelected={submissionSelected}
            setSubmissionSelected={setSubmissionSelected}
            setCenterViewType={setCenterViewType}
            refereeData={refereeData}
            setRefereeData={setRefereeData}
            profileactiveTab={profileactiveTab} 
            setProfileActiveTab={setProfileActiveTab}
            setShowLoader={setShowLoader}
            setMessage={setMessage} setType={setType} 
            message={message}
            referencesData={referencesData} setReferenceData={setReferenceData} getCandidatesDetails={getCandidatesDetails} inviteReminder={inviteReminder} setInviteReminder={setInviteReminder}
          />
        );
    }
  };

  
  return (
    <>
        <div className={`centerPopupOuter  ${profileClicked===true?"popupOpen":""}`}>
            <div className="centerView">
                <div className={`close ${centerViewType=="requestAdditional"?"white":""}`} onClick={()=>{
                  if(inteviewViewActive){
                  setProfileClicked(true); 
                  setInterviewViewActive(false);
                  setCenterViewType("");
                  }
                  else {
                    setProfileClicked(false); 
                    if(centerViewType!==""){
                      setCenterViewType("");
                      setProfileClicked(true);
                    }
                    else {
                      
                    }
                  }
                  
                  }}>
                    <X/></div>
                {inteviewViewActive?(
                  <>
                  <InterviewHistory setMessage={setMessage} setType={setType} selectedProfile={selectedProfile} setPopupType={setPopupType} DownloadPdf={DownloadPdf} />
                  </>):(renderCenterView())}
            </div>
        </div>
    </>
  )
}

export default centerViewPopup