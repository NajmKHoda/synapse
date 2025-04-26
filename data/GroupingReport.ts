import Group from "./Group";

export default class GroupingReport {
    id: string;
    date: string;
    assignment_id: string;
    groups: Group[];

    constructor(id: string, date: string, assignment_id: string, groups: Group[]) {
        this.id = id;
        this.date = date;
        this.assignment_id = assignment_id;
        this.groups = groups;
    }
}