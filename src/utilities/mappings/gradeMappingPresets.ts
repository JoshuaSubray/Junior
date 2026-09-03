import { GPAMap, LetterGradeMap } from "./gradeMapping";
import { RangeMapping } from "./rangeMapping";


/**
 * GPA Preset. 
 * 
 * Follows the UofT GPA system.
 */
const gpaMapping = new RangeMapping<number>();

gpaMapping.addRange({
    lowerBound: 0,
    upperBound: 49,
    value: 0.0
});

gpaMapping.addRange({
    lowerBound: 50,
    upperBound: 52,
    value: 0.7
});

gpaMapping.addRange({
    lowerBound: 53,
    upperBound: 56,
    value: 1.0
});

gpaMapping.addRange({
    lowerBound: 57,
    upperBound: 59,
    value: 1.3
});

gpaMapping.addRange({
    lowerBound: 60,
    upperBound: 62,
    value: 1.7
});

gpaMapping.addRange({
    lowerBound: 63,
    upperBound: 66,
    value: 2.0
});

gpaMapping.addRange({
    lowerBound: 67,
    upperBound: 69,
    value: 2.3
});

gpaMapping.addRange({
    lowerBound: 70,
    upperBound: 72,
    value: 2.7
});

gpaMapping.addRange({
    lowerBound: 73,
    upperBound: 76,
    value: 3.0
});

gpaMapping.addRange({
    lowerBound: 77,
    upperBound: 79,
    value: 3.3
});

gpaMapping.addRange({
    lowerBound: 80,
    upperBound: 84,
    value: 3.7
});

gpaMapping.addRange({
    lowerBound: 85,
    upperBound: 89,
    value: 4.0
});

gpaMapping.addRange({
    lowerBound: 90,
    upperBound: 100,
    value: 4.0
});

/**
 * Letter grade present.
 * 
 * Follows the UofT letter grade system.
 */
const letterGradeMapping = new RangeMapping<string>();

letterGradeMapping.addRange({
    lowerBound: 0,
    upperBound: 49,
    value: "F"
});

letterGradeMapping.addRange({
    lowerBound: 50,
    upperBound: 52,
    value: "D-"
});

letterGradeMapping.addRange({
    lowerBound: 53,
    upperBound: 56,
    value: "D"
});

letterGradeMapping.addRange({
    lowerBound: 57,
    upperBound: 59,
    value: "D+"
});

letterGradeMapping.addRange({
    lowerBound: 60,
    upperBound: 62,
    value: "C-"
});

letterGradeMapping.addRange({
    lowerBound: 63,
    upperBound: 66,
    value: "C"
});

letterGradeMapping.addRange({
    lowerBound: 67,
    upperBound: 69,
    value: "C+"
});

letterGradeMapping.addRange({
    lowerBound: 70,
    upperBound: 72,
    value: "B-"
});

letterGradeMapping.addRange({
    lowerBound: 73,
    upperBound: 76,
    value: "B"
});

letterGradeMapping.addRange({
    lowerBound: 77,
    upperBound: 79,
    value: "B+"
});

letterGradeMapping.addRange({
    lowerBound: 80,
    upperBound: 84,
    value: "A-"
});

letterGradeMapping.addRange({
    lowerBound: 85,
    upperBound: 89,
    value: "A"
});

letterGradeMapping.addRange({
    lowerBound: 90,
    upperBound: 100,
    value: "A+"
});

// Export the GPA and letter grade maps
export const gpaPresetMap = new GPAMap(gpaMapping);
export const letterGradePresetMap = new LetterGradeMap(letterGradeMapping);