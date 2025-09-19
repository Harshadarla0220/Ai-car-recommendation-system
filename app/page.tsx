import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { Car, Zap, Shield, Users, ArrowRight, Sparkles, Target, Brain } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 animate-bounce-in glass hover-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Car Recommendations
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up gradient-text">
              Find Your Perfect Car
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in-up stagger-1">
              Get personalized car recommendations powered by advanced AI algorithms. Save time, make informed
              decisions, and drive away happy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-2 mb-12">
              <Button asChild size="lg" className="hover-scale">
                <Link href="/dashboard">
                  <Brain className="w-5 h-5 mr-2" />
                  Get AI Recommendations
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="hover-scale bg-transparent">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image Section */}
      <section className="relative -mt-10 pb-10">
        <div className="container mx-auto px-4">
          <div className="relative max-w-6xl mx-auto animate-fade-in-up stagger-3">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl transform scale-105" />
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-2 shadow-2xl">
              <Image
                src="https://i.ibb.co/wrZRLR5D/car-dashboard.jpg"
                alt="AI Car Recommendation Dashboard Preview"
                width={1200}
                height={600}
                className="w-full h-auto rounded-xl shadow-lg hover-lift object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Cars Analyzed", value: 10000, suffix: "+" },
              { label: "Happy Customers", value: 5000, suffix: "+" },
              { label: "Accuracy Rate", value: 95, suffix: "%" },
              { label: "Time Saved", value: 80, suffix: "%" },
            ].map((stat, index) => (
              <div key={stat.label} className={`text-center animate-fade-in-up stagger-${index + 1}`}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">Why Choose CarAI?</h2>
            <p className="text-xl text-muted-foreground animate-fade-in-up stagger-1">
              Advanced AI technology meets automotive expertise
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Matching",
                description:
                  "Our advanced algorithms analyze your preferences, budget, and needs to find the perfect car matches.",
                color: "text-blue-500",
              },
              {
                icon: Target,
                title: "Personalized Results",
                description:
                  "Get recommendations tailored specifically to your lifestyle, driving habits, and financial situation.",
                color: "text-green-500",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Get instant recommendations in seconds, not hours of browsing through countless listings.",
                color: "text-yellow-500",
              },
              {
                icon: Shield,
                title: "Trusted & Secure",
                description:
                  "Your data is protected with enterprise-grade security. We never share your personal information.",
                color: "text-red-500",
              },
              {
                icon: Users,
                title: "Expert Verified",
                description: "All recommendations are backed by automotive experts and real user reviews.",
                color: "text-purple-500",
              },
              {
                icon: Car,
                title: "Comprehensive Database",
                description: "Access to thousands of cars with detailed specifications, pricing, and availability.",
                color: "text-indigo-500",
              },
            ].map((feature, index) => (
              <Card key={feature.title} className={`hover-lift animate-fade-in-up stagger-${index + 1}`}>
                <CardHeader>
                  <feature.icon className={`w-12 h-12 ${feature.color} mb-4 animate-bounce-slow`} />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">How It Works</h2>
            <p className="text-xl text-muted-foreground animate-fade-in-up stagger-1">
              Get your perfect car recommendation in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Share Your Preferences",
                description: "Tell us about your budget, preferred fuel type, car size, and other requirements.",
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Our AI analyzes thousands of cars and matches them against your specific criteria.",
              },
              {
                step: "03",
                title: "Get Recommendations",
                description: "Receive personalized car recommendations with detailed insights and match scores.",
              },
            ].map((step, index) => (
              <div key={step.step} className={`text-center animate-fade-in-up stagger-${index + 1}`}>
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 hover-scale">
                  {step.step}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground text-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">Ready to Find Your Perfect Car?</h2>
          <p className="text-xl mb-8 opacity-90 animate-fade-in-up stagger-1">
            Join thousands of satisfied customers who found their dream car with CarAI
          </p>
          <Button asChild size="lg" variant="secondary" className="hover-scale animate-fade-in-up stagger-2">
            <Link href="/auth/signup">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
