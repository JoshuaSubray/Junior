import { useState } from 'react';
import { useGradeContext, type Category } from '../../contexts/GradeContext';
import Delete from '../common/Delete';
import Edit from '../common/Edit';
import './GPA.css';

interface CategorySectionProps {
  courseId: string;
  category: Category;
}

export default function CategorySection({ courseId, category }: CategorySectionProps) {
  const { updateCategory, removeCategory, addItem, updateItem, removeItem } = useGradeContext();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-calculated split weight for items in this category.
  const itemSplitWeight = category.items.length > 0
    ? (category.totalWeight / category.items.length).toFixed(2)
    : 0;

  return (
    <div className="category-section">
      <div className="category-header">
        <div className="category-label-row">
          <span className="category-label">name</span>
          <span className="category-label category-label-small">GRADE</span>
          <span className="category-label category-label-small">WEIGHT</span>
          <span className="category-label category-label-small">EXTRA</span>
        </div>

        <div className="category-title-row">
          <div className="category-title-area">
            <div className="category-main-line">
              <button
                type="button"
                className="category-collapse-btn"
                onClick={() => setIsCollapsed((prev) => !prev)}
                title={isCollapsed ? 'Expand category' : 'Collapse category'}
                aria-label={isCollapsed ? 'Expand category' : 'Collapse category'}
              >
                {isCollapsed ? '▸' : '▾'}
              </button>

              <Edit
                value={category.name}
                onChange={(v) => updateCategory(courseId, category.id, { name: v })}
                placeholder="Category Name"
                inputClassName="category-name-input"
                stopPropagationOnClick={false}
              />
            </div>
          </div>

          <div className="category-weight-row">
            <div className="category-split-weight">
              {category.items.length > 0 ? `${itemSplitWeight}%` : '0%'}
            </div>
            <div className="category-weight">
              <input
                type="number"
                className="category-weight-input"
                value={category.totalWeight}
                min="0"
                max="100"
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  let val = parseFloat(e.target.value);
                  if (isNaN(val)) val = 0;
                  if (val > 100) val = 100;
                  if (val < 0) val = 0;
                  updateCategory(courseId, category.id, { totalWeight: val });
                }}
                placeholder="0"
              />
              <span>%</span>
            </div>
          </div>

          <div className="category-actions">
            <Delete
              className="category-delete-btn"
              onClick={() => removeCategory(courseId, category.id)}
              title="Delete Category"
            />
          </div>
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div className="category-items">
            {category.items.length === 0 ? (
              <p className="category-empty-text">No items yet. Add one below.</p>
            ) : (
              category.items.map((item, index) => (
                <div key={item.id} className="item-row">
                  <span className="item-number">{index + 1}.</span>
                  <Edit
                    value={item.name}
                    onChange={(v) => updateItem(courseId, category.id, item.id, { name: v })}
                    placeholder="Item Name"
                  />
                  <div className="item-grade-wrapper">
                    <input
                      type="number"
                      className="item-grade-input"
                      value={item.grade ?? ''}
                      min="0"
                      max="100"
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const raw = e.target.value.trim();
                        if (raw === '') {
                          updateItem(courseId, category.id, item.id, { grade: null });
                        } else {
                          const val = parseFloat(raw);
                          if (isNaN(val)) {
                            updateItem(courseId, category.id, item.id, { grade: null });
                          } else {
                            const clamped = Math.min(100, Math.max(0, val));
                            updateItem(courseId, category.id, item.id, { grade: clamped });
                          }
                        }
                      }}
                      placeholder="0"
                    />
                    <span className="item-grade-symbol">%</span>
                  </div>

                  <div className="item-weight-display">
                    <input
                      type="number"
                      className="item-weight-input"
                      value={item.weightOverride ?? itemSplitWeight}
                      min="0"
                      max="100"
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const raw = e.target.value.trim();
                        if (raw === '') {
                          updateItem(courseId, category.id, item.id, { weightOverride: undefined });
                        } else {
                          const value = parseFloat(raw);
                          if (isNaN(value)) {
                            updateItem(courseId, category.id, item.id, { weightOverride: undefined });
                          } else {
                            const clamped = Math.min(100, Math.max(0, value));
                            updateItem(courseId, category.id, item.id, { weightOverride: clamped });
                          }
                        }
                      }}
                    />
                    <span className="item-grade-symbol">%</span>
                  </div>
                  <div className="item-extra-credit-wrapper" title="Extra credit">
                    <input
                      type="number"
                      className="item-extra-credit-input"
                      value={item.gradeExtra === 0 ? '' : item.gradeExtra}
                      min="0"
                      max="100"
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const raw = e.target.value.trim();
                        const value = parseFloat(raw);
                        if (isNaN(value)) {
                          updateItem(courseId, category.id, item.id, { gradeExtra: 0 });
                        } else {
                          const clamped = Math.min(100, Math.max(0, value));
                          updateItem(courseId, category.id, item.id, { gradeExtra: clamped });
                        }
                      }}
                      placeholder="0"
                      aria-label="Extra credit"
                    />
                    <span className="item-grade-symbol">%</span>
                  </div>

                  <Delete
                    className="item-delete-btn"
                    onClick={() => removeItem(courseId, category.id, item.id)}
                    title="Delete Item"
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
        </>
      )}
    </div>
  );
}
