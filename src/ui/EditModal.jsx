export default function EditModal({
  title,
  isOpen,
  onClose,
  onSubmit,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-form">
          <div className="modal-body">{children}</div>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}