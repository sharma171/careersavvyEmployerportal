import React, { useState } from "react";
import { CheckCircle, Calendar, Mail, ArrowRight, Phone, Eye, Download, Send } from "lucide-react";
import { Dropdown } from "react-bootstrap";
import styles from "../css/jobPosting.module.css";

const statusOptions = [
  { key: "all", label: "All Status" },
  { key: "completed", label: "Completed" },
  { key: "in_progress", label: "In Progress" },
  { key: "pending", label: "Pending" },
  { key: "expired", label: "Expired" },
];

const methodOptions = [
  { key: "all", label: "All Methods" },
  { key: "candidate", label: "Automatic" },
  { key: "hr_system", label: "Manual" },
];

const DetaiiledList = ({ detailedList, centerViewType, setCenterViewType, refereeData, setRefereeData, setInviteReminder }) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const getFilteredList = () => {
    if (!detailedList?.data) return [];
    return detailedList.data.filter(item => {
      // Status Filter
      const correctStatus =
        statusFilter === "all" ||
        item.status === statusFilter;

      // Method Filter
      // Replace with your logic! Here, we're using item.method
      const correctMethod =
        methodFilter === "all" ||
        (item.created_by && item.created_by === methodFilter);

      return correctStatus && correctMethod;
    });
  };

  const filteredList = getFilteredList();

  function formatUSPhoneNumber(value) {
    const raw = String(value ?? '').trim();
    // keep digits only
    let digits = raw.replace(/\D/g, '');

    // If 11 digits and starts with '1', drop the country code
    if (digits.length === 11 && digits.startsWith('1')) {
      digits = digits.slice(1);
    }

    // Clamp to US 10 digits
    digits = digits.slice(0, 10);

    const len = digits.length;
    if (len === 0) return '';

    if (len <= 3) {
      // just the area code as user types
      return digits;
    } else if (len <= 6) {
      // (AAA) BBB
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      // +1 (AAA) BBB-CCCC
      return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
  }


  return (
    <>
      <div className="detailedListView">
        <div className="topRow mobileColumn">
          <button
            type="button"
            className={`${styles.createJobPostBtn} newButton d-flex align-items-center`}
            onClick={() => {setInviteReminder(true);setCenterViewType("sendReferRequest")}}
          >
            <Send size={22} /> Send Reference Request
          </button>
          <div className="dropDownFilters">
            <div className="filterDropdown">
              <Dropdown onSelect={setStatusFilter}>
                <Dropdown.Toggle
                  id="dropdown-status"
                  className={`d-flex align-items-center ${styles.searchFilter} newFilter`}
                >
                  {statusOptions.find(o => o.key === statusFilter)?.label}
                </Dropdown.Toggle>
                <Dropdown.Menu className={styles.DropDownMenu}>
                  {statusOptions.map(option => (
                    <Dropdown.Item
                      key={option.key}
                      eventKey={option.key}
                      active={statusFilter === option.key}
                      className={`${styles.DropDownItems} ${statusFilter === option.key ? styles.DpiActive : ''}`}
                    >
                      {option.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="filterDropdown">
              <Dropdown onSelect={setMethodFilter}>
                <Dropdown.Toggle
                  id="dropdown-method"
                  className={`d-flex align-items-center ${styles.searchFilter} newFilter`}
                >
                  {methodOptions.find(o => o.key === methodFilter)?.label}
                </Dropdown.Toggle>
                <Dropdown.Menu className={styles.DropDownMenu}>
                  {methodOptions.map(option => (
                    <Dropdown.Item
                      key={option.key}
                      eventKey={option.key}
                      active={methodFilter === option.key}
                      className={`${styles.DropDownItems} ${methodFilter === option.key ? styles.DpiActive : ''}`}
                    >
                      {option.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="detailedLists">
          {filteredList.length > 0 ? (<>


            {filteredList.map((item, idx) => (
              <div className="candidate-card" key={idx}>
                <div className="headerRow">
                  <div className="Listheader">
                    <h2 className="candidate-name">{item.referee_name}</h2>
                    <span className={`status ${item.status}`}>
                      {item.status === "completed" ? (
                        <CheckCircle className="icon" size={14} />
                      ) : null}
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace("_", " ")}
                    </span>
                    <span className="mode">{item?.created_by == "hr_system" ? "Manual" : "Auto"}</span>
                  </div>
                  <div className="cardButtonOuter">
                    {item.status === "completed" ? (<>
                      <button className="cardButton" onClick={() => { setRefereeData(item); setCenterViewType("detailedView") }}><Eye /></button>
                      {/* <button className="cardButton"><Download /></button> */}
                    </>) : (<>
                    </>)}

                  </div>
                </div>
                <div className="role">
                  {item.referee_title}
                  <span className="former" style={{ marginLeft: 10, color: "#959da5", fontSize: 13 }}>
                    {item.relationship_to_candidate}
                  </span>
                </div>
                <div className="contact-info">
                  <div>
                    <Mail className="icon" size={16} />
                    <span>{item.referee_email}</span>
                  </div>
                  <div>
                    <Phone className="icon" size={16} />
                    <span>{formatUSPhoneNumber(item.referee_phone_number)}</span>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <div className="timeline-header">Status Timeline</div>
                  <div className="created-info">
                    {/* Created {new Date(item.created_at).toLocaleDateString('en-US')} */}
                  </div>
                </div>
                <div className="timeline">
                  <div>
                    <Calendar className="icon" size={16} />
                    <span>Sent {new Date(item.created_at).toLocaleDateString('en-US')}</span>
                  </div>
                  {/* <div>
                  <Eye className="icon" size={16} />
                  <span>Accessed —</span>
                </div> */}
                  {item.status === "completed" && (
                    <div className="completed">
                      <CheckCircle className="icon" size={16} />
                      <span>Completed {new Date(item.created_at).toLocaleDateString('en-US')}</span>
                    </div>
                  )}
                </div>
                {/* <div className="notes">
                Notes:
                <div>No notes available</div>
              </div> */}
                <div className="cardListFooter">
                  <ArrowRight className="icon" size={8} /> &nbsp;{item?.created_by == "hr_system" ? "Submitted manually through the HR portal" : "Collected automatically via candidate email workflow"}
                </div>
              </div>
            ))}
          </>) : (<>
            <div style={{ textAlign: "center", color: "#020817" }}>No references to Load..</div>
          </>)}
        </div>
      </div>
    </>
  );
};

export default DetaiiledList;
