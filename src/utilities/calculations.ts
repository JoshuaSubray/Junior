/** 
    Class `GradeEntry` represents a single row of user defined entries.

    `name` - Name of the class

    `grade` - The grade the student recieved

    `weight` - The weight of the assessment

    `subEntries` - Used for splitting up labs, quizzes, or assignments that have different parts.

    For example, on the website a user may have input this:

    ```
    -------------------------
    | name | grade | weight |
    -------------------------
    | A1   | 80%   |   15%  |  <- row1 = new GradeEntry("A1", 80, 15)
    -------------------------
    | A2   | 75%   |   10%  |  <- row2 = new GradeEntry("A2", 75, 10)
    -------------------------
    ```

    An array of `GradeEntry` objects can represent all the grades entered for a class.

    In the previous example, the array "`[row1, row2]`" is a representation 
    of all the grades currently entered for the class. This array will grow as more entries are added. 

    `GradeEntry` is also recursive, `GradeEntry` objects may contain a list 
    of other `GradeEntry` objects to represent sub-entries. For our website, we will probably
    only allow users to create a single level of subentries, so no sub-sub-entries 
    or anything beyond that.

    `GradeEntry` permits null values for `name`, `grade`, and `weight`. This is to support 
    incomplete entries that may become complete later.
    
*/
class GradeEntry {
    name: string | null;
    private grade: number | null;
    private weight: number | null;
    private subEntries: GradeEntry[] | null;
    private parent: GradeEntry | null;

    constructor(name: string | null=null, grade: number | null=null, weight: number | null=null) {
        this.name = name;
        this.grade = grade;
        this.weight = weight;
        this.subEntries = null;

        this.parent = null;
    }

    /*
        Calculates average of the sub entries and sets grade value.
    */
    private calculateSubEntries() {
        if (this.subEntries !== null) {
            const avg = GradeCalculator.getWeightedAverage(this.subEntries);

            if (avg !== null){
                this.setGrade(avg);
            }
            else {
                this.grade = null;
            }
        }
    }

    /* 
        Recalculates parent entries.
    */
    private cascadeRecalculate() {
        if (this.parent !== null) {
            this.parent.calculateSubEntries();
        }
    }

    /*
        Grade setter method. 
    */
    public setGrade(grade: number) {
        this.grade = (grade >= 0) ? grade : 0;
        this.cascadeRecalculate();
    }

    /*
        Weight setter method.
    */
    public setWeight(weight: number) {
        this.weight = (weight >= 0) ? weight : 0;
        this.cascadeRecalculate();
    }
    
    /*
        Name setter method.
    */
    public setName(name: string) {
        this.name = name;
    }

    /*
        Grade getter method.
    */
    public getGrade() {
        return this.grade;
    }

    /*
        Weight getter method.
    */
    public getWeight() {
        return this.weight;
    }

    /*
        Adding a new subentry. A newly added subentry prompts a recalculation of the grade.
    */
    public addSubEntry(entry: GradeEntry) {
        if (this.subEntries === null) {
            this.subEntries = [entry]
        }
        else {
            this.subEntries.push(entry)
        }
        entry.parent = this;
        this.calculateSubEntries();
    }

    /*
        Removing a subentry. A removed subentry prompts a recalculation of the grade.
    */
    public removeSubEntry(entry: GradeEntry) {
        if (this.subEntries !== null) {
            const index = this.subEntries.indexOf(entry);

            if (index !== -1) {
                this.subEntries.splice(index, 1);
                this.calculateSubEntries();
            }
        }
    }
 }


/**
 * Interface to represent a complete grade entry.
 */
interface CompleteGradeEntry extends GradeEntry {
    getGrade(): number;
    getWeight(): number;
}

/**
 * Class comprises of static methods that perform operations on GradeEntry objects or lists of `GradeEntry` objects.
 *
 * `GradeEntry` objects which are "incomplete", i.e they have null `grade` or null `weight`, are ignored from calculations.
 * 
 * A calculation on an array of `GradeEntry` objects which are all incomplete results in `null` being returned.
 */
class GradeCalculator {
    /**
     * Helper for filtering entries. A complete entry is a `GradeEntry` object with a non-null `grade` and `weight` attribute.
     */
    private static isComplete(entry: GradeEntry): entry is CompleteGradeEntry {
        return entry.getGrade() !== null && entry.getWeight() !== null;
    }

    /**
     * Filters a list of entries to only include completed enetries.
     * 
     * @param entries An array of `GradeEntry` objects.
     * @returns An array of `CompleteGradeEntry` objects.
     */
    private static getComplete(entries: GradeEntry[]): CompleteGradeEntry[] {
        return entries.filter(GradeCalculator.isComplete);
    }

    /**
     * Helper function returns an object `{ average, weightedSum, sumOfWeights }` calculated from `entries`.
     */
    private static getWeightedAverageData(entries: GradeEntry[]): {
        average: number | null;
        weightedSum: number;
        sumOfWeights: number;
    } {
        const completedEntries = GradeCalculator.getComplete(entries);
        if (completedEntries.length === 0) {
            return { average: null, weightedSum: 0, sumOfWeights: 0 };
        } 
        
        const weightedSum = completedEntries.reduce((accumulator, current) => accumulator + (current.getGrade() * current.getWeight()), 0);
        const sumOfWeights = completedEntries.reduce((accumulator, current) => accumulator + current.getWeight(), 0);

        if (sumOfWeights === 0) {
            return { average: 0, weightedSum: weightedSum, sumOfWeights: sumOfWeights};
        }

        const average = weightedSum / sumOfWeights;
        return { average: average, weightedSum: weightedSum, sumOfWeights: sumOfWeights };
    }

    /**
    * Calculate the weighted average of `entries`.
    * 
    * @example
    * ```ts
    * const row1 = new GradeEntry("", 80, 50);
    * const row2 = new GradeEntry("", 70, 50);
    * const row3 = new GradeEntry("Incomplete", null, 80);
    * 
    * const classArray = [row1, row2, row3]; // Row 3 does not contribute to the calculation
    * 
    * const average: number = GradeCalculator.getWeightedAverage(classArray);
    * 
    * console.log(average);
    * // Output:
    * // 75
    * ```
    * 
    *  @param entries - An array of `GradeEntry` objects.
    * 
    *  @returns The weighted average of `entries`.
    */
    public static getWeightedAverage(entries: GradeEntry[]): number | null {
        return GradeCalculator.getWeightedAverageData(entries).average;
    }

   /**
    * Reverse calculates the grade needed on an assessment such that the resulting average equals `targetAverage`.
    * 
    * @example
    * ```ts
    *  // The class in the following example has a final exam weighted at 50%.
    *  const entry1 = new GradeEntry("Entry 1", 70, 25); 
    *  const entry2 = new GradeEntry("Entry 2", 75, 25);
    *  const exam = new GradeEntry("Exam", null, 50); 
    *   
    *  const classArray = [entry1, entry2, exam];
    *  
    *  // The following code asks: What grade do I need on the exam, which is weighted at 50%, to get an 80% in the class?
    *  const examGrade = GradeCalculator.getRequiredAssessmentGrade(
    *       exam.getWeight()!, 
    *       80, 
    *       classArray
    *  );
    *  
    *  console.log(examGrade);
    *  // Output:
    *  // 87.5
    * ```
    * @param assessmentWeight The weight of the assessment. 
    * @param targetAverage The target average.
    * @param entries An array of `GradeEntry` objects.
    * @returns The grade of the assessment that is required to achieve `targetAverage`.
    */
    public static getRequiredAssessmentGrade(assessmentWeight: number, targetAverage: number, entries: GradeEntry[]): number | null {
        const { average, sumOfWeights } = GradeCalculator.getWeightedAverageData(entries);
        if (average === null) return null;

        const currentAverage = average;
        
        if (assessmentWeight === 0) {
            return 0;
        }

        const assessmentGrade = ((sumOfWeights * (targetAverage - currentAverage)) + targetAverage * assessmentWeight) 
        / assessmentWeight;

        return assessmentGrade;
    }


    /**
     * Reverse calculates the grade of an assessment given its weight, the new average, and a class array.
     * @example
     * 
     * ```ts
     * // Scenario: A student recieves their final average in the course from their university, but the university does not show the student their exam grades. The student wishes reverse to calculate their exam grade.
     * 
     * const assignment1 = new GradeEntry("Assignment 1", 85, 20);
     * const assignment2 = new GradeEntry("Assignment 2", 75, 20);
     * const assignment3 = new GradeEntry("Assignment 3", 90, 20);
     * const exam = new GradeEntry("Exam", null, 40);
     * 
     * const classArray = [assignment1, assignment2, assignment3, exam];
     * 
     * const newAverage = 80; // The student's transcript shows they got an 80% in this course.
     * 
     * const examGrade = GradeCalculator.getIncompleteGrade(exam.getWeight()!, 80, classArray);
     * 
     * console.log(examGrade) 
     * // Output:
     * // 75
     * ```
     * @param assessmentWeight The weight of the assessment to reverse calculate the grade of.
     * @param newAverage The new average.
     * @param entries The array representing the class.
     * @returns 
     */
    public static getIncompleteGrade(assessmentWeight: number, newAverage: number, entries: GradeEntry[]): number | null {
        return GradeCalculator.getRequiredAssessmentGrade(assessmentWeight, newAverage, entries);
    }
}
