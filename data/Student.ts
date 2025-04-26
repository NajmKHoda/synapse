export default class Student {
    id: string;
    name: string;
    email: string;
    description: string;

    constructor(id: string, name: string, email: string, description: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.description = description;
    }
}