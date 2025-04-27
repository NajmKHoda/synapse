import { ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, BarChart, Users } from "lucide-react";
import Image from "next/image";
export default function Features() {
    return (
        <>
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-mint-light px-4 py-2 rounded-full text-sm font-medium text-secondary mb-4">
                <Sparkles className="h-4 w-4" />
                <span>Features you'll love</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Synapse?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our intelligent pairing system creates the perfect balance between academic needs and personality
                compatibility.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-none shadow-fun hover:shadow-xl transition-all duration-300 rounded-2xl bg-sunny-light overflow-hidden">
                <div className="h-2 bg-primary w-full"></div>
                <CardHeader className="pb-2">
                  <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                    <BookOpen className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">Academic Complementarity</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">
                    Pairs students so one's strengths complement the other's areas for improvement, creating balanced
                    learning opportunities.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-none shadow-fun hover:shadow-xl transition-all duration-300 rounded-2xl bg-mint-light overflow-hidden">
                <div className="h-2 bg-secondary w-full"></div>
                <CardHeader className="pb-2">
                  <div className="h-14 w-14 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
                    <Users className="h-7 w-7 text-secondary" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">Personality Matching</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">
                    Uses AI to analyze personality traits and ensure students are paired with compatible learning
                    partners.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-none shadow-fun hover:shadow-xl transition-all duration-300 rounded-2xl bg-sky-light overflow-hidden">
                <div className="h-2 bg-accent w-full"></div>
                <CardHeader className="pb-2">
                  <div className="h-14 w-14 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                    <BarChart className="h-7 w-7 text-accent" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">
                    Track progress and outcomes of paired learning sessions with detailed analytics and insights.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        </>
    )
}