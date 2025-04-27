import { Sparkles } from "lucide-react";
import Image from "next/image";
export default function Explain() {
    return (
        <>
        <section id="how-it-works" className="py-24 bg-gradient-to-br from-[var(--mint-light)] via-white to-[var(--sunny-light)]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-sky-light px-4 py-2 rounded-full text-sm font-medium text-accent mb-4">
                <Sparkles className="h-4 w-4" />
                <span>Simple process</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">How Synapse Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform makes it easy to implement effective peer learning in any classroom.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1">
                <div className="space-y-8">
                  <div className="flex gap-4 bg-white p-6 rounded-2xl shadow-soft hover:shadow-fun transition-all duration-300">
                    <div className="h-12 w-12 rounded-xl bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-800 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">Create a Class</h3>
                      <p className="text-gray-600">
                        Once you sign up, create a class and upload a CSV with the student name, email and scores.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 bg-white p-6 rounded-2xl shadow-soft hover:shadow-fun transition-all duration-300">
                    <div className="h-12 w-12 rounded-xl bg-[var(--secondary)] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">AI-Powered Matching</h3>
                      <p className="text-gray-600">
                        Synapse uses AI to analyze the data and create optimal student pairings based on personalized instructions and other optional paramaters.  
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 bg-white p-6 rounded-2xl shadow-soft hover:shadow-fun transition-all duration-300">
                    <div className="h-12 w-12 rounded-xl bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">Groups</h3>
                      <p className="text-gray-600">
                        Once the groups are formed, you can view them in that classes page and the students groups can be regeneated at any time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 relative h-[450px] rounded-2xl overflow-hidden shadow-fun border-[var(--accent)] border-2">
                <div className="absolute inset-0 bg-gradient-to-tr z-10"></div>
                <Image
                  src="/images/dashboard.png"
                  alt="Synapse dashboard"
                  fill
                  className="object-cover border-[var(--accent)] border-2"
                />
              </div>
            </div>
          </div>
        </section>
        </>
    )
}