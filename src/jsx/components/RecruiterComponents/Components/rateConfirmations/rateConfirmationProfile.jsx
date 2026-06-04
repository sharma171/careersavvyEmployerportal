import React, { useEffect } from 'react';
import { useState } from 'react';

import { CircleCheckBigIcon, Clock, DollarSign, DotIcon, MessageSquare, RotateCcw } from "lucide-react";
import "./rateConfirmation.css";
import Loader from "../spinner";

const RateConfirmationProfile = (
    { profile,
        jobId,
        setShowLoader,
        setType,
        setMessage,
        message,
        setCenterViewType,
        setSubmissionSelected,
        profileactiveTab, setProfileActiveTab }) => {
    const [popupType, setPopupType] = useState("");
    const [rate, setRate] = useState("");
    const [finalOffer, setFinalOffer] = useState(false);
    const [rateConfirmationData, setRateConfirmationData] = useState([]);
    const [dataLoader, setDataLoader] = useState("");
    const [submissions, setSubmissions] = useState("");
    const [docID, setDocId] = useState("");
    const handleSubmit = () => {
        if (rate) {
            onSubmit();
        };
    };
    useEffect(() => {
        if (profile.email !== "" && docID == "") {
            getDocId();
        }
        if (docID !== "") {
            getRatesConfirmation();
        }
    }, [profile.email, docID, message])
    const getDocId = async () => {
        setDataLoader("Loading Results");
        try {
            const listQuery = {
                action: "get_list_of_submission",
                candidate_email: profile.email,
                jobId: jobId,
            };
            const response = await fetch("https://get-employment-data-v10-737421501165.us-east1.run.app", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(listQuery),
            })
            const data = await response.json();

            console.log("docID", data.submissions[0].doc_id);
            setDocId(data.submissions[0].doc_id);
            setSubmissions(data.submissions[0])



        } catch (error) {
            console.log(error);
            setShowLoader("");
        }
        finally {
            setShowLoader("");
            // setDataLoader("");
            if (docID !== "") {

                getRatesConfirmation();
            }
        }
    }
    const getRatesConfirmation = async () => {
        // setShowLoader("Loading")
        try {
            const listQuery = {
                "action": "get_rate_confirmation_data", "doc_id": docID, "candidate_email": profile.email
            }
            const response = await fetch("https://send-rate-confirmation-email-store-data-v10-737421501165.us-east1.run.app", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(listQuery),
            })
            const data = await response.json();
            setShowLoader("");
            setRateConfirmationData(data.submited_object);
            setDataLoader("");

            console.log("ratesData", data);


        } catch (error) {
            console.log(error);
            setShowLoader("");
            setDataLoader("");
        }
        finally {
            setShowLoader("");
            setDataLoader("");
        }
    }
    const onSubmit = async () => {
        setShowLoader("Sending Rate Confirmation Request")
        try {
            const listQuery = {
                "action": "notify_candidate_for_rate_confirmation",
                "candidate_mail_id": profile.email,
                "job_id": jobId,
                "rate": rate
            }
            const response = await fetch("https://send-rate-confirmation-email-store-data-v10-737421501165.us-east1.run.app", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(listQuery),
            })
            const data = await response.json();
            setShowLoader("");
            setType("success");
            setMessage("Your request for Rate confirmation sent successfully.");

            console.log("referenceData", data);


        } catch (error) {
            console.log(error);
            setShowLoader("");
        }
        finally {
            setShowLoader("");
            setPopupType("");
        }
    }
    return (
        <>

            {dataLoader == "" ? (<>
                {rateConfirmationData.length !== 0 ? (<>
                    <div className="rateConfirmationProfile">
                        <div className="TopHead">
                            <div className="rate-confirmation-text">
                                <h3>Rate Confirmation Management</h3>
                                <p style={{width:"80%"}}>Track rate confirmations, negotiations, and approvals</p>
                            </div>
                            <button className="rate-confirmation-btn" onClick={() => setPopupType("rateConfirmation")}>
                                {/* <FaPaperPlane className="btn-icon" /> */}
                                Send Rate Confirmation
                            </button>
                        </div>
                        <div className="negotiation-container">
                            <div className="summary-cards">
                                <div className="card">
                                    <div className="cardFlex">
                                        <div className="lhs">
                                            <p>Total</p>
                                            <h4>{rateConfirmationData?.token_status?.includes("pending") ? (<>{rateConfirmationData.length}</>) : (<>{rateConfirmationData.length}</>)} </h4>
                                        </div>
                                        <div className="rhs"><DollarSign size={20} className="icon" /></div>
                                    </div>
                                </div>
                                <div className="card confirmed">
                                    <div className="cardFlex">
                                        <div className="lhs">
                                            <p>Confirmed</p>
                                            <h4>
                                                {
                                                    Array.isArray(rateConfirmationData)
                                                        ? rateConfirmationData.filter(
                                                            (item) => item?.candidate_confirmation?.toLowerCase().includes("accept")).length
                                                        : 0
                                                }
                                            </h4>
                                        </div>
                                        <div className="rhs"><CircleCheckBigIcon size={20} className="icon" /></div>
                                    </div>
                                </div>
                                <div className="card negotiating">
                                    <div className="cardFlex">
                                        <div className="lhs">
                                            <p>Negotiating</p>
                                            <h4>
                                                {
                                                    Array.isArray(rateConfirmationData)
                                                        ? rateConfirmationData.filter(
                                                            (item) => item?.candidate_confirmation?.toLowerCase().includes("counter")
                                                        ).length
                                                        : 0
                                                }
                                            </h4>
                                        </div>
                                        <div className="rhs"><RotateCcw size={20} className="icon" /></div>
                                    </div>
                                </div>
                                <div className="card pending">
                                    <div className="cardFlex">
                                        <div className="lhs">
                                            <p>Pending</p>
                                            <h4>
                                                {
                                                    Array.isArray(rateConfirmationData)
                                                        ? rateConfirmationData.filter(
                                                            (item) => item?.token_status?.toLowerCase().includes("pending")
                                                        ).length
                                                        : 0
                                                }
                                            </h4>
                                        </div>
                                        <div className="rhs"><Clock size={20} className="icon" /></div>
                                    </div>
                                </div>
                            </div>


                            <div className="negotiation-table">
                                <h3>Rate Confirmation for {profile.first_name} {profile.last_name}</h3>
                                <div class="table-responsive" tabindex="0">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Application Email</th>
                                                <th>Sent To</th>
                                                <th>Current Status</th>
                                                <th>Rate Proposed</th>
                                                <th>Response</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rateConfirmationData.map((item) => (<>
                                                {item?.candidate_confirmation !== "accepted" ? (<>
                                                    <tr>
                                                        <td>
                                                            <div className="tableColumns">
                                                                <span className="mailText">
                                                                    {submissions?.employment_type == "C2C (Corp-to-Corp through my company)" ? (<>
                                                                        {submissions?.sent_to_email || item.sent_to_email}
                                                                    </>) : (<>
                                                                        {profile?.email || submissions?.sent_to_email}
                                                                    </>)}
                                                                </span>
                                                                <span className="dateTime">

                                                                    {/* {item?.rate_confirmation_email_token_created_at} */}
                                                                    {new Date(item?.rate_confirmation_email_token_created_at).toLocaleString('en-US', {
                                                                        year: 'numeric',
                                                                        month: '2-digit',
                                                                        day: '2-digit',
                                                                        hour: 'numeric',
                                                                        minute: '2-digit',
                                                                        hour12: true
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td><span className="badge employer">{submissions?.employment_type == "C2C (Corp-to-Corp through my company)" ? (<>
                                                            Employer
                                                        </>) : (<>
                                                            Candidate
                                                        </>)}</span></td>
                                                        <td>
                                                            {/* <span className="status-icon" onClick={getRatesConfirmation}>⟳</span> */}
                                                            <span className={`badge status ${item.candidate_confirmation === "accept" && "colorBlue"} ${item.candidate_confirmation === "counter" && "colorOrange"} ${item.candidate_confirmation === "decline" && "colorRed"} ${item.token_status === "expired" && "darkBlack"}`}>{item.candidate_confirmation === "counter" && "Negotiating"}{item.candidate_confirmation === "accept" && "Accepted"}
                                                                {item.candidate_confirmation === "accept" && (<><div className="PopupText">
                                                                    Accepted the proposed rate
                                                                </div></>)}
                                                                {item.candidate_confirmation === "counter" && (<><div className="PopupText">
                                                                    I’d like to propose a different rate
                                                                </div></>)}
                                                                {item.candidate_confirmation === "decline" && (<><div className="PopupText">
                                                                    I cannot accept this rate
                                                                </div></>)}
                                                                {item.candidate_confirmation === "decline" && "Rejected"}


                                                                {item?.token_status?.includes("pending") ? (<>
                                                                    Pending
                                                                </>) : (<></>)}
                                                                {item?.token_status?.includes("expired") && !item?.note ? (<>
                                                                    Link Expired
                                                                </>) : (<></>)}
                                                                {item?.token_status?.includes("used") && !item?.note ? (<>
                                                                    Link Expired
                                                                </>) : (<></>)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="rate">
                                                                {item.candidate_confirmation === "counter" && item?.intial_proposed_rate ? <>
                                                                    {item?.intial_proposed_rate && (
                                                                        <>$ {String(item.intial_proposed_rate).trim()
                                                                            .replace(/^\$/, '')
                                                                            .replace(/\s*\/\s*hr$/i, '')
                                                                        }/hr</>
                                                                    )}
                                                                </> : <>
                                                                    {item?.accepted_rate && (
                                                                        <>$ {String(item.accepted_rate).trim()
                                                                            .replace(/^\$/, '')         // remove leading $
                                                                            .replace(/\s*\/\s*hr$/i, '') // remove existing /hr (any spacing/case)
                                                                        }/hr</>
                                                                    )}
                                                                </>}

                                                                {item?.token_status?.includes("pending") ? (<>
                                                                    {item?.intial_proposed_rate ? (<>
                                                                        $ {String(item.intial_proposed_rate).trim()
                                                                            .replace(/^\$/, '')         // remove leading $
                                                                            .replace(/\s*\/\s*hr$/i, '') // remove existing /hr (any spacing/case)
                                                                        }/hr
                                                                    </>) : (<>
                                                                        Not Specified
                                                                    </>)}

                                                                </>) : (<></>)}
                                                                {item?.token_status?.includes("expired") && !item?.note ? (<>
                                                                    Not Specified
                                                                </>) : (<></>)}
                                                                {item?.token_status?.includes("used") && !item?.note ? (<>
                                                                    Not Specified
                                                                </>) : (<></>)}
                                                            </span>
                                                        </td>

                                                        <td><span className="counter">{item.candidate_confirmation === "accept" && "Accepted Proposed Rate"}
                                                            {item.candidate_confirmation === "counter" && <>Counter rate: $ {String(item.accepted_rate).trim()
                                                                .replace(/^\$/, '')         // remove leading $
                                                                .replace(/\s*\/\s*hr$/i, '') // remove existing /hr (any spacing/case)
                                                            }/hr
                                                            </>}
                                                            {item?.token_status?.includes("pending") ? (<>
                                                                Pending
                                                            </>) : (<></>)}
                                                            {item?.token_status?.includes("expired") && !item?.note ? (<>
                                                                <span className="rateExpired">

                                                                    Expired
                                                                </span>
                                                            </>) : (<></>)}
                                                            {item?.token_status?.includes("used") && !item?.note ? (<>
                                                                Not Specified
                                                            </>) : (<></>)}
                                                            {item.candidate_confirmation === "counter" && <><div className="PopupText">
                                                                Reason : {item.justification_for_counter_rate}
                                                            </div> </>}
                                                            {item.candidate_confirmation === "decline" && <><div className="PopupText">
                                                                Reason : {item.reason_for_declining}
                                                            </div> </>}

                                                            {item.candidate_confirmation === "decline" && "Rejected"}</span></td>
                                                        <td><button className="action-btn" onClick={() => setPopupType("resendrateConfirmation")}>Resend</button></td>
                                                    </tr>
                                                </>) : (<>
                                                    {rateConfirmationData?.token_status?.includes("pending") ? (<>
                                                        <tr>

                                                            <td>{profile?.email || "email@gmail.com"}</td>
                                                            <td><span className="badge employer">{submissions?.employment_type == "C2C (Corp-to-Corp through my company)" ? (<>
                                                                Employer
                                                            </>) : (<>
                                                                Candidate
                                                            </>)}</span></td>
                                                            <td>
                                                                <span className="status-icon" onClick={getRatesConfirmation}>⟳</span>
                                                                <span className="badge status">{item.candidate_confirmation === "counter" && "Negotiating"}{item.candidate_confirmation === "accept" && "Accepted"}
                                                                    {item.candidate_confirmation === "decline" && "Rejected"}{item.token_status}pending</span>
                                                            </td>
                                                            <td><span className="rate">{item.accepted_rate && (<>$ {item.accepted_rate}/hr</>)}</span></td>
                                                            <td><span className="counter">{item.candidate_confirmation === "accept" && "Accepted Proposed Rate"} {item.candidate_confirmation === "counter" && <>Counter rate: {item.accepted_rate}</>}{item.candidate_confirmation === "decline" && "Rejected"}</span></td>
                                                            <td><button className="action-btn" onClick={() => setPopupType("resendrateConfirmation")}>Resend</button></td>
                                                        </tr>
                                                    </>) : (<></>)}

                                                </>)}



                                            </>))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </>) : (<>
                    <div className="tabContentContainer">
                        <div className="interview-history-container">
                            <h4 className="interview-history-title">Rate Confirmation Info</h4>
                            <div className="interview-history-content">
                                <MessageSquare className="interview-icon" />
                                <p className="no-interview-text">No rate confirmation added yet</p>
                                <p className="invite-hint">Send rate confirmation request to get started</p>
                                <button
                                    className="invite-button"
                                    onClick={() => {
                                        if (submissions?.employment_type == "") {
                                            setType("failed");
                                            setMessage("Rate confirmation starts after the candidate completes the submission form.");
                                            setProfileActiveTab("Submission Info");
                                            return;
                                        }
                                        else {
                                            setPopupType("rateConfirmation");
                                        }
                                    }}
                                >
                                    <MessageSquare className="button-icon" />
                                    Send Rate Confirmation
                                </button>
                            </div>
                        </div>
                    </div>
                </>)}
            </>) : (<>
                <div className="profileFacade">
                    <div className="loaderout">

                        <Loader />
                    </div>
                    <h3 className="heading">{dataLoader}</h3>

                </div>
            </>)}


            {popupType !== "" && (<>
                <div className="RatePopupWrap">
                    <div className="RatePopup">
                        {popupType == "rateConfirmation" ? (<>
                            <h2 className="popup-title">Send Rate Confirmations</h2>
                        </>) : (<>
                            <h2 className="popup-title">Send New Rate Proposal</h2>
                        </>)}
                        <p className="popup-desc">
                            {popupType == "rateConfirmation" ? (<>
                                Send a rate confirmation request to get started. Enter your proposed rate.
                            </>) : (<>
                                Previous rate was rejected/counter-offered. Enter your new rate proposal.
                            </>)}
                        </p>

                        <label className="input-label">
                            {popupType == "rateConfirmation" ? (<>
                                Enter finalized Rate
                            </>) : (<>
                                New Rate
                            </>)}
                        </label>
                        <input
                            type="text"
                            className="rate-input"
                            placeholder="e.g., $85/hr"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                        />

                        <div className="checkbox-wrap">
                            <input
                                type="checkbox"
                                id="finalOffer"
                                checked={finalOffer}
                                onChange={() => setFinalOffer(!finalOffer)}
                            />
                            <label htmlFor="finalOffer">Mark as final offer</label>
                        </div>

                        <div className="popup-actions">
                            <button className="btn cancel" onClick={() => { setPopupType("") }}>
                                Cancel
                            </button>
                            <button className="btn submit" onClick={handleSubmit}>
                                Send Rate Confirmation
                            </button>
                        </div>
                    </div>
                </div>
            </>)}



        </>
    )
}

export default RateConfirmationProfile;