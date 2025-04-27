"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import Button from "@/components/ui/Button"
import { supabase } from "@/lib/supabase"
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react"

export default function PersonalityForm() {
  const params = useParams()
  const router = useRouter()
  const studentId = params?.id as string
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [alreadyCompleted, setAlreadyCompleted] = useState(false)
  const [student, setStudent] = useState<{ id: string; name: string; description?: string } | null>(null)
  
  const [formData, setFormData] = useState({
    question1: "",
    question2: "",
    question3: "",
    idealPartner: ""
  })

  const questions = {
    question1: {
      text: "When working with others, I prefer to:",
      options: {
        "A": "Lead the group and organize tasks",
        "B": "Collaborate equally and share ideas",
        "C": "Support others and follow instructions",
        "D": "Work independently and check in when needed"
      }
    },
    question2: {
      text: "In a study partner, I value most:",
      options: {
        "A": "Clear communication and responsiveness",
        "B": "Motivation and strong work ethic",
        "C": "Creativity and problem-solving skills",
        "D": "Patience and willingness to explain concepts"
      }
    },
    question3: {
      text: "When approaching a new or hard topic, I usually:",
      options: {
        "A": "Dive right in and figure it out as I go",
        "B": "Look for examples and similar problems first",
        "C": "Ask questions early and often",
        "D": "Plan a step-by-step approach carefully before starting"
      }
    }
  }
  
  const formatPersonalityDescription = () => {
    let description = "";
    
    description += `1. ${questions.question1.text}\n`;
    description += `   Answer: ${formData.question1}) ${questions.question1.options[formData.question1 as keyof typeof questions.question1.options]}\n\n`;
    
    description += `2. ${questions.question2.text}\n`;
    description += `   Answer: ${formData.question2}) ${questions.question2.options[formData.question2 as keyof typeof questions.question2.options]}\n\n`;
    
    description += `3. ${questions.question3.text}\n`;
    description += `   Answer: ${formData.question3}) ${questions.question3.options[formData.question3 as keyof typeof questions.question3.options]}\n\n`;
    
    description += `4. Ideal Study Partner Description:\n   ${formData.idealPartner}\n`;
    
    return description;
  }
  
  useEffect(() => {
    if (!studentId) return
    
    const fetchStudent = async () => {
      setLoading(true)
      
      try {
        const { data: studentData, error: studentError } = await supabase
          .from('Student')
          .select('id, name, description')
          .eq('id', studentId)
          .single()
        
        if (studentError || !studentData) {
          console.error('Error fetching student:', studentError)
          return
        }
        
        setStudent(studentData)
        
        if (studentData.description) {
          setAlreadyCompleted(true)
        }
        
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStudent()
  }, [studentId])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!studentId || !student) return
    
    setSubmitting(true)
    
    try {
      const description = formatPersonalityDescription();
      
      const { error } = await supabase
        .from('Student')
        .update({
          description: description
        })
        .eq('id', studentId)
      
      if (error) {
        console.error('Error submitting form:', error)
        throw error
      }
      
      setSubmitted(true)
      
      setTimeout(() => {
        router.push(`/`)
      }, 2000)
      
    } catch (err) {
      console.error('Failed to submit form:', err)
    } finally {
      setSubmitting(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-light via-white to-mint-light">
        <Loader2 className="h-8 w-8 text-mint animate-spin" />
      </div>
    )
  }
  
  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-light via-white to-mint-light p-4">
        <Card className="border-none shadow-fun rounded-2xl overflow-hidden max-w-md w-full">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Not Found</h2>
            <p className="text-gray-600 mb-4">Sorry, we couldn't find this student in our system.</p>
            <Button onClick={() => router.push('/')} className="w-full bg-mint hover:bg-mint/90 text-white flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 mr-2" /> Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  if (alreadyCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-light via-white to-mint-light p-4">
        <Card className="border-none shadow-fun rounded-2xl overflow-hidden max-w-md w-full">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-mint/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-mint" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Already Completed</h2>
              <p className="text-gray-600 mb-6">
                You have already completed the personality assessment. Thank you for your participation!
              </p>
              <Button onClick={() => router.push('/')} className="bg-mint hover:bg-mint/90 text-white flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" /> Return to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-light via-white to-mint-light p-4">
        <Card className="border-none shadow-fun rounded-2xl overflow-hidden max-w-md w-full">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-mint/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-mint" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-2">
                Your personality assessment has been submitted successfully. This will help us match you with compatible study partners.
              </p>
              <p className="text-mint text-sm mb-6">
                Redirecting to your home...
              </p>
              <Button onClick={() => router.push('/')} className="bg-mint hover:bg-mint/90 text-white">
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-light via-white to-mint-light py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="border-none shadow-fun rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto w-16 h-16 bg-mint/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-mint" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Student Personality Assessment</h1>
              <p className="text-gray-600 max-w-md mx-auto">
                Hello, <span className="text-mint font-medium">{student.name}</span>! Complete this short assessment to help us match you with compatible study partners.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-5 bg-sky-light/30 p-6 rounded-xl border border-sky-light">
                <h3 className="text-lg font-medium text-gray-800">1. When working with others, I prefer to:</h3>
                <div className="space-y-3">
                  {[
                    { value: "A", label: "Lead the group and organize tasks" },
                    { value: "B", label: "Collaborate equally and share ideas" },
                    { value: "C", label: "Support others and follow instructions" },
                    { value: "D", label: "Work independently and check in when needed" }
                  ].map((option) => (
                    <label 
                      key={option.value} 
                      className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                        formData.question1 === option.value 
                          ? "border-mint bg-mint/10 shadow-sm" 
                          : "border-gray-200 hover:border-mint/50 bg-white"
                      } cursor-pointer`}
                    >
                      <div className={`flex items-center justify-center h-5 w-5 rounded-full border-2 ${
                        formData.question1 === option.value
                          ? "border-mint bg-mint" 
                          : "border-gray-300"
                      }`}>
                        {formData.question1 === option.value && (
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">{option.value})</span> {option.label}
                      </div>
                      <input
                        type="radio"
                        name="question1"
                        value={option.value}
                        checked={formData.question1 === option.value}
                        onChange={handleInputChange}
                        className="sr-only"
                        required
                      />
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="space-y-5 bg-mint-light/30 p-6 rounded-xl border border-mint-light">
                <h3 className="text-lg font-medium text-gray-800">2. In a study partner, I value most:</h3>
                <div className="space-y-3">
                  {[
                    { value: "A", label: "Clear communication and responsiveness" },
                    { value: "B", label: "Motivation and strong work ethic" },
                    { value: "C", label: "Creativity and problem-solving skills" },
                    { value: "D", label: "Patience and willingness to explain concepts" }
                  ].map((option) => (
                    <label 
                      key={option.value} 
                      className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                        formData.question2 === option.value 
                          ? "border-mint bg-mint/10 shadow-sm" 
                          : "border-gray-200 hover:border-mint/50 bg-white"
                      } cursor-pointer`}
                    >
                      <div className={`flex items-center justify-center h-5 w-5 rounded-full border-2 ${
                        formData.question2 === option.value
                          ? "border-mint bg-mint" 
                          : "border-gray-300"
                      }`}>
                        {formData.question2 === option.value && (
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">{option.value})</span> {option.label}
                      </div>
                      <input
                        type="radio"
                        name="question2"
                        value={option.value}
                        checked={formData.question2 === option.value}
                        onChange={handleInputChange}
                        className="sr-only"
                        required
                      />
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="space-y-5 bg-sky-light/30 p-6 rounded-xl border border-sky-light">
                <h3 className="text-lg font-medium text-gray-800">3. When approaching a new or hard topic, I usually:</h3>
                <div className="space-y-3">
                  {[
                    { value: "A", label: "Dive right in and figure it out as I go" },
                    { value: "B", label: "Look for examples and similar problems first" },
                    { value: "C", label: "Ask questions early and often" },
                    { value: "D", label: "Plan a step-by-step approach carefully before starting" }
                  ].map((option) => (
                    <label 
                      key={option.value} 
                      className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                        formData.question3 === option.value 
                          ? "border-mint bg-mint/10 shadow-sm" 
                          : "border-gray-200 hover:border-mint/50 bg-white"
                      } cursor-pointer`}
                    >
                      <div className={`flex items-center justify-center h-5 w-5 rounded-full border-2 ${
                        formData.question3 === option.value
                          ? "border-mint bg-mint" 
                          : "border-gray-300"
                      }`}>
                        {formData.question3 === option.value && (
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">{option.value})</span> {option.label}
                      </div>
                      <input
                        type="radio"
                        name="question3"
                        value={option.value}
                        checked={formData.question3 === option.value}
                        onChange={handleInputChange}
                        className="sr-only"
                        required
                      />
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4 bg-mint-light/30 p-6 rounded-xl border border-mint-light">
                <h3 className="text-lg font-medium text-gray-800">
                  Tell us in 1–2 sentences: What's your ideal study partner like, and how do you usually like to work on schoolwork?
                </h3>
                <textarea
                  name="idealPartner"
                  value={formData.idealPartner}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-transparent resize-none shadow-sm"
                  placeholder="Describe your ideal study partner..."
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-mint hover:bg-mint/90 text-white p-4 rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-all"
                disabled={submitting}
              >
                {submitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Submit Assessment</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
