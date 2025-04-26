import GroupRecord from "../dtos/GroupRecord";
import { supabase } from "../supabase";

export default class GroupRecordSchema {
    static async get_schema(id: number) {
        let response = await supabase
            .from('GroupRecord')
            .select()
            .eq('id', id)
        return response.data
    }

    static async get_by_assignment(assignment_id: number) {
        let response = await supabase
            .from('GroupRecord')
            .select()
            .eq('assignment_id', assignment_id)
        return response.data
    }

    static to_dto(schema: any) {
        return new GroupRecord(
            schema.date,
            schema.alpha,
            schema.beta,
            schema.gemini_context,
            schema.id,
            schema.assignment_id
        )
    }
}