"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { CarCard } from "@/components/cars/car-card"
import { getRecommendations, type CarRecommendation, type UserPreferences } from "@/lib/recommendation-engine"
import { Brain, TrendingUp, Target, Zap, Filter, SortAsc } from "lucide-react"
import Link from "next/link"

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<CarRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"score" | "price" | "mileage">("score")

  // Sample preferences for demo
  const samplePreferences: UserPreferences = {
    budget_min: 20000,
    budget_max: 40000,
    fuel_type: "Hybrid",
    car_type: "Sedan",
    min_mileage: 30,
    preferred_brands: ["Toyota", "Honda"],
  }

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        const results = await getRecommendations(samplePreferences)
        setRecommendations(results)
      } catch (error) {
        console.error("Error fetching recommendations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  const sortedRecommendations = [...recommendations].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price
      case "mileage":
        return b.mileage - a.mileage
      default:
        return b.match_score - a.match_score
    }
  })

  const averageScore =
    recommendations.length > 0
      ? Math.round(recommendations.reduce((sum, car) => sum + car.match_score, 0) / recommendations.length)
      : 0

  const topMatch = recommendations.length > 0 ? recommendations[0] : null

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Finding your perfect car matches...</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Your AI Car Recommendations</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Based on your preferences, we found {recommendations.length} perfect matches
        </p>
        <Link href="/dashboard">
          <Button variant="outline" className="hover-scale bg-transparent">
            <Filter className="w-4 h-4 mr-2" />
            Update Preferences
          </Button>
        </Link>
      </div>

      {/* Insights Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <Card className="hover-lift animate-fade-in-up">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              <AnimatedCounter end={recommendations.length} />
            </div>
            <p className="text-xs text-muted-foreground">Cars found</p>
          </CardContent>
        </Card>

        <Card className="hover-lift animate-fade-in-up stagger-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Match</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              <AnimatedCounter end={averageScore} suffix="%" />
            </div>
            <p className="text-xs text-muted-foreground">Compatibility score</p>
          </CardContent>
        </Card>

        <Card className="hover-lift animate-fade-in-up stagger-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Match</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              <AnimatedCounter end={topMatch?.match_score || 0} suffix="%" />
            </div>
            <p className="text-xs text-muted-foreground">
              {topMatch?.make} {topMatch?.model}
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift animate-fade-in-up stagger-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Price Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${Math.min(...recommendations.map((r) => r.price)).toLocaleString()}- $
              {Math.max(...recommendations.map((r) => r.price)).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Available options</p>
          </CardContent>
        </Card>
      </div>

      {/* Sort Controls */}
      <div className="flex flex-wrap gap-4 mb-8 animate-fade-in-up stagger-1">
        <div className="flex items-center gap-2">
          <SortAsc className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Sort by:</span>
        </div>
        {[
          { key: "score", label: "Match Score", icon: Target },
          { key: "price", label: "Price", icon: TrendingUp },
          { key: "mileage", label: "Mileage", icon: Zap },
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={sortBy === key ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy(key as typeof sortBy)}
            className="hover-scale"
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>

      {/* Recommendations Grid */}
      {recommendations.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRecommendations.map((car, index) => (
            <div key={car.id} className={`animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}>
              <CarCard car={car} showMatchScore />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No recommendations found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your preferences to see more car options.</p>
          <Link href="/dashboard">
            <Button className="hover-scale">Update Preferences</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
