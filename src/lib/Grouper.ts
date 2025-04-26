import Assignment from "./dtos/Assignment";
import Student from "./dtos/Student";
import Group from "./dtos/Group";
import GroupingReport from "./dtos/GroupingReport";

export default class Grouper {
    static create_grouping_report(group_size: number, assignment: Assignment, students: Student[], pairing_params: [number, number]) {
        const report = new GroupingReport(new Date().toISOString(), assignment.id, [], pairing_params);
        const num_groups = Math.round(students.length / group_size);
        const groups = [];

        let copy_students = [...students];

        try {
            for (let i = 0; i < num_groups; i++) {
                let idx = Math.floor(Math.random()*copy_students.length);
                groups.push([copy_students[idx]]);
                copy_students.splice(idx, 1);
            }
        } catch (error) {
            throw new Error("Not enough students for a group that size!");
        }

        while (true) {
            for (let i = 0; i < num_groups; i++) {
                let group = groups[i];
                let avg_score_per_question = [];
                let avg_personality_vec = [];
                
                for (let j = 0; j < assignment.max_scores.length; j++) {

                }
                
            }
        }
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