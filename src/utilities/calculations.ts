/*
    Class GradeEntry represents a single row of user defined entries.

    name - Name of the class
    grade - The grade the student recieved
    weight - The weight of the assessment
    subEntries - Used for splitting up labs, quizzes, or assignments that have different parts.

    For example, on the website a user may have input this:

    | name | grade | weight |
    -------------------------
    | A1   | 80%   |   15%  |  <- row1 = new GradeEntry("A1", 80, 15)
    -------------------------
    | A2   | 75%   |   10%  |  <- row2 = new GradeEntry("A2", 75, 10)


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

// Static class that contains methods to perform different operations on a list of GradeEntry objects
class GradeCalculator {

    /* 
        Return a weighted average from a list of GradeEntry objects.
    */

    public static getWeightedAverage(entries: GradeEntry[]): number {
        const weightedSum = entries.reduce((accumulator, current) => accumulator + (current.grade * current.weight), 0);
        const sumOfWeights = entries.reduce((accumulator, current) => accumulator + current.weight, 0);
        const average = weightedSum / sumOfWeights;

        return average;
    }
}


