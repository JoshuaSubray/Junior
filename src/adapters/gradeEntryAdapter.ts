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
            50, // Category weights set to 50% by default, change to category.totalWeight later 
        );

        const itemGradeEntries = category.items.map((item: Item) => GradeEntryAdapter.adaptItemToGradeEntry(item));
        itemGradeEntries.forEach((itemGradeEntry: GradeEntry) => (categoryGradeEntry.addSubEntry(itemGradeEntry)));

        return categoryGradeEntry;
    }   

    private static adaptItemToGradeEntry(item: Item): GradeEntry {
        const itemGradeEntry = new GradeEntry(
            item.name,
            item.grade + item.gradeExtra,
            item.weightOverride ?? 0
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