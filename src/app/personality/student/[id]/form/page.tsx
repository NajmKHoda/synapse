"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import  Button  from "@/components/ui/Button"
import { supabase } from "@/lib/supabase"
import { Loader2, CheckCircle2, ArrowLeft, Brain, ChevronRight } from 'lucide-react'
import Link from "next/link"

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

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

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
  
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
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

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return !!formData.question1
      case 2:
        return !!formData.question2
      case 3:
        return !!formData.question3
      case 4:
        return !!formData.idealPartner
      default:
        return false
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-light via-white to-mint-light">
        <Loader2 className="h-8 w-8 text-[var(--secondary)] animate-spin" />
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
            <Button onClick={() => router.push('/')} className="w-full bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 text-white flex items-center justify-center">
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
              <div className="h-16 w-16 rounded-full bg-[var(--secondary)]/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-[var(--secondary)]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Already Completed</h2>
              <p className="text-gray-600 mb-6">
                You have already completed the personality assessment. Thank you for your participation!
              </p>
              <Button onClick={() => router.push('/')} className="bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 text-white flex items-center">
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
              <div className="h-16 w-16 rounded-full bg-[var(--secondary)]/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-[var(--secondary)]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-2">
                Your personality assessment has been submitted successfully. This will help us match you with compatible study partners.
              </p>
              <p className="text-[var(--secondary)] text-sm mb-6">
                Redirecting to your home...
              </p>
              <Button onClick={() => router.push('/')} className="bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 text-white">
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-light via-white to-mint-light">

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Learning Preferences</h1>
            <p className="text-gray-600">
              Hello, <span className="text-[var(--secondary)] font-medium">{student.name}</span>! Help us understand how you learn best so we can match you with compatible study partners.
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)]"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form content */}
          <Card className="border-none shadow-fun rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (currentStep === totalSteps) {
                  handleSubmit(e);
                } else {
                  handleNext();
                }
              }}>
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                        <span className="font-bold text-[var(--primary)]">1</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">Working Style</h2>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-800">{questions.question1.text}</h3>
                      <div className="space-y-3">
                        {Object.entries(questions.question1.options).map(([key, value]) => (
                          <label
                            key={key}
                            className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                              formData.question1 === key
                                ? "border-[var(--primary)] bg-[var(--primary)]/10 shadow-sm"
                                : "border-gray-200 hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/5 bg-white"
                            } cursor-pointer`}
                          >
                            <div className={`flex items-center justify-center h-5 w-5 rounded-full border-2 ${
                              formData.question1 === key
                                ? "border-[var(--primary)] bg-[var(--primary)]"
                                : "border-gray-300"
                            }`}>
                              {formData.question1 === key && (
                                <div className="h-2 w-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">{key})</span> {value}
                            </div>
                            <input
                              type="radio"
                              name="question1"
                              value={key}
                              checked={formData.question1 === key}
                              onChange={(e) => handleInputChange("question1", e.target.value)}
                              className="sr-only"
                              required
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-[var(--secondary)]/20 flex items-center justify-center">
                        <span className="font-bold text-[var(--secondary)]">2</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">Partner Values</h2>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-800">{questions.question2.text}</h3>
                      <div className="space-y-3">
                        {Object.entries(questions.question2.options).map(([key, value]) => (
                          <label
                            key={key}
                            className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                              formData.question2 === key
                                ? "border-[var(--secondary)] bg-[var(--secondary)]/10 shadow-sm"
                                : "border-gray-200 hover:border-[var(--secondary)]/30 hover:bg-[var(--secondary)]/5 bg-white"
                            } cursor-pointer`}
                          >
                            <div className={`flex items-center justify-center h-5 w-5 rounded-full border-2 ${
                              formData.question2 === key
                                ? "border-[var(--secondary)] bg-[var(--secondary)]"
                                : "border-gray-300"
                            }`}>
                              {formData.question2 === key && (
                                <div className="h-2 w-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">{key})</span> {value}
                            </div>
                            <input
                              type="radio"
                              name="question2"
                              value={key}
                              checked={formData.question2 === key}
                              onChange={(e) => handleInputChange("question2", e.target.value)}
                              className="sr-only"
                              required
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                        <span className="font-bold text-[var(--accent)]">3</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">Learning Approach</h2>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-800">{questions.question3.text}</h3>
                      <div className="space-y-3">
                        {Object.entries(questions.question3.options).map(([key, value]) => (
                          <label
                            key={key}
                            className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                              formData.question3 === key
                                ? "border-[var(--accent)] bg-[var(--accent)]/10 shadow-sm"
                                : "border-gray-200 hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 bg-white"
                            } cursor-pointer`}
                          >
                            <div className={`flex items-center justify-center h-5 w-5 rounded-full border-2 ${
                              formData.question3 === key
                                ? "border-[var(--accent)] bg-[var(--accent)]"
                                : "border-gray-300"
                            }`}>
                              {formData.question3 === key && (
                                <div className="h-2 w-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">{key})</span> {value}
                            </div>
                            <input
                              type="radio"
                              name="question3"
                              value={key}
                              checked={formData.question3 === key}
                              onChange={(e) => handleInputChange("question3", e.target.value)}
                              className="sr-only"
                              required
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                        <span className="font-bold text-[var(--primary)]">4</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">Ideal Study Partner</h2>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-gray-800">
                        Tell us in 1–2 sentences: What's your ideal study partner like, and how do you usually like to
                        work on schoolwork?
                      </h3>
                      <textarea
                        name="idealPartner"
                        value={formData.idealPartner}
                        onChange={(e) => handleInputChange("idealPartner", e.target.value)}
                        placeholder="My ideal study partner is..."
                        className="min-h-[120px] w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-transparent resize-none"
                        required
                      />
                      <p className="text-sm text-gray-500">
                        This helps us better understand your preferences beyond multiple-choice questions.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="border-gray-200 hover:border-gray-300 rounded-lg"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4 inline-flex" /> Previous
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button
                      type="submit"
                      disabled={!isStepComplete()}
                      className="bg-[var(--secondary)] text-white hover:bg-[var(--secondary)]/90 rounded-lg inline-flex flex items-center"
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4 inline-flex" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!isStepComplete() || submitting}
                      className="bg-[var(--primary)] text-gray-800 hover:bg-[var(--primary)]/90 rounded-lg"
                    >
                      {submitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="h-4 w-4 inline-flex" />
                          <span>Submit</span>
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

