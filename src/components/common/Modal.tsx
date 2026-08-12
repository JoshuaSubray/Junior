import { type ReactNode, useEffect } from 'react';
import RemoveButton from './RemoveButton';
import './Common.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling.
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <RemoveButton className="modal-close-btn" onClick={onClose} title="Close Modal" />
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
}