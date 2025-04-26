import Assignment from "./dtos/Assignment";
import Student from "./dtos/Student";
import Group from "./dtos/Group";
import GroupRecord from "./dtos/GroupRecord";
import Score from "./dtos/Score"

import ScoreSchema from "./data/ScoreSchema";
import StudentSchema from "./data/StudentSchema";

export default class Grouper {
    static async create_groups_assignment(group_size: number, alpha: number, beta: number, assignment: Assignment) {
        // Get scores and students
        const scores = await ScoreSchema.get_by_assignment(assignment.id);
        if (scores === null) {
            throw new Error("Failed getting scores! Please retry.")
        }
        const students: Student[] = [];
        for (let i = 0; i < scores.length; i++) {
            let studentSchema = await StudentSchema.get_schema(scores[i].student_id)
            if (studentSchema === null) {
                throw new Error("Failed getting student data! Please retry.")
            }
            students.push(StudentSchema.to_dto(studentSchema))
        }
        return this.create_groups(group_size, alpha, beta, scores, students)
    };

    static create_groups(group_size: number, alpha: number, beta: number, scores: Score[], students: Student[]) {
        const num_groups = Math.round(students.length / group_size);
        const groups = [];

        // Create a copy of the students to be removed from as students are grouped
        let copy_students = [...students];

        // Assign a random student to each group
        try {
            for (let i = 0; i < num_groups; i++) {
                let idx = Math.floor(Math.random() * copy_students.length);
                groups.push([copy_students[idx]]);
                copy_students.splice(idx, 1);
            }
        } catch (error) {
            throw new Error("Not enough students for a group that size!");
        }

        // Loop until all students have been removed from the array copy
        while (true) {
            if (copy_students.length === 0) {
                break;
            }
            for (let i = 0; i < num_groups; i++) {
                if (copy_students.length === 0) {
                    break;
                }

                // Initialize avg vectors
                const group = groups[i];
                let avg_question_scores = new Array(scores[0].question_scores.length).fill(0);
                let avg_personality_vec = new Array(students[0].personality_vector.length).fill(0);

                // Add score/personality vectors
                for (let j = 0; j < group.length; j++) {
                    const student = group[j];
                    const score = scores[students.findIndex((s) => s.id === student.id)];
                    avg_question_scores = avg_question_scores.map((s, idx) => s + score.question_scores[idx]);
                    avg_personality_vec = avg_personality_vec.map((p, idx) => p + student.personality_vector[idx]);
                }

                // Divide by current group size
                avg_question_scores = avg_question_scores.map((s) => s/group.length);
                avg_personality_vec = avg_personality_vec.map((p) => p/group.length);

                // Calculate mean difference between average vectors and each other student
                const matchRatings = [];
                for (const student of copy_students) {
                    const score = scores[students.findIndex((s) => s.id === student.id)];
                    const scoreDiff = this.mean_squared_difference(score.question_scores, avg_question_scores);
                    const personalityDiff = this.rbfSimilarity(student.personality_vector, avg_personality_vec);
                    matchRatings.push(alpha * scoreDiff + beta * personalityDiff);
                }

                // Push highest and remove
                const maxRatingIdx = matchRatings.indexOf(Math.max(...matchRatings));
                const student = students.find((s) => s.id === copy_students[maxRatingIdx].id)
                if (student === undefined) {
                    throw new Error("Couldn't find a student")
                }
                group.push(student);
                copy_students.splice(maxRatingIdx, 1);
            }
        }

        // Map back to Group objects and return
        return groups.map((s_arr) => new Group(s_arr.map((s) => s.id)))
    };

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

    static rbfSimilarity(vector1: number[], vector2: number[], gamma: number = 4.5) {
        if (vector1.length !== vector2.length) {
            throw new Error("Vectors must be of equal length");
        }

        let sum_squared_diff = 0;
        for (let i = 0; i < vector1.length; i++) {
            const diff = vector1[i] - vector2[i];
            const squaredDiff = diff * diff;
            sum_squared_diff += Math.exp(-gamma * squaredDiff);
        }

        return sum_squared_diff / vector1.length;
    };
      
}