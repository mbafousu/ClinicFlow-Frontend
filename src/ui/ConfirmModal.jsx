export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>Confirm Action</h2>
        </div>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>
            Cancel
          </button>

          <button className="danger-btn" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}