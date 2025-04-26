import SynapseClass from "./SynapseClass"

export default class Teacher {
    id: string;
    name: string;
    classes: SynapseClass[];

    constructor(name: string, classes: SynapseClass[], id: string = "") {
        this.id = id;
        this.name = name;
        this.classes = classes;
    }
}