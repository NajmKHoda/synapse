export default class GroupingReport {
    date: string;
    pairing_params: [number, number];
    gemini_context: string;
    id: number;
    assignment_id: number;

    constructor(date: string, pairing_params: [number, number], gemini_context: string, id: number = -1, assignment_id: number = -1) {
        this.date = date;
        this.pairing_params = pairing_params;
        this.gemini_context = gemini_context;
        this.id = id;
        this.assignment_id = assignment_id;
    }
}