import { useGradeContext, type Course } from '../../contexts/GradeContext';
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

  const totalWeight = course.categories.reduce((acc, cat) => acc + (cat.totalWeight || 0), 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editing: ${course.name || 'Untitled Class'}`}>
      <div className="class-modal-body">
        {course.categories.length === 0 ? (
          <div className="class-modal-empty">
            <p>No categories yet. Create a category (e.g. "Assignments", "Exams") to get started.</p>
          </div>
        ) : (
          <div className="class-modal-categories">
            {course.categories.map(category => (
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
