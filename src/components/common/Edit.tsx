import { useEffect, useRef, useState } from 'react';
import RenameIcon from './RenameIcon';

interface EditProps {
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	className?: string;
	inputClassName?: string;
	stopPropagationOnClick?: boolean;
}

export default function Edit({ value, onChange, placeholder = '', className = '', inputClassName = '', stopPropagationOnClick = true }: EditProps) {
	const [editing, setEditing] = useState(false);
	const ref = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (editing && ref.current) ref.current.focus();
	}, [editing]);

	if (editing) {
		return (
			<input
				ref={ref}
				type="text"
				className={`item-name-input ${inputClassName}`}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onClick={(e) => { if (stopPropagationOnClick) e.stopPropagation(); }}
				onBlur={() => setEditing(false)}
				onKeyDown={(e) => { if (e.key === 'Enter') setEditing(false); }}
			/>
		);
	}

	return (
		<div className={`item-name-row ${className}`}>
			<button
				type="button"
				className="icon-action-btn item-name-edit-btn"
				title="Rename"
				onClick={(e) => {
					if (stopPropagationOnClick) e.stopPropagation();
					setEditing(true);
				}}
			>
				<RenameIcon />
			</button>
			<span className="item-name-display">{value || placeholder}</span>
		</div>
	);
}