import { useGradeContext } from '../../contexts/GradeContext';

export default function Entries() {
  const { semesters, activeSemesterId, addEntry, removeEntry } = useGradeContext();

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
      <div style={{ marginBottom: '16px' }}>
        <button 
          onClick={addEntry} 
          style={{ padding: '8px 16px', cursor: 'pointer', background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-h)' }}
        >
          + Add Entry
        </button>
      </div>
      
      {entries.length === 0 ? (
        <p>No entries yet for this semester. Click + to add one.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {entries.map(entry => (
            <div 
              key={entry.id} 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--border)', borderRadius: '4px', backgroundColor: 'var(--code-bg)' }}
            >
              <span style={{ color: 'var(--text-h)' }}>Entry {entry.id}</span>
              <button 
                onClick={() => removeEntry(entry.id)} 
                style={{ padding: '4px 8px', cursor: 'pointer', border: 'none', background: 'transparent', color: 'red', fontWeight: 'bold' }}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
