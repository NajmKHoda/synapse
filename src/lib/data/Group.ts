export default class Group {
    id: string;
    student_ids: string[];
    academic_strength: number;
    social_strength: number;

    constructor(id: string, student_ids: string[], academic_strength: number, social_strength: number) {
        this.id = id;
        this.student_ids = student_ids;
        this.academic_strength = academic_strength;
        this.social_strength = social_strength;
    }
}