import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Brain, Shield, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect Car with <span className="text-primary">AI-Powered</span> Recommendations
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Get personalized car recommendations based on your preferences, budget, and lifestyle. Our AI analyzes
            thousands of vehicles to find your ideal match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose CarAI?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our advanced AI system considers multiple factors to provide you with the most relevant car recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Brain className="h-10 w-10 text-primary mb-2" />
              <CardTitle>AI-Powered Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced algorithms analyze your preferences to find the perfect car matches with high accuracy scores.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Car className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Comprehensive Database</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access to thousands of vehicles with detailed specifications, features, and real-time pricing
                information.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your data is protected with enterprise-grade security. We never share your personal information.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Instant Results</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get personalized recommendations in seconds. Save time and make informed decisions quickly.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/50 rounded-lg">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get personalized car recommendations in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Set Your Preferences</h3>
            <p className="text-muted-foreground">
              Tell us about your budget, preferred fuel type, car type, and other preferences.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
            <p className="text-muted-foreground">
              Our AI analyzes thousands of vehicles and calculates match scores based on your criteria.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Recommendations</h3>
            <p className="text-muted-foreground">
              Receive personalized car recommendations ranked by compatibility with your needs.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Car?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who have found their ideal vehicle with CarAI.
          </p>
          <Link href="/auth/signup">
            <Button size="lg">Start Your Search Today</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
