import Score from "./Score";

export default class Assignment {
    id: string;
    name: string;
    max_scores: number[];
    scores: Score[];

    constructor(name: string, max_scores: number[], scores: Score[], id: string = "") {
        this.id = id;
        this.name = name;
        this.max_scores = max_scores;
        this.scores = scores;
    }
}