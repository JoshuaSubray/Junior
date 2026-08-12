import { type ButtonHTMLAttributes } from 'react';
import './Common.css';

interface RemoveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
}

export default function RemoveButton({ title = "Remove", className = "", ...props }: RemoveButtonProps) {
  return (
    <button 
      className={`common-remove-btn ${className}`} 
      title={title}
      type="button"
      {...props}
    >
      &times;
    </button>
  );
}
