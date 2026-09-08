import { GradeEntry } from '../utilities/calculations/gradeEntry';
import type { Item, Category, Course } from '../contexts/GradeContext';

/**
 * Class GradeEntryAdapter converts the frontend grade data into GradeEntry objects for 
 * grade calculation. 
 */
export class GradeEntryAdapter {
    private static adaptCourseToGradeEntry(course: Course): GradeEntry {
        const courseEntry = new GradeEntry(
            course.name,
            null,
            1 // Every course is a one credit course by default, may change this later.
        );

        const categoryGradeEntries = course.categories.map((category: Category) => 
            GradeEntryAdapter.adaptCategoryToGradeEntry(category)
        );

        categoryGradeEntries.forEach((categoryGradeEntry: GradeEntry) =>
             (courseEntry.addSubEntry(categoryGradeEntry))
        );

        return courseEntry;
    }   

    private static adaptCategoryToGradeEntry(category: Category): GradeEntry {
        const categoryGradeEntry = new GradeEntry(
            category.name,
            null,
            category.totalWeight ?? 0,
        );

        const activeItems = category.items.filter(
            (item: Item) => !item.tags?.includes('dropped')
        );
        const itemGradeEntries = activeItems.map((item: Item) => GradeEntryAdapter.adaptItemToGradeEntry(item, category, activeItems.length));
        itemGradeEntries.forEach((itemGradeEntry: GradeEntry) => (categoryGradeEntry.addSubEntry(itemGradeEntry)));

        return categoryGradeEntry;
    }   

    private static adaptItemToGradeEntry(item: Item, category?: Category, activeItemCount?: number): GradeEntry {
        const count = activeItemCount ?? (category?.items.filter(i => !i.tags?.includes('dropped')).length ?? 0);
        const autoSplitWeight = category && category.totalWeight !== null && count > 0
            ? category.totalWeight / count
            : 0;

        const itemGradeEntry = new GradeEntry(
            item.name,
            item.grade !== null ? item.grade + item.gradeExtra : null,
            item.weightOverride ?? autoSplitWeight
        ) 
        return itemGradeEntry;
    }

    public static getCategoryGrade(category: Category): number | null {
        return GradeEntryAdapter.adaptCategoryToGradeEntry(category).getGrade();
    }

    public static getItemGrade(item: Item): number | null  {
        return GradeEntryAdapter.adaptItemToGradeEntry(item).getGrade();
    }

    public static getCourseGrade(course: Course): number | null {
        return GradeEntryAdapter.adaptCourseToGradeEntry(course).getGrade();
    }
}