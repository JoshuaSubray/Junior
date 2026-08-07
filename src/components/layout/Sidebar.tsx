import { useState } from 'react';
import { useGradeContext } from '../../contexts/GradeContext';

export default function Sidebar() {
  const { semesters, activeSemesterId, addSemester, updateSemester, removeSemester, setActiveSemester } = useGradeContext();
  const [editingSemesterId, setEditingSemesterId] = useState<number | null>(null);

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
                  cursor: 'pointer',
                  gap: '8px'
                }}
              >
                {editingSemesterId === semester.id ? (
                  <input 
                    value={semester.name}
                    onChange={(e) => updateSemester(semester.id, { name: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    onBlur={() => setEditingSemesterId(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setEditingSemesterId(null);
                      }
                    }}
                    autoFocus
                    style={{ 
                      background: 'var(--bg)', 
                      border: '1px solid var(--accent)', 
                      borderRadius: '4px',
                      color: 'var(--text-main)', 
                      padding: '4px',
                      fontSize: 'inherit',
                      outline: 'none',
                      width: '100%'
                    }}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, overflow: 'hidden' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSemesterId(semester.id);
                      }}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer', 
                        color: 'var(--text-main)',
                        opacity: 0.6,
                        padding: '2px 4px',
                        fontSize: '12px'
                      }}
                      title="Rename"
                    >
                      W
                    </button>
                    <span 
                      style={{ 
                        color: 'var(--text-h)', 
                        fontWeight: activeSemesterId === semester.id ? 'bold' : 'normal',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {semester.name}
                    </span>
                  </div>
                )}
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
