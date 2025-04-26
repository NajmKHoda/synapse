import Assignment from "../data/Assignment";
import Student from "../data/Student";

export default class MathematicalGrouper {
    assignment: Assignment;
    students: Student[];

    constructor(assignment: Assignment, students: Student[]) {
        this.assignment = assignment;
        this.students = students;
    }
}