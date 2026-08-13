import { useState } from 'react';
import { useGradeContext } from '../../contexts/GradeContext';
import Delete from '../common/Delete';

export default function Sidebar() {
  const { semesters, activeSemesterId, addSemester, updateSemester, removeSemester, setActiveSemester } = useGradeContext();
  const [editingSemesterId, setEditingSemesterId] = useState<number | null>(null);

  return (
    <aside className="semester" id="semester">
      <h2 className="section-title">Semesters</h2>
      <div className="section-content">
        <div className="sidebar-add-wrapper">
          <button
            onClick={addSemester}
            className="sidebar-add-btn"
          >
            + Add Semester
          </button>
        </div>

        {semesters.length === 0 ? (
          <p>No semesters yet.</p>
        ) : (
          <div className="sidebar-list">
            {semesters.map(semester => (
              <div
                key={semester.id}
                onClick={() => setActiveSemester(semester.id)}
                className={`sidebar-item${activeSemesterId === semester.id ? ' active' : ''}`}
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
                    className="sidebar-rename-input"
                  />
                ) : (
                  <div className="sidebar-name-row">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSemesterId(semester.id);
                      }}
                      className="icon-action-btn sidebar-rename-btn"
                      title="Rename"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </button>
                    <span className={`sidebar-name${activeSemesterId === semester.id ? ' active' : ''}`}>
                      {semester.name}
                    </span>
                  </div>
                )}
                <Delete 
                  className="sidebar-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSemester(semester.id);
                  }} 
                  title="Delete Semester"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
