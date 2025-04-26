import Group from "../dtos/Group";
import { supabase } from "../supabase";

export default class GroupSchema {
    static async get_schema(id: number) {
        return await supabase
            .from('Group')
            .select()
            .eq('id', id)
    }

    static async get_by_grouping_report(grouping_report_id: number) {
        return await supabase
            .from('Group')
            .select()
            .eq('grouping_report_id', grouping_report_id)
    }

    static to_dto(schema: any) {
        return new Group(
            schema.academic_strength,
            schema.social_strength,
            schema.student_ids,
            schema.id,
            schema.grouping_report_id
        )
    }
}