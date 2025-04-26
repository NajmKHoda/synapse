import Assignment from "./Assignment";
import Student from "./Student";

export default class SynapseClass {
    id: string;
    pairing_params: [number, number];
    students: Student[];
    assignments: Assignment[];
    name: string;
    gemini_context: string;

    constructor(id: string, pairing_params: [number, number], students: Student[], assignments: Assignment[], name: string, gemini_context: string) {
        this.id = id;
        this.pairing_params = pairing_params;
        this.students = students;
        this.assignments = assignments;
        this.name = name;
        this.gemini_context = gemini_context;
    }
}