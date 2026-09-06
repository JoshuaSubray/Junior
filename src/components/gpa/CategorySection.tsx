import { useState, useRef, useEffect } from 'react';
import { useGradeContext, type Category, type ItemTag } from '../../contexts/GradeContext';
import { GradeEntryAdapter } from '../../adapters/gradeEntryAdapter';
import Delete from '../common/Delete';
import Edit from '../common/Edit';
import './GPA.css';

interface CategorySectionProps {
  courseId: string;
  category: Category;
}

const TAG_CONFIG: { tag: ItemTag; label: string; className: string }[] = [
  { tag: 'exam', label: 'Exam', className: 'item-tag-pill--exam' },
  { tag: 'gradeExtra', label: 'Extra Credit', className: 'item-tag-pill--extra-credit' },
  { tag: 'dropped', label: 'Dropped', className: 'item-tag-pill--dropped' },
];

function ItemTagCell({
  tags,
  onToggle,
}: {
  tags: ItemTag[];
  onToggle: (tag: ItemTag) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  return (
    <div className="item-tag-cell" ref={ref}>
      {TAG_CONFIG.filter(({ tag }) => tags.includes(tag)).map(({ tag, label, className }) => (
        <span key={tag} className={`item-tag-pill ${className}`}>{label}</span>
      ))}
      <button
        type="button"
        className="item-tag-add-btn"
        onClick={() => setOpen(prev => !prev)}
        title="Edit tags"
      >
        {tags.length === 0 ? '+ tag' : '✎'}
      </button>
      {open && (
        <div className="item-tag-dropdown">
          {TAG_CONFIG.map(({ tag, label, className }) => (
            <label key={tag} className="item-tag-dropdown-row">
              <input
                type="checkbox"
                checked={tags.includes(tag)}
                onChange={() => { onToggle(tag); }}
              />
              <span className={`item-tag-pill ${className}`}>{label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategorySection({ courseId, category }: CategorySectionProps) {
  const { updateCategory, removeCategory, addItem, updateItem, removeItem } = useGradeContext();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-calculated split weight for items in this category (excluding dropped items).
  const splitWeightValue = category.totalWeight ?? 0;
  const activeItemCount = category.items.filter(item => !item.tags?.includes('dropped')).length;
  const itemSplitWeight = activeItemCount > 0 && splitWeightValue > 0
    ? (splitWeightValue / activeItemCount).toFixed(2)
    : '0.00';

  const categoryGrade = GradeEntryAdapter.getCategoryGrade(category);

  function handleTagToggle(itemId: string, tag: ItemTag, currentTags: ItemTag[]) {
    const has = currentTags.includes(tag);
    const nextTags = has ? currentTags.filter(t => t !== tag) : [...currentTags, tag];
    // When removing gradeExtra, clear the gradeExtra value.
    if (has && tag === 'gradeExtra') {
      updateItem(courseId, category.id, itemId, { tags: nextTags, gradeExtra: 0 });
    } else {
      updateItem(courseId, category.id, itemId, { tags: nextTags });
    }
  }

  return (
    <div className="category-section">
      <div className="category-header">
        <div className="category-label-row">
          <span className="category-label">name</span>
          <span className="category-label category-label-small">GRADE</span>
          <span className="category-label category-label-small">WEIGHT</span>
        </div>
        
        <div className="category-title-row">
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

          <div className="category-grade-col" style={{ display: 'flex', justifyContent: 'center' }}>
            {categoryGrade !== null && (
              <span className="category-grade-chip">
                {categoryGrade.toFixed(1)}%
              </span>
            )}
          </div>

          <div className="category-weight-row" title="Category weight is evenly distributed among its items unless overridden.">
            <div className="category-weight">
              <input
                type="number"
                className="category-weight-input"
                value={category.totalWeight ?? 0}
                min="0"
                max="100"
                onFocus={(e) => {
                  if (category.totalWeight === 0 || category.totalWeight === null) {
                    e.target.select();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '.') {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const raw = e.target.value.trim();
                  const parsed = raw === '' ? 0 : parseInt(raw, 10);
                  const value = Number.isNaN(parsed) ? 0 : parsed;
                  const clamped = Math.min(100, Math.max(0, value));
                  updateCategory(courseId, category.id, { totalWeight: clamped });
                }}
                placeholder="0"
              />
              <span>%</span>
            </div>
          </div>
          
          <div className="category-spacer"></div>

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
              category.items.map((item, index) => {
                const tags: ItemTag[] = item.tags ?? [];
                const isDropped = tags.includes('dropped');
                const hasExtraCredit = tags.includes('gradeExtra');

                return (
                  <div key={item.id} className={`item-row${isDropped ? ' item-row--dropped' : ''}`}>
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
                        disabled={isDropped}
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
                        disabled={isDropped}
                      />
                      <span className="item-grade-symbol">%</span>
                    </div>

                    <ItemTagCell
                      tags={tags}
                      onToggle={(tag) => handleTagToggle(item.id, tag, tags)}
                    />

                    <Delete
                      className="item-delete-btn"
                      onClick={() => removeItem(courseId, category.id, item.id)}
                      title="Delete Item"
                    />

                    {hasExtraCredit && !isDropped && (
                      <div className="item-extra-credit-row">
                        <span className="item-extra-credit-label">+ Extra Credit</span>
                        <div className="item-extra-credit-wrapper">
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
                      </div>
                    )}
                  </div>
                );
              })
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
