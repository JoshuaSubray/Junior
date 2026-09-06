import { type ButtonHTMLAttributes } from 'react';
import './Common.css';

interface AddItemButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export default function AddItemButton({ label, className = '', ...props }: AddItemButtonProps) {
  return (
    <button type="button" className={`add-item-btn ${className}`} {...props}>
      <span className="add-item-plus">+</span>
      {label}
    </button>
  );
}
