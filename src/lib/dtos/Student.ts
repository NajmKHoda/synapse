export default class Student {
    name: string;
    email: string;
    description: string;
    personality_vector: number[];
    id: number;
    class_id: number;
    
    constructor(name: string, email: string, description: string, personality_vector: number[], id: number = -1, class_id: number = -1) {
        this.name = name;   
        this.email = email;
        this.description = description;
        this.personality_vector = personality_vector;
        this.id = id;
        this.class_id = class_id;
    }
}