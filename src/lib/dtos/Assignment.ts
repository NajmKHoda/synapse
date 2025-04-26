export default class Assignment {
    name: string;
    max_scores: number[];
    id: number;
    class_id: number;

    constructor(name: string, max_scores: number[], id: number = -1, class_id: number = -1) {
        this.name = name;
        this.max_scores = max_scores;
        this.id = id;
        this.class_id = class_id;
    }
}