import React, { useEffect, useState } from "react";
import Toast from "../../toastSucces";

import styles from "../../css/PasswordResetDialog.module.css";
import { CheckCircle, Copy, X, AlertTriangle } from "lucide-react";

const PasswordResetDialog = ({ onClose, password, show, userName }) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (show) {
      setShowMessage("");
    }
  }, [show]);

  const handleCopy = () => {
    if (password) {
      setShowMessage(true);
      navigator.clipboard.writeText(password);
    }
  };

  if (!show) {
    return null; // Don't render anything if show is false
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <button className={styles.closeButton} onClick={onClose}>
          <X className={styles.iconSmall} />
        </button>
        <div className={styles.header}>
          <CheckCircle className={styles.successIcon} />
          <h2 className={styles.title} style={{textAlign:"center"}}>Password Reset Successfully</h2>
          <p className={styles.description}>
            A new temporary password has been generated for <b>{userName}</b>. Please share this password securely with
            the user.
          </p>
        </div>

        <div className={styles.passwordSection}>
          <div className={styles.passwordHeader}>
            <span className={styles.passwordLabel}>Temporary Password</span>
          </div>
          <div className={styles.passwordBody}>
            <span className={styles.passwordText}>{password}</span>
            <button className={styles.iconButton} onClick={handleCopy}>
              <Copy className={styles.iconSmall} />
            </button>
          </div>
        </div>

        <div className={styles.warning}>
          <AlertTriangle className={styles.warningIcon} />
          <p className={styles.warningText}>
            Please share this password securely with the user. They should change it upon first login.
          </p>
        </div>

        <div className={styles.footer}>
          <button className={styles.confirmButton} onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
      {showMessage ? (
        <Toast message={"Password copied to clipboard!"} type={"success"} setMessage={() => setShowMessage(false)} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default PasswordResetDialog;
