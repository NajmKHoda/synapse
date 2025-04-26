import Assignment from "./data/Assignment";
import Student from "./data/Student";
import Group from "./data/Group";
import GroupingReport from "./data/GroupingReport";

export default class MathematicalGrouper { 
    static create_grouping_report(assignment: Assignment, students: Student[], pairing_params: [number, number]) {
        const report = new GroupingReport(new Date().toISOString(), assignment.id, [], pairing_params);

        
    }

    static mean_squared_difference(vector1: number[], vector2: number[]) {
        if (vector1.length !== vector2.length) {
            throw new Error("Vectors must be of equal length");
        }

        let sum_squared_diff = 0;
        for (let i = 0; i < vector1.length; i++) {
            const diff = vector1[i] - vector2[i];
            sum_squared_diff += diff * diff;
        }

        return sum_squared_diff / vector1.length;
    };
}