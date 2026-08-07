import { useGradeContext } from '../../contexts/GradeContext';
import './Entries.css';

export default function Entries() {
  const { semesters, activeSemesterId, addEntry, updateEntry, removeEntry } = useGradeContext();

  const activeSemester = semesters.find(s => s.id === activeSemesterId);

  if (!activeSemester) {
    return (
      <div className="entries-container">
        <p>Please create or select a semester first.</p>
      </div>
    );
  }

  const entries = activeSemester.entries;

  return (
    <div className="entries-container">
      <div className="entries-actions">
        <button className="entries-add-btn" onClick={addEntry}>
          + Add Entry
        </button>
      </div>
      
      {entries.length === 0 ? (
        <p>No entries yet for this semester. Click + to add one.</p>
      ) : (
        <div className="entries-list">
          {entries.map(entry => (
            <div key={entry.id} className="entry-card">
              <div className="entry-header">
                <span className="entry-title">{entry.name || 'Untitled Entry'}</span>
                <button 
                  className="entry-remove-btn"
                  onClick={() => removeEntry(entry.id)} 
                >
                  X
                </button>
              </div>
              
              <div className="entry-inputs-row">
                <label className="entry-label">
                  Name
                  <input 
                    type="text" 
                    value={entry.name} 
                    onChange={e => updateEntry(entry.id, { name: e.target.value })} 
                    className="entry-input"
                    placeholder="e.g. Assignment 1"
                  />
                </label>
                
                <label className="entry-label">
                  Earned Points
                  <input 
                    type="number" 
                    value={entry.pointsEarned} 
                    onChange={e => updateEntry(entry.id, { pointsEarned: parseFloat(e.target.value) || 0 })} 
                    className="entry-input"
                  />
                </label>
                
                <label className="entry-label">
                  Max Points
                  <input 
                    type="number" 
                    value={entry.pointsMax} 
                    onChange={e => updateEntry(entry.id, { pointsMax: parseFloat(e.target.value) || 0 })} 
                    className="entry-input"
                  />
                </label>
                
                <label className="entry-label">
                  Weight (%)
                  <input 
                    type="number" 
                    value={entry.weight} 
                    onChange={e => updateEntry(entry.id, { weight: parseFloat(e.target.value) || 0 })} 
                    className="entry-input"
                  />
                </label>
              </div>

              <div className="entry-checkboxes-row">
                <label className="entry-checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={entry.isExtraCredit}
                    onChange={e => updateEntry(entry.id, { isExtraCredit: e.target.checked })}
                  />
                  Extra Credit
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
