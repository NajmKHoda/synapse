import Score from "./Score";

export default class Assignment {
    id: string;
    name: string;
    max_scores: number[];
    scores: Score[];

    constructor(id: string, name: string, max_scores: number[], scores: Score[]) {
        this.id = id;
        this.name = name;
        this.max_scores = max_scores;
        this.scores = scores;
    }
}