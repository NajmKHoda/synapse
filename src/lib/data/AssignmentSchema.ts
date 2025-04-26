import Assignment from "../dtos/Assignment";
import { supabase } from "../supabase";

export default class AssignmentSchema {
    static async get_schema(id: number) {
        return await supabase
            .from('Assignment')
            .select()
            .eq('id', id)
    }

    static async get_by_class(class_id: number) {
        return await supabase
            .from('Assignment')
            .select()
            .eq('class_id', class_id)
    }

    static to_dto(schema: any) {
        return new Assignment(
            schema.name,
            schema.maxScores,
            schema.id,
            schema.class_id
        )
    }
}