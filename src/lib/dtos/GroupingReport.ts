export default class GroupingReport {
    date: string;
    alpha: number;
    beta: number;
    gemini_context: string;
    id: number;
    assignment_id: number;

    constructor(date: string, alpha: number, beta: number, gemini_context: string, id: number = -1, assignment_id: number = -1) {
        this.date = date;
        this.alpha = alpha;
        this.beta = beta;
        this.gemini_context = gemini_context;
        this.id = id;
        this.assignment_id = assignment_id;
    }
}