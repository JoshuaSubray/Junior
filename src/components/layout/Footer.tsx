import { useGradeContext } from '../../contexts/GradeContext';

export default function Footer() {
  const { resetData } = useGradeContext();

  return (
    <footer className="footer" id="footer">
      <p>&copy; {new Date().getFullYear()} Junior: Grade Calculator. All rights reserved.</p>

      <button
        type="button"
        className="footer-reset-btn"
        onClick={() => {
          if (window.confirm('Reset all save data? This will clear your local save.')) {
            resetData();
          }
        }}
        title="Reset saved data"
        aria-label="Reset saved data"
      >
        <span className="footer-reset-icon" aria-hidden="true">⚙</span>
      </button>
    </footer>
  );
}
