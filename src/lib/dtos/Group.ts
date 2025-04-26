export default class Group {
    student_ids: number[];
    id: number;
    grouping_report_id: number;

    constructor(student_ids: number[], id: number = -1, grouping_report_id: number = -1) {
        this.student_ids = student_ids;
        this.id = id;
        this.grouping_report_id = grouping_report_id;
    }
}