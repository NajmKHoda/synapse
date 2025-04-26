export default class Group {
    id: string;
    student_ids: string[];
    grouping_reason: string;

    constructor(id: string, student_ids: string[], grouping_reason: string) {
        this.id = id;
        this.student_ids = student_ids;
        this.grouping_reason = grouping_reason;
    }
}