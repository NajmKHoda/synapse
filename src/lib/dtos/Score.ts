export default class Score {
    question_scores: number[];
    id: number;
    assignment_id: number;
    student_id: number

    constructor(question_scores: number[], id: number = -1, assignment_id: number = -1, student_id: number = -1) {
        this.question_scores = question_scores;
        this.id = id;
        this.assignment_id = assignment_id;
        this.student_id = student_id;
    }
}