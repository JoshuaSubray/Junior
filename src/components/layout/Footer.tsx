import { useState } from 'react';
import { useGradeContext } from '../../contexts/GradeContext';
import SettingsIcon from '../../assets/SettingsIcon.svg';
import SettingsModal from '../modals/SettingsModal';

export default function Footer() {
  const { resetData, loadData } = useGradeContext();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleDownload = () => {
    const dataStr = localStorage.getItem('junior_grade_calculator_data');
    if (dataStr) {
      try {
        const parsed = JSON.parse(dataStr);
        const formattedStr = JSON.stringify(parsed, null, 2);
        const blob = new Blob([formattedStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'JUNIOR_SAVE.json';
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        alert('Failed to process save data.');
      }
    } else {
      alert('No save data found to download.');
    }
    setSettingsOpen(false);
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content) {
            loadData(content);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
    setSettingsOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm('Reset all save data? This will clear your local save.')) {
      resetData();
    }
    setSettingsOpen(false);
  };

  return (
    <footer className="footer" id="footer">
      <p>&copy; {new Date().getFullYear()} Junior: Grade Calculator. All rights reserved.</p>

      <div className="footer-settings-container">
        <button
          type="button"
          className="footer-reset-btn"
          onClick={() => setSettingsOpen(true)}
          title="Settings"
          aria-label="Settings"
        >
          <span className="footer-reset-icon" aria-hidden="true">
            <img src={SettingsIcon} alt="Settings" style={{ width: '100%', height: '100%' }} />
          </span>
        </button>

        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onDownload={handleDownload}
          onLoad={handleLoad}
          onDelete={handleDelete}
        />
      </div>
    </footer>
  );
}
