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
 * `GradeEntry` objects which are "incomplete", i.e they have both null `grade` and null `weight`, are ignored from calculations.
 * 
 * A calculation on an array of `GradeEntry` objects which are all incomplete results in `null` being returned.
 */
class GradeCalculator {
    
    /**
    * Calculate the weighted average of `entries`.
    * 
    * @example
    * ```ts
    * const row1 = new GradeEntry("", 80, 50);
    * const row2 = new GradeEntry("", 70, 50);
    * 
    * const classArray = [row1, row2];
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
        const completedEntries = entries.filter(GradeCalculator.isComplete);

        const weightedSum = completedEntries.reduce((accumulator, current) => accumulator + (current.getGrade() * current.getWeight()), 0);
        const sumOfWeights = completedEntries.reduce((accumulator, current) => accumulator + current.getWeight(), 0);

        if (completedEntries.length === 0) {
            return null;
        }

        if (sumOfWeights === 0) {
            return 0;
        }

        const average = weightedSum / sumOfWeights;
        return average;
    }

    /**
     * Helper for filtering entries. A complete entry is a `GradeEntry` object with a non-null `grade` and `weight` attribute.
     */
    private static isComplete(entry: GradeEntry): entry is CompleteGradeEntry {
        return entry.getGrade() !== null && entry.getWeight() !== null;
    }

   /**
    * Reverse calculates the grade needed on an assessment such that the resulting average equals `targetAverage`.
    * 
    * @example
    * ```ts
    *  // Assume the class also has an exam worth 50%.
    *  // There is no "exam" entry because the grade for the exam is currently unknown in this example.
    *  const row1 = new GradeEntry("", 70, 25);
    *  const row2 = new GradeEntry("", 75, 25);
    *   
    *  const classArray = [row1, row2];
    *  
    *  // The following code asks: What grade do I need on the exam, which is weighted at 50%, to get an 80% in the class?
    *  const examGrade = GradeCalculator.getRequiredAssessmentGrade(50, 80, classArray);
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
    public static getRequiredAssessmentGrade(assessmentWeight: number,  targetAverage: number, entries: GradeEntry[]): number | null {
        const completedEntries = entries.filter(GradeCalculator.isComplete);

        if (completedEntries.length === 0) {
            return null;
        }

        const sumOfWeights = completedEntries.reduce((accumulator, current) => accumulator + current.getWeight()!, 0);
        const currentAverage = GradeCalculator.getWeightedAverage(entries);

        if (assessmentWeight === 0) {
            return 0;
        }

        if (currentAverage === null) {
            return null;
        }

        const assessmentGrade = ((sumOfWeights * (targetAverage - currentAverage)) + targetAverage * assessmentWeight) 
        / assessmentWeight;

        return assessmentGrade;
    }
}
