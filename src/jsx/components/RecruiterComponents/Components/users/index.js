import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import CSavvyPageLoader from "../../cSavvvyPageLoader";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import styles from "../../css/users.module.css";
import { HiOutlineUserAdd } from "react-icons/hi";
import { X, Search, Mail, PhoneCallIcon } from "lucide-react";
import { UserModal } from "./AddUser";
import Toast from "../../toastSucces";
import { useSelector } from "react-redux";
import DeleteModal from "./DeleteModal";
import { RiResetLeftLine } from "react-icons/ri";
import PasswordResetModal from "./CopyPasswordModal";

function Users() {
  const [users, setUsers] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuStyles, setMenuStyles] = useState({ top: 0, right: 0, transformOrigin: "top" });
  const [userModal, setUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [tempPassword, setTempPassword] = useState("");
  // const [showModal, setShowModal] = useState(false);

  const userData = useSelector((state) => state?.auth?.auth);

  let userEmail = userData?.email;

  const buttonRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".actiondropdown")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const resetUserPassword = async (data) => {
  //   const payload = {
  //     action: "password-reset",
  //     admin_email: userEmail,
  //     admin_email: "amit@4spheresolutions.com",
  //     user_email: data?.email,
  //   };

  //   setLoading(true);

  //   try {
  //     const res = await fetch("https://manage-recruiter-accounts-v10-737421501165.us-east1.run.app", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });
  //     const data = await res.json();

  //     setApiMessage({ message: data.message || "Password reset email sent successfully.", type: "success" });
  //     setLoading(false);

  //     if (data.status === "success" && data.temp_password) {
  //       const decoded = atob(data.temp_password);
  //       setTempPassword(decoded);
  //       setShowModal(true);
  //     } else {
  //       setApiMessage({ message: data.message || "Failed to send password reset email.", type: "error" });
  //       setTempPassword("");
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     setApiMessage({ message: error.message || "An error occurred while resetting the password.", type: "error" });
  //     setTempPassword("");
  //   }
  // };

  useEffect(() => {
    if (userEmail) {
      getUserAccounts();
    }
  }, [userEmail]);

  const getUserAccounts = (isrefresh) => {
    let Payload = {
      action: "get-users",
      admin_email: userEmail,
      // admin_email: "amit@4spheresolutions.com",
    };
    if (!isrefresh) {
      setLoading(true);
    }
    fetch("https://manage-recruiter-accounts-v10-737421501165.us-east1.run.app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Payload),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.status === "success") {
          setOpenMenuId(null);
          setUsers(data.users);
        } else {
          console.error("Error fetching user accounts:", data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching user accounts:", error);
      });
  };

  const handleDelete = (user) => {
    if (!user || !user.id) return;

    let Payload = {
      action: "delete-user",
      admin_email: userEmail,
      // admin_email: "amit@4spheresolutions.com",
      user_id: user.id,
      confirm_delete: true,
    };
    setLoading(true);
    fetch("https://manage-recruiter-accounts-v10-737421501165.us-east1.run.app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Payload),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.status === "success") {
          getUserAccounts();
          setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
          setApiMessage({
            message: data.message || `User ${user.first_name} ${user.last_name} deleted successfully.`,
            type: "success",
          });
        } else {
          console.error("Error deleting user:", data.message);
          setApiMessage({ message: data.message || `Error deleting user`, type: "error" });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error deleting user:", error);
        setApiMessage({ message: error.message || `Error deleting user`, type: "error" });
      });
  };

  const handleToggle = (e, id) => {
    e.stopPropagation();
    const btn = buttonRefs.current[id];
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const menuHeight = 120;
    let top;
    let transformOrigin;
    if (rect.bottom + menuHeight > window.innerHeight) {
      top = rect.top - menuHeight;
      transformOrigin = "bottom";
    } else {
      top = rect.bottom;
      transformOrigin = "top";
    }
    const right = window.innerWidth - rect.right;
    setMenuStyles({ top: top + window.scrollY, right: right + window.scrollX, transformOrigin });
    setOpenMenuId(openMenuId === id ? null : id);
  };

  let editObject = typeof userModal == "object" ? userModal : {};

  const renderMenu = (user) => {
    let id = user.id;

    if (openMenuId !== id) return null;
    return ReactDOM.createPortal(
      <div
        className={`${styles.dropdownMenu} actiondropdown`}
        style={{
          position: "absolute",
          top: menuStyles.top,
          right: menuStyles.right,
          transformOrigin: menuStyles.transformOrigin,
        }}
      >
        <button
          className="dropdown-item w-100 text-start px-3 py-2"
          onClick={() => {
            let newUser = structuredClone(user);
            setOpenMenuId(null);
            delete newUser.id;
            setUserModal(newUser);
          }}
        >
          <AiOutlineEye className="me-2" /> View
        </button>
        <button
          className="dropdown-item w-100 text-start px-3 py-2"
          onClick={() => {
            setUserModal(user);
            setOpenMenuId(null);
          }}
        >
          <AiOutlineEdit className="me-2" /> Edit
        </button>
        {/* <button
          className="dropdown-item w-100 text-start px-3 py-2"
          onClick={() => {
            setOpenMenuId(null);
            resetUserPassword(user);
          }}
        >
          <RiResetLeftLine className="me-2" /> Reset Password
        </button> */}
        <button
          onClick={() => {
            setShowDeleteModal(user);
            setOpenMenuId(null);
          }}
          className="dropdown-item w-100 text-start px-3 py-2"
        >
          <AiOutlineDelete className="me-2 text-danger" /> Delete
        </button>
      </div>,
      document.body
    );
  };

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


  const [searchValue, setSearchValue] = useState('');

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
    const email = u.email?.toLowerCase() || '';
    const search = searchValue.toLowerCase();

    return fullName.includes(search) || email.includes(search);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalUsers);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Generate page numbers (1 to totalPages)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };



  return (
    <div className={styles.usersContainer}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div style={{ color: "#64748b", fontWeight: 400 }}>
          <h1 className="fw-600" style={{ fontSize: "1.8rem", letterSpacing: "-.025em", color: "black" }}>
            Users
          </h1>
          Manage User accounts and access permissions
        </div>
        <button
          type="button"
          onClick={() => setUserModal(true)}
          className={`${styles.actionButton} gap-2 d-flex align-items-center`}
        >
          <HiOutlineUserAdd /> Add User
        </button>
      </div>
      <div class="card border rounded shadow-sm bg-white p-4 mb-2">
        <div className="SearchFilters" style={{ margin: "-5px 0px 10px" }}>
          <div className="searchFilter userSearch">
            <Search className="searchIcon" size={"15px"} />
            <input
              type="text"
              className="searchInputtype2"
              placeholder="Search Users..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setCurrentPage(1); // reset to page 1 on search
              }}
            />

          </div>
          <div className="dropDownFilters">
            <div className="searchFilter">

              {/* <button
                  className="searchButton search"
                  onClick={() => {
                    setSearchValue('');
                    setCurrentPage(1);
                  }}
                >
                  <X size={16} />
                  Clear Filters
                </button> */}
            </div>

          </div>
        </div>
        <div className="table-responsive">
          <table
            className="table table-hover align-middle text-sm"
            cellSpacing={0}
            style={{ "--bs-table-hover-bg": "#f1f5f980" }}
          >
            <thead className="border-bottom">
              <tr>
                <th>Full Name</th>
                <th>Email ID</th>
                <th>Status</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <span className={styles.nameLink}>
                      {u.first_name} {u.last_name}
                    </span>
                  </td>
                  <td><Mail size={14} style={{ marginRight: "6px" }} />{u.email}{` `}
                    {u.mobile_no ? (
                      <>
                        <PhoneCallIcon size={14} style={{ marginRight: '6px', marginLeft: '12px' }} />
                        {formatUSPhoneNumber(u.mobile_no)}
                      </>
                    ) : null}
                  </td>
                  <td>
                    <span
                      className={styles[u.status]?.toLowerCase()}
                      style={{
                        textTransform: "capitalize",
                      }}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles["rolebadge"]} ${styles[u.user_role]}`}>{u.user_role}</span>
                  </td>
                  <td>
                    <button
                      ref={(el) => (buttonRefs.current[u.id] = el)}
                      type="button"
                      className={styles.dropdownToggle}
                      onClick={(e) => handleToggle(e, u.id)}
                    >
                      <BsThreeDotsVertical size={16} />
                    </button>
                    {renderMenu(u)}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
      <div className={`paginationC-Savvy-Emp d-flex justify-content-between align-items-center `} style={{marginBottom: "40px",}}>
        <div className="d-flex align-items-center gap-2">
          <span>Show</span>
          <select
            className="form-select pagination-dropdown"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 20].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <span>Rows</span>
        </div>

        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item navigationButton ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link rightLeft" onClick={() => handlePageChange(currentPage - 1)}>‹</button>
            </li>

            {pageNumbers.slice(0, 5).map((number) => (
              <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(number)}>{number}</button>
              </li>
            ))}

            {totalPages > 5 && <li className="page-item disabled"><span className="page-link">...</span></li>}

            {totalPages > 5 && (
              <li className={`page-item ${currentPage === totalPages ? "active" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
              </li>
            )}

            <li className={`page-item navigationButton ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link rightLeft" onClick={() => handlePageChange(currentPage + 1)}>›</button>
            </li>
          </ul>
        </nav>
      </div>


      <DeleteModal
        username={showDeleteModal?.first_name + " " + showDeleteModal?.last_name}
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
          handleDelete(showDeleteModal);
        }}
      />

      {/* <PasswordResetModal show={showModal} onClose={() => setShowModal(false)} password={tempPassword} /> */}

      {loading ? <CSavvyPageLoader loading={loading} loaderText="Loading ..." /> : <></>}
      {apiMessage && <Toast message={apiMessage.message} type={apiMessage.type} setType={"success"} setMessage={setApiMessage} />}
      <UserModal refresh={getUserAccounts} open={userModal} setOpen={setUserModal} data={editObject} />
    </div>
  );
}

export default Users;
