import Student from "../dtos/Student"
import { supabase } from "../supabase"

export default class StudentSchema {
    static async get_schema(id: number) {
        let response = await supabase
            .from('Student')
            .select()
            .eq('id', id)
        return response.data
    }

    static async get_by_class(class_id: number) {
        let response = await supabase
            .from('Student')
            .select()
            .eq('class_id', class_id)
        return response.data
    }

    static to_dto(schema: any) {
        return new Student(
            schema.name,
            schema.email,
            schema.description,
            schema.personality_vector,
            schema.id,
            schema.class_id
        )
    }
}