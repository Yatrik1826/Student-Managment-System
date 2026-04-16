import '../styles/ConfirmationModal.css';

const ConfirmationModal = ({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, isLoading = false, isDangerous = false }) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button
            className="modal-btn cancel-btn"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={`modal-btn confirm-btn ${isDangerous ? 'danger' : ''}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
