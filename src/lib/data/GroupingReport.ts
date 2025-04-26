import Group from "./Group";

export default class GroupingReport {
    id: string;
    date: string;
    assignment_id: string;
    groups: Group[];
    pairing_params: [number, number];
    
    constructor(date: string, assignment_id: string, groups: Group[], pairing_params: [number, number], id: string = "") {
        this.id = id;
        this.date = date;
        this.assignment_id = assignment_id;
        this.groups = groups;
        this.pairing_params = pairing_params;
    }
}