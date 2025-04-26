"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { User, Mail, FileCheck, AlertCircle, Send, Copy } from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Button from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface Student {
  id: string;
  name: string;
  email: string;
  has_completed_assessment: boolean;
  has_description: boolean;
  email_sent?: boolean;
}

export default function StudentsPage() {
  const params = useParams()
  const classId = params?.id as string
  
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingEmails, setSendingEmails] = useState(false)
  
  useEffect(() => {
    if (!classId) return
    
    const fetchStudents = async () => {
      setLoading(true)
      
      try {
        // Fetch students for this class, including description field
        const { data: studentsData, error: studentsError } = await supabase
          .from('Student')
          .select('id, name, email, description')
          .eq('class_id', classId)
        
        if (studentsError) {
          console.error('Error fetching students:', studentsError)
          return
        }
        
        // Combine data - directly use the description from student data
        const formattedStudents = studentsData.map(student => ({
          id: student.id,
          name: student.name,
          email: student.email || '',
          has_completed_assessment: student.description ? student.description.trim() !== '' : false,
          has_description: student.description ? student.description.trim() !== '' : false,
          email_sent: false
        }))
        
        setStudents(formattedStudents)
        
      } catch (err) {
        console.error('Failed to fetch students:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStudents()
  }, [classId])
  
  const getAssessmentUrl = (studentId: string) => {
    return `${window.location.origin}/personality/student/${studentId}/form`
  }
  
  const copyAssessmentLink = (studentId: string) => {
    navigator.clipboard.writeText(getAssessmentUrl(studentId))
    toast.success('Link copied to clipboard!')
  }
  
  const sendPersonalityAssessment = async (studentId: string, email: string) => {
    if (!email) {
      toast.error('Student has no email address')
      return
    }
    
    setSendingEmails(true)
    
    try {
      // Note: In a real application, you would call your API endpoint here
      // This is just a simulation of the email sending
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update UI optimistically
      setStudents(prev => 
        prev.map(student => 
          student.id === studentId 
            ? { ...student, email_sent: true } 
            : student
        )
      )
      
      toast.success(`Email sent to ${email}`)
    } catch (error) {
      console.error('Failed to send email:', error)
      toast.error('Failed to send email')
    } finally {
      setSendingEmails(false)
    }
  }
  
  const sendAllAssessments = async () => {
    setSendingEmails(true)
    
    try {
      const studentsToEmail = students.filter(s => s.email && !s.has_completed_assessment && !s.email_sent)
      
      if (studentsToEmail.length === 0) {
        toast.info("No students requiring assessment emails")
        return
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update UI to mark all pending students as sent
      setStudents(prev => 
        prev.map(student => 
          student.email && !student.has_completed_assessment && !student.email_sent
            ? { ...student, email_sent: true }
            : student
        )
      )
      
      toast.success(`Sent ${studentsToEmail.length} assessment emails`)
    } catch (error) {
      console.error('Failed to send emails:', error)
      toast.error('Failed to send emails')
    } finally {
      setSendingEmails(false)
    }
  }
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-sky-light via-white to-mint-light">
        <main className="container mx-auto px-4 py-8">
          <Card className="border-none shadow-fun rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Student Assessments</h1>
                  <p className="text-gray-600">Send personality assessments to your students</p>
                </div>
                
                <Button
                  onClick={sendAllAssessments}
                  className="bg-mint hover:bg-mint/90 text-white inline-flex items-center"
                  disabled={sendingEmails || students.filter(s => s.email && !s.has_completed_assessment && !s.email_sent).length === 0}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send All Assessments
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Name</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Email</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                      <th className="py-3 px-4 text-right text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">
                          Loading students...
                        </td>
                      </tr>
                    ) : students.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">
                          No students found in this class
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-[var(--sunny)]/20 flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-700" />
                              </div>
                              <span className="font-medium text-gray-800">{student.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {student.email ? (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-600">{student.email}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">No email</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {student.has_completed_assessment && student.has_description ? (
                              <div className="flex items-center gap-1">
                                <FileCheck className="h-4 w-4 text-mint" />
                                <span className="text-mint font-medium">Completed</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <AlertCircle className="h-4 w-4 text-[var(--sunny)]" />
                                <span className="text-[var(--sunny)] font-medium">
                                  {student.has_completed_assessment ? "Completed" : "Pending"}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyAssessmentLink(student.id)}
                                className="text-xs border-gray-200 hover:bg-gray-100 inline-flex items-center"
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy Link
                              </Button>
                              
                              {!student.has_completed_assessment && student.email && !student.email_sent && (
                                <Button
                                  size="sm"
                                  onClick={() => sendPersonalityAssessment(student.id, student.email)}
                                  disabled={sendingEmails}
                                  className="text-xs bg-mint hover:bg-mint/90 text-white inline-flex items-center"
                                >
                                  <Send className="h-3 w-3 mr-1" />
                                  Send Email
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
