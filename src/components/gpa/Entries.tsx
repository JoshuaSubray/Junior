import { useState } from 'react';
import { useGradeContext, type Course } from '../../contexts/GradeContext';
import ClassModal from './ClassModal';
import RemoveButton from '../common/RemoveButton';
import './GPA.css';

// Calculate course grade helper.
function calculateCourseGrade(course: Course): string {
  let totalPoints = 0;
  
  course.categories.forEach(category => {
    if (category.items.length === 0) return;
    
    // Auto-split weight.
    const autoWeight = category.totalWeight / category.items.length;
    
    category.items.forEach(item => {
      const effectiveWeight = item.weightOverride !== undefined ? item.weightOverride : autoWeight;
      // Grade is a direct percentage. Multiply by weight to get points.
      totalPoints += (item.grade / 100) * effectiveWeight;
    });
  });

  return totalPoints.toFixed(2) + '%';
}

export default function Entries() {
  const { semesters, activeSemesterId, addCourse, updateCourse, removeCourse } = useGradeContext();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const activeSemester = semesters.find(s => s.id === activeSemesterId);

  if (!activeSemester) {
    return (
      <div className="entries-container">
        <p>Please create or select a semester first.</p>
      </div>
    );
  }

  const courses = activeSemester.courses;
  const selectedCourse = courses.find(c => c.id === selectedCourseId) || null;

  return (
    <div className="entries-container">
      <div className="course-list">
        {courses.map(course => (
          <div 
            key={course.id} 
            className="course-row"
            onClick={() => setSelectedCourseId(course.id)}
          >
            <div className="course-row-left">
              <input
                type="text"
                className="course-title-input"
                value={course.name}
                onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                placeholder="Untitled Class (e.g. MATH 101)"
              />
              <div className="course-stats">
                <span>{course.categories.length} Categories</span>
                <span className="stats-separator">•</span>
                <span>{course.categories.reduce((acc, cat) => acc + cat.items.length, 0)} Items</span>
              </div>
            </div>
            
            <div className="course-row-right">
              <div className="course-grade-chip">
                <span className="grade-value">{calculateCourseGrade(course)}</span>
              </div>
              <RemoveButton 
                className="course-remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCourse(course.id);
                  if (selectedCourseId === course.id) setSelectedCourseId(null);
                }}
                title="Remove Class"
              />
            </div>
          </div>
        ))}

        <button className="course-row add-course-btn" onClick={addCourse}>
          + Add Class
        </button>
      </div>

      {selectedCourse && (
        <ClassModal
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourseId(null)}
          course={selectedCourse}
        />
      )}
    </div>
  );
}
