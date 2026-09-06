import { GradeEntry } from '../utilities/calculations';
import { gpaPresetMap, letterGradePresetMap } from '../utilities/mappings/gradeMappingPresets';
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
            1 // Every course is a one credit course by default, may change this later
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

        const itemGradeEntries = category.items.map((item: Item) => GradeEntryAdapter.adaptItemToGradeEntry(item, category));
        itemGradeEntries.forEach((itemGradeEntry: GradeEntry) => (categoryGradeEntry.addSubEntry(itemGradeEntry)));

        return categoryGradeEntry;
    }   

    private static adaptItemToGradeEntry(item: Item, category?: Category): GradeEntry {
        const autoSplitWeight = category && category.totalWeight !== null && category.items.length > 0
            ? category.totalWeight / category.items.length
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

    /**
     *  Functions below map average percentage values to a GPA and letter grade.
     */

    public static getGPA(average: number | null) {
        if (average != null) {
            return gpaPresetMap.getStringValue(Math.round(average));
        }
        return "—";      
    }

    public static getLetterGrade(average: number | null) {
        if (average != null) {
            return letterGradePresetMap.getValue(Math.round(average));
        }
        return "—";     
    }

}