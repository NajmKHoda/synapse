export default class Teacher {
    name: string;
    id: number;

    constructor(name: string, id: number = -1) {
        this.name = name;
        this.id = id;
    }
}