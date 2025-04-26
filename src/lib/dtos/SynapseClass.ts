export default class SynapseClass {
    pairing_params: [number, number];
    name: string;
    gemini_context: string;
    id: number;
    teacher_id: number;

    constructor(pairing_params: [number, number], name: string, gemini_context: string, id: number = -1, teacher_id: number = -1) {
        this.pairing_params = pairing_params;
        this.name = name;
        this.gemini_context = gemini_context;
        this.id = id;
        this.teacher_id = teacher_id;
    }
}