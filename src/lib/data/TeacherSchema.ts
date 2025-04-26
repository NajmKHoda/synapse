import Teacher from "../dtos/Teacher"
import { supabase } from "../supabase"

export default class SynapseClassSchema {
    static async get_schema(id: number) {
        return await supabase
            .from('Teacher')
            .select()
            .eq('id', id)
    }

    static to_dto(schema: any) {
        return new Teacher(
            schema.name,
            schema.id
        )
    }
}