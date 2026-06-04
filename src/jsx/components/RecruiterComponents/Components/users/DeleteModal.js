import styles from "../../css/deletemodal.module.css";

const DeleteModal = ({ show, onClose, onConfirm, username }) => {
  if (!show) return null;

  return (
    <>
      <div className={styles.deletemodal__overlay} onClick={onClose} />
      <div className={styles.deletemodal__dialog} role="alertdialog" aria-modal="true">
        <div className={styles.deletemodal__header}>
          <h2 className={styles.deletemodal__title}>Are you sure?</h2>
          <p className={styles.deletemodal__description}>
            This action cannot be undone. This will permanently delete <b>{username}'s</b> account and remove all
            associated data.
          </p>
        </div>
        <div className={styles.deletemodal__footer}>
          <button className={styles.deletemodal__cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.deletemodal__actionBtn} onClick={onConfirm}>
            Delete User
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
