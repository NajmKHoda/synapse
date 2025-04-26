import SynapseClass from "./SynapseClass"

export default class Teacher {
    id: string;
    name: string;
    classes: SynapseClass[];

    constructor(id: string, name: string, classes: SynapseClass[]) {
        this.id = id;
        this.name = name;
        this.classes = classes;
    }
}