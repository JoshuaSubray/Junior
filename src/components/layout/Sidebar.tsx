import { useGradeContext } from '../../contexts/GradeContext';

export default function Sidebar() {
  const { semesters, activeSemesterId, addSemester, removeSemester, setActiveSemester } = useGradeContext();

  return (
    <aside className="semester" id="semester">
      <h2 className="section-title">Semesters</h2>
      <div className="section-content">
        <div style={{ marginBottom: '16px' }}>
          <button 
            onClick={addSemester} 
            style={{ width: '100%', padding: '8px', cursor: 'pointer', background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-h)' }}
          >
            + Add Semester
          </button>
        </div>

        {semesters.length === 0 ? (
          <p>No semesters yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {semesters.map(semester => (
              <div 
                key={semester.id} 
                onClick={() => setActiveSemester(semester.id)}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px', 
                  border: activeSemesterId === semester.id ? '2px solid var(--accent)' : '1px solid var(--border)', 
                  borderRadius: '4px', 
                  backgroundColor: 'var(--code-bg)',
                  cursor: 'pointer'
                }}
              >
                <span style={{ color: 'var(--text-h)', fontWeight: activeSemesterId === semester.id ? 'bold' : 'normal' }}>
                  Semester {semester.id}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSemester(semester.id);
                  }} 
                  style={{ padding: '4px', cursor: 'pointer', border: 'none', background: 'transparent', color: 'red', fontWeight: 'bold' }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
