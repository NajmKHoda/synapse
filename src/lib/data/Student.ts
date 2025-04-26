export default class Student {
    id: string;
    name: string;
    email: string;
    description: string;
    personality_vector: number[];

    constructor(name: string, email: string, description: string, personality_vector: number[], id: string = "") {
        this.id = id;
        this.name = name;
        this.email = email;
        this.description = description;
        this.personality_vector = personality_vector;
    }
}