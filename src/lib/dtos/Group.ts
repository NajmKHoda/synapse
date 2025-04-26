export default class Group {
    academic_strength: number;
    social_strength: number;
    student_ids: number[];
    id: number;
    grouping_report_id: number;

    constructor(academic_strength: number, social_strength: number, student_ids: number[], id: number = -1, grouping_report_id: number = -1) {
        this.academic_strength = academic_strength;
        this.social_strength = social_strength;
        this.student_ids = student_ids;
        this.id = id;
        this.grouping_report_id = grouping_report_id;
    }
}