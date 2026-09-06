import { useState } from 'react';
import { useGradeContext } from '../../contexts/GradeContext';
import { GradeEntryAdapter } from '../../adapters/gradeEntryAdapter';
import ClassModal from './ClassModal';
import Delete from '../common/Delete';
import Edit from '../common/Edit';
import AddItemButton from '../common/AddItemButton';
import './GPA.css';


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
        {courses.map(course => {
          const courseGrade = GradeEntryAdapter.getCourseGrade(course);

          return (<div 
            key={course.id} 
            className="course-row"
            onClick={() => setSelectedCourseId(course.id)}
          >
            <div className="course-row-left">
              <Edit
                value={course.name}
                onChange={(v) => updateCourse(course.id, { name: v })}
                placeholder="Untitled Class (e.g. MATH 101)"
                stopPropagationOnClick={true}
                inputClassName="course-title-input"
              />
              <div className="course-stats">
                <span>{course.categories.length} Categories</span>
                <span className="stats-separator">•</span>
                <span>{course.categories.reduce((acc, cat) => acc + cat.items.length, 0)} Items</span>
              </div>
            </div>
            
            <div className="course-row-right">
              <div className="course-grade-chip">
                <span className="grade-value">{courseGrade === null ? '—' : `${courseGrade.toFixed(2)}%`}</span>
              </div>
              <Delete 
                className="course-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCourse(course.id);
                  if (selectedCourseId === course.id) setSelectedCourseId(null);
                }}
                title="Delete Class"
              />
            </div>
          </div>)
      })}

        <AddItemButton
          label="Add Class"
          className="add-course-btn"
          onClick={addCourse}
        />
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
