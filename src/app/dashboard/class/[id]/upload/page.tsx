"use client"

import { useState, useEffect } from "react"
import { Brain, User, Users, Sparkles, FileSpreadsheet, RefreshCw } from "lucide-react"
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

interface Group {
  id: number;
  students: Student[];
  reason: string;
}

export default function Dashboard() {
  const params = useParams()
  const router = useRouter()
  const classId = params?.id as string
  
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [isPairing, setIsPairing] = useState(false)
  const [pairingComplete, setPairingComplete] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])
  const [pendingAssessments, setPendingAssessments] = useState(0)
  const [personalityWeight, setPersonalityWeight] = useState(0.6)
  const [scoreWeight, setScoreWeight] = useState(0.4)
  const [groupSize, setGroupSize] = useState(2)
  const [loadingGroups, setLoadingGroups] = useState(true)

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
        .from('Student')
        .select('id, description')
        .eq('class_id', classId)
      
      if (personalityError) {
        console.error('Error fetching personality data:', personalityError)
      }
      const completedAssessmentIds = new Set(
        personalityData?.filter(item => item.description !== 0 && item.description !== '')?.map(item => item.student_id.toString())
      )
      const pending = data.filter(student => !completedAssessmentIds.has(student.id.toString())).length

      const formattedStudents = data.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        strengths: student.email ? `${student.email.split('@')[0]} strengths` : 'Unknown'
      }))
      
      setStudents(formattedStudents)
      
      // Return the formatted students so we can use them in the caller
      return formattedStudents
    } catch (err) {
      console.error('Failed to fetch students:', err)
    } finally {
      setLoading(false)
    }
    return []
  }

  const fetchGroups = async (currentStudents = students) => {
    if (!classId) return
    
    setLoadingGroups(true)
    try {
      console.log("Students in fetchGroups:", classId);
      const { data, error } = await supabase
        .from('Class')
        .select('groups')
        .eq('id', classId)
      console.log("Data from fetchGroups:", data);
      
      if (error) {
        console.error('Error fetching groups:', error);
        return;
      }
      
      // Check if we have groups data
      if (data && data.length > 0 && data[0].groups) {
        const groupsData = data[0].groups;
        
        // Format the groups data for display
        const formattedGroups = groupsData.map((group, index) => {
          // Find the full student objects that match these IDs
          const groupStudents = group.map(studentId => 
            currentStudents.find(s => s.id.toString() === studentId) || 
            { id: studentId, name: `Student ${studentId.substring(0, 6)}...`, email: 'No data available' }
          );
          
          return {
            id: index + 1,
            students: groupStudents,
            reason: `Group ${index + 1} was created based on compatibility between the student profiles.`
          };
        });
        
        setGroups(formattedGroups);
        setPairingComplete(true);
      } else {
        // No groups found
        setPairingComplete(false);
        setGroups([]);
      }
    } catch (err) {
      console.error('Failed to fetch groups:', err);
      setPairingComplete(false);
      setGroups([]);
    } finally {
      setLoadingGroups(false);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      const fetchedStudents = await fetchStudents();
      if (fetchedStudents && fetchedStudents.length > 0) {
        // Pass the freshly fetched students to fetchGroups
        fetchGroups(fetchedStudents);
      } else {
        fetchGroups(); // Fallback to using the state
      }
    };
    
    loadData();
  }, [classId]);

  const handleUploadSuccess = async () => {
    const fetchedStudents = await fetchStudents();
    if (fetchedStudents && fetchedStudents.length > 0) {
      fetchGroups(fetchedStudents);
    }
  }

  const handleGenerateGroups = async () => {
    setIsPairing(true)
    
    try {
      await group(classId, groupSize, personalityWeight, scoreWeight)
      await fetchGroups()
      setPairingComplete(true) // Set pairing complete after successful group generation
    } catch (error) {
      console.error('Error generating groups:', error)
    } finally {
      setIsPairing(false)
    }
  }

  const resetPairing = async () => {
    if (!classId) return
    
    setIsPairing(true)
    try {
      // Delete from the correct table
      const { error: deleteGroupsError } = await supabase
        .from('StudentGroupJoin')
        .delete()
        .eq('class_id', classId)
      
      if (deleteGroupsError) {
        console.error('Error deleting groups:', deleteGroupsError)
      }
      
      setPairingComplete(false)
      setGroups([])
    } catch (err) {
      console.error('Failed to reset groups:', err)
    } finally {
      setIsPairing(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-sky-light via-white to-mint-light">
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/4">
              <Card className="border-none shadow-fun rounded-2xl overflow-hidden h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Students</h2>
                    <span className="bg-mint/20 text-mint font-medium text-sm px-2 py-1 rounded-full">
                      {students.length}
                    </span>
                  </div>
                  <div className="p-3 mb-4 rounded-lg border ">
                    <Link href={`/dashboard/class/${classId}/students`}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2 text-xs bg-sunny border-[var(--sunny)]/30 hover:bg-[var(--sunny)]/10"
                      >
                        Manage Assessments
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-3 max-h-[calc(100vh-240px)] overflow-y-auto pr-2">
                    {loading ? (
                      <div className="flex justify-center p-6">
                        <p className="text-gray-500">Loading students...</p>
                      </div>
                    ) : students.length > 0 ? (
                      <>
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
                </CardContent>
              </Card>
            </div>
            
            <div className="w-full lg:w-3/4 flex flex-col gap-6">
              <Card className="border-none shadow-fun rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Student Data</h2>
                  <FileUpload 
                    onUploadSuccess={handleUploadSuccess} 
                    classId={classId}
                  />
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-fun rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Grouping</h2>
                  
                  <div className="bg-gradient-to-br from-mint-light to-[var(--sunny)]/20 rounded-xl p-6">
                    {loadingGroups ? (
                      <div className="flex flex-col items-center justify-center text-center py-8">
                        <Progress value={70} className="h-2 mb-4 w-48" />
                        <p className="text-mint text-sm animate-pulse">Loading student groups...</p>
                      </div>
                    ) : !pairingComplete ? (
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="h-16 w-16 rounded-full bg-mint/20 flex items-center justify-center mb-4">
                          <Brain className="h-8 w-8 text-mint" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">AI-Powered Grouping</h3>
                        <p className="text-gray-600 max-w-md mb-6">
                          Use Google Gemini to intelligently pair students based on their academic strengths, 
                          learning styles, and personality traits.
                        </p>
                        
                        <div className="w-full max-w-md mb-6 space-y-5">
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between mb-2">
                              <label className="text-sm font-medium text-gray-700">Group Size</label>
                              <span className="text-sm bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md">{groupSize}</span>
                            </div>
                            <input 
                              type="text" 
                              value={groupSize}
                              onChange={(e) => {
                                if (e.target.value === '') {
                                  setGroupSize('' as any);
                                  return;
                                }
                                
                                const inputValue = parseInt(e.target.value);
                                if (!isNaN(inputValue)) {
                                  if (inputValue < 2) {
                                    setGroupSize(2);
                                  } else if (inputValue > students.length) {
                                    setGroupSize(students.length);
                                  } else {
                                    setGroupSize(inputValue);
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                let inputValue = parseInt(e.target.value as string);
                                
                                if (isNaN(inputValue) || inputValue < 2) {
                                  setGroupSize(2);
                                } else if (inputValue > students.length) {
                                  setGroupSize(students.length);
                                } else {
                                  setGroupSize(inputValue);
                                }
                              }}
                              className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent"
                            />
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-gray-500">Min: 2</span>
                              <span className="text-xs text-gray-500">Max: {students.length}</span>
                            </div>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between mb-2">
                              <label className="text-sm font-medium text-gray-700">Personality Weight</label>
                              <span className="text-sm bg-mint/20 text-mint px-2 py-0.5 rounded-md">{(personalityWeight * 100).toFixed(0)}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="1" 
                              step="0.1" 
                              value={personalityWeight}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                setPersonalityWeight(value);
                              }}
                              className="w-full h-2 bg-[var(--mint)]/20 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                            />
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between mb-2">
                              <label className="text-sm font-medium text-gray-700">Score Weight</label>
                              <span className="text-sm bg-[var(--sunny)]/20 text-[var(--sunny)] px-2 py-0.5 rounded-md">{(scoreWeight * 100).toFixed(0)}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="1" 
                              step="0.1" 
                              value={scoreWeight}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                setScoreWeight(value);
                              }}
                              className="w-full h-2 bg-[var(--sunny)]/20 rounded-lg appearance-none cursor-pointer accent-[var(--sunny)]"
                            />
                          </div>
                        </div>
                        
                        {isPairing ? (
                          <div className="w-full max-w-md">
                            <Progress value={70} className="h-2 mb-2" />
                            <p className="text-mint text-sm animate-pulse">Generating optimal student groups...</p>
                          </div>
                        ) : (
                          <Button 
                            onClick={handleGenerateGroups}
                            className="bg-mint hover:bg-mint/90 text-white"
                            disabled={students.length < groupSize}
                          >
                            <Sparkles className="h-4 w-4 mr-2 inline-flex" />
                            Generate Groups
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-800">Generated Groups</h3>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              onClick={handleGenerateGroups}
                              className="text-xs border-mint/30 hover:bg-mint/10"
                              disabled={isPairing}
                            >
                              <RefreshCw className={`inline-flex h-3 w-3 mr-1 ${isPairing ? 'animate-spin' : ''}`} />
                              Regenerate
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={resetPairing}
                              className="text-xs border-mint/30 hover:bg-mint/10"
                              disabled={isPairing}
                            >
                              Reset
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
                          {groups.map((group, index) => (
                            <div 
                              key={index}
                              className="bg-white rounded-lg p-4 border border-mint/30 shadow-sm"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="bg-mint/20 text-mint text-xs font-medium px-2 py-1 rounded-full">
                                    Group {index + 1}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mb-3">
                                {group.students.map((student, studentIndex) => (
                                  <div 
                                    key={studentIndex} 
                                    className={`flex-1 min-w-[150px] p-3 ${
                                      studentIndex % 2 === 0 ? 'bg-[var(--accent)]/10' : 'bg-[var(--sunny)]/10'
                                    } rounded-lg`}
                                  >
                                    <p className="text-xs text-gray-600 mb-1">Student {studentIndex + 1}</p>
                                    <p className="font-medium text-gray-800">{student.name}</p>
                                    {student.email && <p className="text-xs text-gray-500">{student.email}</p>}
                                  </div>
                                ))}
                              </div>
                              
                              {/* <div className="text-sm text-gray-600">
                                <p className="text-xs text-gray-500 mb-1">Why this works:</p>
                                \{group.reason\}
                              </div> */}
                            </div>
                          ))}

                          {groups.length === 0 && !loadingGroups && (
                            <div className="text-center p-6 bg-white rounded-lg">
                              <p className="text-gray-500">No groups have been generated yet</p>
                            </div>
                          )}
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