import { useGradeContext, type Category } from '../../contexts/GradeContext';
import RemoveButton from '../common/RemoveButton';
import './GPA.css';

interface CategorySectionProps {
  courseId: string;
  category: Category;
}

export default function CategorySection({ courseId, category }: CategorySectionProps) {
  const { updateCategory, removeCategory, addItem, updateItem, removeItem } = useGradeContext();

  // Auto-calculated split weight for items in this category.
  const itemSplitWeight = category.items.length > 0 
    ? (category.totalWeight / category.items.length).toFixed(2)
    : 0;

  return (
    <div className="category-section">
      <div className="category-header">
        <div className="category-title-area">
          <input
            type="text"
            className="category-name-input"
            value={category.name}
            onChange={(e) => updateCategory(courseId, category.id, { name: e.target.value })}
            placeholder="Category Name (e.g. Assignments)"
          />
          <div className="category-weight">
            <label>
              Weight:
              <input
                type="number"
                className="category-weight-input"
                value={category.totalWeight}
                min="0"
                max="100"
                onChange={(e) => {
                  let val = parseFloat(e.target.value);
                  if (isNaN(val)) val = 0;
                  if (val > 100) return; // Prevent value over 100.
                  if (val < 0) val = 0;
                  updateCategory(courseId, category.id, { totalWeight: val });
                }}
                placeholder="0"
              />
              %
            </label>
          </div>
        </div>
        <RemoveButton 
          className="category-remove-btn" 
          onClick={() => removeCategory(courseId, category.id)}
          title="Remove Category"
        />
      </div>

      <div className="category-items">
        {category.items.length === 0 ? (
          <p className="category-empty-text">No items yet. Add one below.</p>
        ) : (
          category.items.map((item, index) => (
            <div key={item.id} className="item-row">
              <span className="item-number">{index + 1}.</span>
              <input
                type="text"
                className="item-name-input"
                value={item.name}
                onChange={(e) => updateItem(courseId, category.id, item.id, { name: e.target.value })}
                placeholder="Item Name"
              />
              <div className="item-grade-wrapper">
                <input
                  type="number"
                  className="item-grade-input"
                  value={item.grade}
                  onChange={(e) => updateItem(courseId, category.id, item.id, { grade: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
                <span className="item-grade-symbol">%</span>
              </div>
              
              <div className="item-weight-display">
                {item.weightOverride !== undefined ? (
                  <span className="item-weight-override">{item.weightOverride}% (override)</span>
                ) : (
                  <span className="item-weight-auto">{itemSplitWeight}% (auto)</span>
                )}
              </div>

              <label className="item-extra-credit-label">
                <input
                  type="checkbox"
                  checked={item.isExtraCredit}
                  onChange={(e) => updateItem(courseId, category.id, item.id, { isExtraCredit: e.target.checked })}
                />
                Bonus
              </label>

              <RemoveButton
                className="item-remove-btn"
                onClick={() => removeItem(courseId, category.id, item.id)}
                title="Remove Item"
              />
            </div>
          ))
        )}
      </div>
      
      <button 
        className="category-add-item-btn" 
        onClick={() => addItem(courseId, category.id)}
      >
        + Add Item
      </button>
    </div>
  );
}
