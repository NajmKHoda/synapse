import SynapseClass from "../dtos/SynapseClass"
import { supabase } from "../supabase"

export default class SynapseClassSchema {
    static async get_schema(id: number) {
        return await supabase
            .from('SynapseClass')
            .select()
            .eq('id', id)
    }

    static async get_by_teacher(teacher_id: number) {
        return await supabase
            .from('SynapseClass')
            .select()
            .eq('teacher_id', teacher_id)
    }

    static to_dto(schema: any) {
        return new SynapseClass(
            schema.alpha,
            schema.beta,
            schema.name,
            schema.gemini_context,
            schema.id,
            schema.teacher_id
        )
    }
}