import React, { useState } from "react";
import "../css/updateStatus.css";
import { ChevronDown, Mail, SquarePen, X } from "lucide-react";
import { Dropdown } from "react-bootstrap";

const UpdateStatusPopup = ({ closeUpdateStatus, selectedProfile, setShowLoader, detailedJobData, setType, setMessage, getCandidatesList }) => {
    const [status, setStatus] = useState("");
    const [notes, setNotes] = useState("");
    const [sendEmail, setSendEmail] = useState(true);

    const statusOptions = [
        { value: "Applied", desc: "Initial application received" },
        { value: "In Review", desc: "Documents and profile under review" },
        { value: "Submitted to Client", desc: "Profile submitted to client for consideration" },
        { value: "Interview Stage", desc: "Interview process initiated" },
        { value: "Offer Stage", desc: "Offer extended or under negotiation" },
        { value: "Hired", desc: "Successfully hired" },
        { value: "Not Selected", desc: "Application not successful" },
    ];

    const handleStatusChange = (selectedValue) => {
        setStatus(selectedValue);
    };
    const handleBulkStatusChange = async (selectedValue) => {
        if (!selectedValue) return;
        
        setShowLoader("Updating status...");
        try {
            const payload = {
            job_id: detailedJobData.job_id,
            task: "update_status",
            update_status: selectedValue,
            emails: [selectedProfile.email],
            notes,       // ✅ include notes
            sendEmail    // ✅ include email flag
            };

            const response = await fetch(
                "https://candidate-details-applied-for-job-id-v10-737421501165.us-east1.run.app",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data?.message || "Failed to update status");
            }

            setType("success");
            setMessage(`Updated candidate ${selectedProfile.email} status to ${selectedValue}.`);
            await getCandidatesList(); // refresh UI from server truth
            
        } catch (err) {
            setType("error");
            setMessage(err.message || "Error updating status.");
        } finally {
            setShowLoader("");
            closeUpdateStatus();
        }
    };

    return (
        <div className="overlay updateStatus">
            {console.log("selected profile",selectedProfile)
            }
            <div className="popup">
                <div className="popup-header">
                    <h3>Update Candidate Status</h3>
                    <button className="close-btn" onClick={closeUpdateStatus}>
                        <X size={24} />
                    </button>
                </div>

                <div className="popup-body">
                    <p className="current-status">
                        Current Status: {selectedProfile?.application_status || "Applying"}
                    </p>

                    <div className="form-group">
                        <label>New Status</label>
                        <div className="dropdown">
                            <Dropdown onSelect={handleStatusChange}>
                                <Dropdown.Toggle
                                    id="dropdown-new-status"
                                    className="d-flex align-items-center justify-between filled-dropdown newFilter"
                                >
                                    {status ? status : "Select new status"}
                                    <ChevronDown className="dropdown-icon" size={18} />
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="custom-dropdown-menu">
                                    {statusOptions.map((opt) => (
                                        <Dropdown.Item
                                            key={opt.value}
                                            eventKey={opt.value}
                                            active={status === opt.value}
                                            className="custom-dropdown-item"
                                        >
                                            <div className="status-label">{opt.value}</div>
                                            <div className="status-desc">{opt.desc}</div>
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                    </div>

                    <div className="form-group">
                        <label>Additional Notes (Optional)</label>
                        <textarea
                            placeholder="Add any additional notes about this status change..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="sendEmail"
                            checked={sendEmail}
                            onChange={() => setSendEmail(!sendEmail)}
                        />
                        <label htmlFor="sendEmail">
                            <Mail size={12} /> Send notification email to candidate
                        </label>
                    </div>
                </div>

                <div className="popup-footer">
                    <button className="cancel-btn" onClick={closeUpdateStatus}>
                        <X size={14} /> Cancel
                    </button>
                    <button
                        className="update-btn"
                        onClick={() => handleBulkStatusChange(status)}  // ✅ pass status here
                        disabled={!status}  // ✅ prevent update if no status selected
                        >
                        <SquarePen size={14} /> Update Status
                    </button>

                </div>
            </div>
        </div>
    );
};

export default UpdateStatusPopup;
