import { useGradeContext, type Course } from '../../contexts/GradeContext';
import { getCourseGradeData } from '../../utilities/gradeService';
import Modal from '../common/Modal';
import CategorySection from './CategorySection';
import './GPA.css';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

export default function ClassModal({ isOpen, onClose, course }: ClassModalProps) {
  const { addCategory } = useGradeContext();

  const totalWeight = course.categories.reduce((acc, cat) => acc + (cat.totalWeight ?? 0), 0);
  const {courseGrade, courseLetterGrade, courseGPA } = getCourseGradeData(course);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={course.name || 'Untitled Class'}>
      <div className="class-modal-body class-modal-body-simple">
        <div className="class-modal-top-summary">
          <div className="class-modal-stat">
            <span className="class-modal-stat-label">GPA</span>
            <strong className="class-modal-stat-value">{courseGPA !== null ? courseGPA : "—"}</strong>
          </div>
          <div className="class-modal-stat">
            <span className="class-modal-stat-label">AVG</span>
            <strong className="class-modal-stat-value">
              {courseGrade !== null ? courseGrade : "—"}
            </strong>
          </div>
          <div className="class-modal-stat">
            <span className="class-modal-stat-label">Grade</span>
            <strong className="class-modal-stat-value">{courseLetterGrade !== null ? courseLetterGrade : "—" }</strong>
          </div>
        </div>

        {course.categories.length === 0 ? (
          <div className="class-modal-empty">
            <p>No categories yet. Create a category to get started.</p>
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
            <span className="weight-label">Total</span>
            <span className={`weight-value ${totalWeight === 100 ? 'perfect-weight' : ''}`}>
              {totalWeight}%
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
