import Group from "../dtos/Group";
import { supabase } from "../supabase";

export default class GroupSchema {
    static async get_schema(id: number) {
        let response = await supabase
            .from('Group')
            .select()
            .eq('id', id)
        return response.data
    }

    static async get_by_grouping_report(grouping_report_id: number) {
        let response = await supabase
            .from('Group')
            .select()
            .eq('grouping_report_id', grouping_report_id)
        return response.data
    }

    static to_dto(schema: any) {
        return new Group(
            schema.student_ids,
            schema.id,
            schema.grouping_report_id
        )
    }
}