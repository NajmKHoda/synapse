"use client"

import { useState, useEffect } from "react"
import { Brain, User, Users, Sparkles, FileSpreadsheet } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import ProtectedRoute from "@/components/ProtectedRoute"
import Button from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import FileUpload from "@/components/FileUpload"
import { supabase } from "@/lib/supabase"
import { group } from '@/lib/actions/group'

interface Student {
  id: number;
  name: string;
  strengths?: string;
  email?: string;
}

export default function Dashboard() {
  const params = useParams()
  const router = useRouter()
  const classId = params?.id as string
  
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [isPairing, setIsPairing] = useState(false)
  const [pairingComplete, setPairingComplete] = useState(false)
  const [pairs, setPairs] = useState<{student1: string, student2: string, reason: string}[]>([])
  const [pendingAssessments, setPendingAssessments] = useState(0)

  const fetchStudents = async () => {
    if (!classId) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('Student')
        .select('id, name, email')
        .eq('class_id', classId)
      
      if (error) {
        console.error('Error fetching students:', error)
        return
      }
      
      const { data: personalityData, error: personalityError } = await supabase
        .from('Student')  // Changed from 'Student' to 'PersonalityTest'
        .select('student_id, description')
        .eq('class_id', classId)
      
      if (personalityError) {
        console.error('Error fetching personality data:', personalityError)
      }
      // If description is not 0 or empty then has completed assessment
      const completedAssessmentIds = new Set(
        personalityData?.filter(item => item.description !== 0 && item.description !== '')?.map(item => item.student_id.toString())
      )
      // Filter students who have not completed the assessment
      // and count them
      const pending = data.filter(student => !completedAssessmentIds.has(student.id.toString())).length

      const formattedStudents = data.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        strengths: student.email ? `${student.email.split('@')[0]} strengths` : 'Unknown'
      }))
      
      setStudents(formattedStudents)
    } catch (err) {
      console.error('Failed to fetch students:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [classId])

  const handleUploadSuccess = () => {
    fetchStudents()
  }

  const simulateGeminiPairing = () => {
    setIsPairing(true)
    
    setTimeout(() => {
      const samplePairs = [
        {
          student1: students[0]?.name || "Student 1", 
          student2: students[1]?.name || "Student 2", 
          reason: "Both have complementary strengths that can enhance collaboration"
        },
        {
          student1: students[2]?.name || "Student 3", 
          student2: students[3]?.name || "Student 4", 
          reason: "Their skills complement each other well for project work"
        }
      ]
      
      setPairs(samplePairs)
      setIsPairing(false)
      setPairingComplete(true)
    }, 3000)
  }

  const resetPairing = () => {
    setPairingComplete(false)
    setPairs([])
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-sky-light via-white to-mint-light">
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar - Students */}
            <div className="w-full lg:w-1/4">
              <Card className="border-none shadow-fun rounded-2xl overflow-hidden h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Students</h2>
                    <span className="bg-mint/20 text-mint font-medium text-sm px-2 py-1 rounded-full">
                      {students.length}
                    </span>
                  </div>
                  
                  <div className="space-y-3 max-h-[calc(100vh-240px)] overflow-y-auto pr-2">
                    {loading ? (
                      <div className="flex justify-center p-6">
                        <p className="text-gray-500">Loading students...</p>
                      </div>
                    ) : students.length > 0 ? (
                      <>
                        {pendingAssessments > 0 && (
                          <div className="p-3 mb-4 bg-[var(--sunny)]/10 rounded-lg border border-[var(--sunny)]/20">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">{pendingAssessments}</span> student(s) haven't completed the personality assessment
                            </p>
                            <Link href={`/dashboard/class/${classId}/students`}>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full mt-2 text-xs border-[var(--sunny)]/30 hover:bg-[var(--sunny)]/10"
                              >
                                Manage Assessments
                              </Button>
                            </Link>
                          </div>
                        )}
                      
                        {students.map((student) => (
                          <div 
                            key={student.id} 
                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-white shadow-sm hover:border-mint/50 transition-colors"
                          >
                            <div className="h-9 w-9 rounded-full bg-[var(--sunny)]/20 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-700" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{student.name}</p>
                              <p className="text-xs text-gray-500">
                                {student.email && <span className="block text-xs">{student.email}</span>}
                                {student.strengths}
                              </p>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="text-center p-6">
                        <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No students found</p>
                        <p className="text-gray-400 text-sm">Upload student data to get started</p>
                      </div>
                    )}
                  </div>
                  
                  {students.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link href={`/dashboard/class/${classId}/students`}>
                        <Button 
                          variant="outline" 
                          className="w-full text-sm border-mint/30 hover:bg-mint/10 text-mint"
                        >
                          <FileSpreadsheet className="h-4 w-4 mr-2 inline-flex" />
                          Manage Students
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Right Side Content */}
            <div className="w-full lg:w-3/4 flex flex-col gap-6">
              {/* CSV Upload Section */}
              <Card className="border-none shadow-fun rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Student Data</h2>
                  <FileUpload 
                    onUploadSuccess={handleUploadSuccess} 
                    classId={classId}
                  />
                </CardContent>
              </Card>
              
              {/* Gemini Pairing Section */}
              <Card className="border-none shadow-fun rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Gemini Grouping</h2>
                  
                  <div className="bg-gradient-to-br from-mint-light to-[var(--sunny)]/20 rounded-xl p-6">
                    {!pairingComplete ? (
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="h-16 w-16 rounded-full bg-mint/20 flex items-center justify-center mb-4">
                          <Brain className="h-8 w-8 text-mint" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">AI-Powered Grouping</h3>
                        <p className="text-gray-600 max-w-md mb-6">
                          Use Google Gemini to intelligently pair students based on their academic strengths, 
                          learning styles, and personality traits.
                        </p>
                        
                        {isPairing ? (
                          <div className="w-full max-w-md">
                            <Progress value={70} className="h-2 mb-2" />
                            <p className="text-mint text-sm animate-pulse">Generating optimal student pairs...</p>
                          </div>
                        ) : (
                          <Button 
                            onClick={() => group(classId, 5, 0.5, 0.5)}
                            className="bg-mint hover:bg-mint/90 text-white"
                          >
                            <Sparkles className="h-4 w-4 mr-2 inline-flex" />
                            Generate Pairs
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-800">Generated Pairs</h3>
                          <Button 
                            variant="outline" 
                            onClick={resetPairing}
                            className="text-xs border-mint/30 hover:bg-mint/10"
                          >
                            Reset
                          </Button>
                        </div>
                        
                        <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
                          {pairs.map((pair, index) => (
                            <div 
                              key={index}
                              className="bg-white rounded-lg p-4 border border-mint/30 shadow-sm"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="bg-mint/20 text-mint text-xs font-medium px-2 py-1 rounded-full">
                                    Pair {index + 1}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row gap-4 mb-3">
                                <div className="flex-1 p-3 bg-mint/10 rounded-lg">
                                  <p className="text-xs text-mint mb-1">Student 1</p>
                                  <p className="font-medium text-gray-800">{pair.student1}</p>
                                </div>
                                <div className="flex-1 p-3 bg-[var(--sunny)]/10 rounded-lg">
                                  <p className="text-xs text-[var(--sunny)] mb-1">Student 2</p>
                                  <p className="font-medium text-gray-800">{pair.student2}</p>
                                </div>
                              </div>
                              
                              <div className="text-sm text-gray-600">
                                <p className="text-xs text-gray-500 mb-1">Why this works:</p>
                                {pair.reason}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}