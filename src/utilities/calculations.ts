/** 
    Class GradeEntry represents a single row of user defined entries.

    name - Name of the class

    grade - The grade the student recieved

    weight - The weight of the assessment

    subEntries - Used for splitting up labs, quizzes, or assignments that have different parts.

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

    An array of GradeEntry objects can represent all the grades entered for a class.

    In the previous example, the array "[row1, row2]" is a representation 
    of all the grades currently entered for the class. This array will grow as more entries are added. 

    GradeEntry is also recursive, GradeEntry objects may contain a list 
    of other GradeEntry objects to represent sub-entries. For our website, we will probably
    only allow users to create a single level of subentries, so no sub-sub-entries 
    or anything beyond that.
    
*/
class GradeEntry {
    name: string;
    grade: number;
    weight: number;
    subEntries: null | GradeEntry[];

    constructor(name: string, grade: number, weight: number, subEntries: null | GradeEntry[]=null) {
        this.name = name;
        this.grade = grade;
        this.weight = weight;
        this.subEntries = subEntries;

        if (subEntries != null) {
            this.calculateSubEntries();
        }
    }

    /*
        Calculates average of the sub entries and sets grade value.
    */
    private calculateSubEntries() {
        if (this.subEntries != null) {
            const avg: number = GradeCalculator.getWeightedAverage(this.subEntries);
            this.setGrade(avg);
        }
    }

    /*
        Grade setter method. 
    */
    public setGrade(grade: number) {
        this.grade = grade;
    }
    
    /*
        Adding a new subentry. A newly added subentry prompts a recalculation of the grade
    */
    public addSubEntry(entry: GradeEntry) {
        if (this.subEntries == null) {
            this.subEntries = [entry]
        }
        else {
            this.subEntries.push(entry)
        }
        this.calculateSubEntries();
    }
 }


/**
 * Class comprises of static methods that perform operations on GradeEntry objects or lists of GradeEntry objects.
 *
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
    *  @param entries - An array of GradeEntry objects.
    * 
    *  @returns The weighted average of `entries`.
    */

    public static getWeightedAverage(entries: GradeEntry[]): number {
        const weightedSum = entries.reduce((accumulator, current) => accumulator + (current.grade * current.weight), 0);
        const sumOfWeights = entries.reduce((accumulator, current) => accumulator + current.weight, 0);

        if (sumOfWeights === 0) {
            return 0;
        }

        const average = weightedSum / sumOfWeights;
        return average;
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
    * @param entries An array of GradeEntry objects.
    * @returns The grade of the assessment that is required to achieve `targetAverage`.
    */
    public static getRequiredAssessmentGrade(assessmentWeight: number,  targetAverage: number, entries: GradeEntry[]): number {
        const sumOfWeights = entries.reduce((accumulator, current) => accumulator + current.weight, 0);
        const currentAverage = GradeCalculator.getWeightedAverage(entries);

        if (assessmentWeight === 0) {
            return 0;
        }

        const assessmentGrade = ((sumOfWeights * (targetAverage - currentAverage)) + targetAverage * assessmentWeight) / assessmentWeight;
        return assessmentGrade;
    }
}


