"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Filter, Star, TrendingUp } from "lucide-react"
import { CarCard } from "@/components/cars/car-card"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import {
  calculateCarRecommendations,
  getRecommendationInsights,
  type CarRecommendation,
} from "@/lib/recommendation-engine"
import type { Database } from "@/lib/supabase"

type Car = Database["public"]["Tables"]["cars"]["Row"]
type CarPreference = Database["public"]["Tables"]["car_preferences"]["Row"]

export default function RecommendationsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const preferenceId = searchParams.get("preference")

  const [preference, setPreference] = useState<CarPreference | null>(null)
  const [recommendations, setRecommendations] = useState<CarRecommendation[]>([])
  const [savedCarIds, setSavedCarIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"match" | "price-low" | "price-high" | "mileage">("match")
  const [filterByScore, setFilterByScore] = useState<"all" | "high" | "good">("all")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin")
      return
    }

    if (user && preferenceId) {
      fetchRecommendations()
      fetchSavedCars()
    }
  }, [user, authLoading, preferenceId, router])

  const fetchRecommendations = async () => {
    if (!user || !preferenceId) return

    try {
      // Fetch preference
      const { data: preferenceData, error: prefError } = await supabase
        .from("car_preferences")
        .select("*")
        .eq("id", preferenceId)
        .eq("user_id", user.id)
        .single()

      if (prefError) throw prefError
      setPreference(preferenceData)

      // Fetch all cars
      const { data: carsData, error: carsError } = await supabase.from("cars").select("*")

      if (carsError) throw carsError

      // Calculate recommendations
      const recs = calculateCarRecommendations(carsData || [], preferenceData)
      setRecommendations(recs)
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSavedCars = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.from("saved_recommendations").select("car_id").eq("user_id", user.id)

      if (error) throw error
      setSavedCarIds(new Set(data?.map((item) => item.car_id) || []))
    } catch (error) {
      console.error("Error fetching saved cars:", error)
    }
  }

  const handleSaveToggle = () => {
    fetchSavedCars()
  }

  const getSortedAndFilteredRecommendations = () => {
    let filtered = recommendations

    // Filter by score
    if (filterByScore === "high") {
      filtered = filtered.filter((r) => r.matchScore >= 80)
    } else if (filterByScore === "good") {
      filtered = filtered.filter((r) => r.matchScore >= 60)
    }

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.car.price - b.car.price
        case "price-high":
          return b.car.price - a.car.price
        case "mileage":
          return b.car.mileage - a.car.mileage
        case "match":
        default:
          return b.matchScore - a.matchScore
      }
    })
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!preference) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Preference Not Found</CardTitle>
            <CardDescription>
              The requested preference could not be found or you don't have access to it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const insights = getRecommendationInsights(recommendations)
  const filteredRecommendations = getSortedAndFilteredRecommendations()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Car Recommendations</h1>
          <p className="text-muted-foreground">Based on "{preference.name}" preferences</p>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.totalCars}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Matches (80%+)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{insights.highMatches}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Good Matches (60%+)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{insights.goodMatches}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.averageScore}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Recommendation */}
      {insights.topRecommendation && (
        <Card className="mb-8 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Top Recommendation
            </CardTitle>
            <CardDescription>
              {insights.topRecommendation.matchScore}% match • {insights.topRecommendation.reasons.join(" • ")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CarCard
              car={insights.topRecommendation.car}
              matchScore={insights.topRecommendation.matchScore}
              isSaved={savedCarIds.has(insights.topRecommendation.car.id)}
              onSaveToggle={handleSaveToggle}
            />
          </CardContent>
        </Card>
      )}

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filter by Score:</span>
          <Select value={filterByScore} onValueChange={(value: any) => setFilterByScore(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cars</SelectItem>
              <SelectItem value="high">High (80%+)</SelectItem>
              <SelectItem value="good">Good (60%+)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">Sort by:</span>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Match Score</SelectItem>
              <SelectItem value="price-low">Price (Low to High)</SelectItem>
              <SelectItem value="price-high">Price (High to Low)</SelectItem>
              <SelectItem value="mileage">Fuel Economy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-muted-foreground">
          Showing {filteredRecommendations.length} of {recommendations.length} cars
        </p>
      </div>

      {filteredRecommendations.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Cars Found</CardTitle>
            <CardDescription>Try adjusting your filters to see more results.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((recommendation) => (
            <CarCard
              key={recommendation.car.id}
              car={recommendation.car}
              matchScore={recommendation.matchScore}
              isSaved={savedCarIds.has(recommendation.car.id)}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}
