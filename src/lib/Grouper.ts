import Assignment from "./data/Assignment";
import Student from "./data/Student";
import Group from "./data/Group";
import GroupingReport from "./data/GroupingReport";

export default class MathematicalGrouper { 
    static create_grouping_report(assignment: Assignment, students: Student[], pairing_params: [number, number]) {
        const report = new GroupingReport(new Date().toISOString(), assignment.id, [], pairing_params);
    }
}