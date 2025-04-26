import GroupingReport from "../dtos/GroupingReport";
import { supabase } from "../supabase";

export default class GroupingReportSchema {
    static async get_schema(id: number) {
        return await supabase
            .from('GroupingReport')
            .select()
            .eq('id', id)
    }

    static async get_by_assignment(assignment_id: number) {
        return await supabase
            .from('GroupingReport')
            .select()
            .eq('assignment_id', assignment_id)
    }

    static to_dto(schema: any) {
        return new GroupingReport(
            schema.date,
            schema.alpha,
            schema.beta,
            schema.gemini_context,
            schema.id,
            schema.assignment_id
        )
    }
}