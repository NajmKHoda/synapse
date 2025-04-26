export default class Student {
    id: string;
    name: string;
    email: string;
    description: string;
    personality_vector: number[];

    constructor(id: string, name: string, email: string, description: string, personality_vector: number[]) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.description = description;
        this.personality_vector = personality_vector;
    }
}