import { useEffect, useRef, useState } from 'react';

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
				className="item-name-edit-btn"
				title="Rename"
				onClick={(e) => {
					if (stopPropagationOnClick) e.stopPropagation();
					setEditing(true);
				}}
			>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M12 20h9"></path>
					<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
				</svg>
			</button>
			<span className="item-name-display">{value || placeholder}</span>
		</div>
	);
}