import { useState } from 'react';
import { useGradeContext } from '../../contexts/GradeContext';
import SettingsIcon from '../../assets/SettingsIcon.svg';
import SettingsModal from '../modals/SettingsModal';
import { downloadSaveData, promptLoadSaveData } from '../../utilities/exim';

export default function Footer() {
  const { resetData, loadData } = useGradeContext();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleDownload = () => {
    const success = downloadSaveData();
    if (!success) {
      alert('Failed to process save data or no save data found to download.');
    }
    setSettingsOpen(false);
  };

  const handleLoad = () => {
    promptLoadSaveData((content) => {
      loadData(content);
    });
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
