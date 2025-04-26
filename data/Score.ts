export default class Score {
    id: string;
    student_id: string;
    question_scores: number[];

    constructor(id: string, student_id: string, question_scores: number[]) {
        this.id = id;
        this.student_id = student_id;
        this.question_scores = question_scores;
    }
}