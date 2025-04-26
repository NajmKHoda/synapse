export default class Score {
    id: string;
    student_id: string;
    question_scores: number[];

    constructor(student_id: string, question_scores: number[], id: string = "") {
        this.id = id;
        this.student_id = student_id;
        this.question_scores = question_scores;
    }
}