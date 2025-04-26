import Score from "../dtos/Score"
import { supabase } from "../supabase"

export default class ScoreSchema {
    static async get_schema(id: number) {
        return await supabase
            .from('Score')
            .select()
            .eq('id', id)
    }

    static async get_by_assignment(assignment_id: number) {
        return await supabase
            .from('Score')
            .select()
            .eq('assignment_id', assignment_id)
    }

    static async get_by_student(student_id: number) {
        return await supabase
            .from('Score')
            .select()
            .eq('student_id', student_id)
    }

    static to_dto(schema: any) {
        return new Score(
            schema.question_scores,
            schema.id,
            schema.assignment_id,
            schema.student_id
        )
    }
}