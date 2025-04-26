export default class SynapseClass {
    alpha: number;
    beta: number;
    name: string;
    gemini_context: string;
    id: number;
    teacher_id: number;

    constructor(alpha: number, beta: number, name: string, gemini_context: string, id: number = -1, teacher_id: number = -1) {
        this.alpha = alpha;
        this.beta = beta;
        this.name = name;
        this.gemini_context = gemini_context;
        this.id = id;
        this.teacher_id = teacher_id;
    }
}