import Modal from '../common/Modal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  onLoad: () => void;
  onDelete: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onDownload,
  onLoad,
  onDelete,
}: SettingsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="footer-settings-menu">
        <button className="footer-settings-item" onClick={onDownload}>
          Download Save
        </button>
        <button className="footer-settings-item" onClick={onLoad}>
          Load Save
        </button>
        <button className="footer-settings-item danger" onClick={onDelete}>
          Delete Save
        </button>
      </div>
    </Modal>
  );
}
