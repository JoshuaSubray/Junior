import { useGradeContext, type Course } from '../../contexts/GradeContext';
import Modal from '../common/Modal';
import CategorySection from './CategorySection';
import SummaryClass from './SummaryClass';
import SummaryGPA from './SummaryGPA';
import './GPA.css';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

function calculateCourseGradeValue(course: Course): number {
  let totalPoints = 0;
  let totalWeight = 0;

  course.categories.forEach((category) => {
    if (category.items.length === 0) return;

    const categoryWeight = category.totalWeight || 0;
    const autoWeight = categoryWeight / category.items.length;

    category.items.forEach((item) => {
      const effectiveWeight = item.weightOverride ?? autoWeight;
      totalPoints += (item.grade / 100) * effectiveWeight;
      totalWeight += effectiveWeight;
    });
  });

  return totalWeight > 0 ? (totalPoints / totalWeight) * 100 : 0;
}

export default function ClassModal({ isOpen, onClose, course }: ClassModalProps) {
  const { addCategory, semesters, activeSemesterId } = useGradeContext();

  const totalWeight = course.categories.reduce((acc, cat) => acc + (cat.totalWeight || 0), 0);
  const gradeValue = calculateCourseGradeValue(course);
  const activeSemester = semesters.find((semester) => semester.id === activeSemesterId);
  const semesterCourses = activeSemester?.courses ?? [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editing: ${course.name || 'Untitled Class'}`}>
      <div className="class-modal-body">
        <div className="class-modal-summary">
          <div className="summary-stat summary-grade">
            <span className="summary-label">Grade</span>
            <strong className="summary-value">{gradeValue.toFixed(1)}%</strong>
          </div>

          <SummaryClass course={course} />
          <SummaryGPA courses={semesterCourses} />
        </div>

        {course.categories.length === 0 ? (
          <div className="class-modal-empty">
            <p>No categories yet. Create a category (e.g. "Assignments", "Exams") to get started.</p>
          </div>
        ) : (
          <div className="class-modal-categories">
            {course.categories.map((category) => (
              <CategorySection 
                key={category.id} 
                courseId={course.id} 
                category={category} 
              />
            ))}
          </div>
        )}
        
        <div className="class-modal-footer">
          <div className="class-modal-weight-summary">
            <span className="weight-label">Total Weight:</span>
            <span className={`weight-value ${totalWeight === 100 ? 'perfect-weight' : ''}`}>
              {totalWeight}% / 100%
            </span>
          </div>
          <button 
            className="class-modal-add-btn" 
            onClick={() => addCategory(course.id)}
          >
            + Add Category
          </button>
        </div>
      </div>
    </Modal>
  );
}
