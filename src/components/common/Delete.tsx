import { type ButtonHTMLAttributes } from 'react';
import './Common.css';

interface DeleteProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
}

export default function Delete({ title = "Delete", className = "", ...props }: DeleteProps) {
  return (
    <button 
      className={`common-delete-btn ${className}`} 
      title={title}
      type="button"
      {...props}
    >
      &times;
    </button>
  );
}
