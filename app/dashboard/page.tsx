"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PreferenceForm } from "@/components/preferences/preference-form"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Car, Settings, TrendingUp, Heart, Plus, Edit, Trash2, Sparkles, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface CarPreference {
  id: string
  name: string
  budget_min: number
  budget_max: number
  fuel_type: string
  car_type: string
  mileage_min?: number
  brand_preference?: string[]
  created_at: string
}

// Mock data for when Supabase is not configured
const mockPreferences: CarPreference[] = [
  {
    id: "1",
    name: "Family SUV",
    budget_min: 30000,
    budget_max: 50000,
    fuel_type: "hybrid",
    car_type: "suv",
    mileage_min: 25,
    brand_preference: ["Toyota", "Honda", "Mazda"],
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "City Commuter",
    budget_min: 15000,
    budget_max: 25000,
    fuel_type: "petrol",
    car_type: "hatchback",
    mileage_min: 30,
    brand_preference: ["Honda", "Nissan"],
    created_at: new Date().toISOString(),
  },
]

export default function DashboardPage() {
  const { user, loading, isConfigured } = useAuth()
  const router = useRouter()
  const [preferences, setPreferences] = useState<CarPreference[]>([])
  const [stats, setStats] = useState({
    totalPreferences: 2,
    totalRecommendations: 15,
    savedCars: 8,
  })
  const [loadingPreferences, setLoadingPreferences] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPreference, setEditingPreference] = useState<CarPreference | null>(null)

  useEffect(() => {
    if (!loading && !user && isConfigured) {
      router.push("/auth/signin")
      return
    }

    if (user || !isConfigured) {
      fetchPreferences()
      fetchStats()
    }
  }, [user, loading, router, isConfigured])

  const fetchPreferences = async () => {
    try {
      if (!isConfigured) {
        // Use mock data when Supabase is not configured
        setPreferences(mockPreferences)
        setLoadingPreferences(false)
        return
      }

      if (!user) {
        setPreferences([])
        setLoadingPreferences(false)
        return
      }

      const { data, error } = await supabase
        .from("car_preferences")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase error:", error)
        // Fallback to mock data on error
        setPreferences(mockPreferences)
      } else {
        setPreferences(data || [])
      }
    } catch (error) {
      console.error("Error fetching preferences:", error)
      // Fallback to mock data on network error
      setPreferences(mockPreferences)
    } finally {
      setLoadingPreferences(false)
    }
  }

  const fetchStats = async () => {
    try {
      if (!isConfigured || !user) {
        // Use mock stats when Supabase is not configured
        setStats({
          totalPreferences: mockPreferences.length,
          totalRecommendations: 15,
          savedCars: 8,
        })
        return
      }

      const [prefsResult, recsResult, savedResult] = await Promise.all([
        supabase.from("car_preferences").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("saved_recommendations").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("saved_recommendations").select("id", { count: "exact" }).eq("user_id", user.id),
      ])

      setStats({
        totalPreferences: prefsResult.count || 0,
        totalRecommendations: recsResult.count || 0,
        savedCars: savedResult.count || 0,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
      // Use mock stats on error
      setStats({
        totalPreferences: mockPreferences.length,
        totalRecommendations: 15,
        savedCars: 8,
      })
    }
  }

  const handleDeletePreference = async (id: string) => {
    if (!confirm("Are you sure you want to delete this preference?")) return

    try {
      if (!isConfigured) {
        // Mock deletion for demo
        setPreferences(preferences.filter((p) => p.id !== id))
        setStats((prev) => ({
          ...prev,
          totalPreferences: Math.max(0, prev.totalPreferences - 1),
        }))
        return
      }

      const { error } = await supabase.from("car_preferences").delete().eq("id", id)

      if (error) throw error

      setPreferences(preferences.filter((p) => p.id !== id))
      fetchStats()
    } catch (error) {
      console.error("Error deleting preference:", error)
    }
  }

  const formatBudget = (min: number, max: number) => {
    // Ensure we have valid numbers
    const validMin = typeof min === "number" && !isNaN(min) ? min : 0
    const validMax = typeof max === "number" && !isNaN(max) ? max : 0

    const formatPrice = (price: number) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(price)

    return `${formatPrice(validMin)} - ${formatPrice(validMax)}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Supabase Configuration Alert */}
      {!isConfigured && (
        <Alert className="mb-6 animate-fade-in-up">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Demo Mode:</strong> Supabase is not configured. You're viewing mock data.
            <Link href="/" className="ml-2 underline">
              Set up Supabase to enable full functionality
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-4xl font-bold mb-2 gradient-text">
          Welcome back, {user?.email?.split("@")[0] || "Demo User"}!
        </h1>
        <p className="text-muted-foreground text-lg">Manage your car preferences and get AI-powered recommendations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover-lift animate-fade-in-up stagger-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Car Preferences</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter end={stats.totalPreferences} />
            </div>
            <p className="text-xs text-muted-foreground">Active preference profiles</p>
          </CardContent>
        </Card>

        <Card className="hover-lift animate-fade-in-up stagger-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter end={stats.totalRecommendations} />
            </div>
            <p className="text-xs text-muted-foreground">Cars recommended for you</p>
          </CardContent>
        </Card>

        <Card className="hover-lift animate-fade-in-up stagger-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Cars</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter end={stats.savedCars} />
            </div>
            <p className="text-xs text-muted-foreground">Cars in your favorites</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="hover-lift animate-fade-in-up stagger-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-bounce-slow" />
              Get AI Recommendations
            </CardTitle>
            <CardDescription>Let our AI find the perfect cars based on your preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full hover-scale">
              <Link href="/recommendations">
                <Car className="w-4 h-4 mr-2" />
                View Recommendations
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-lift animate-fade-in-up stagger-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 animate-pulse-slow" />
              Saved Cars
            </CardTitle>
            <CardDescription>Review and manage your favorite car selections</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full hover-scale bg-transparent">
              <Link href="/saved">View Saved Cars</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Preferences Section */}
      <div className="animate-fade-in-up stagger-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Your Preferences</h2>
          <Button onClick={() => setShowForm(true)} className="hover-scale">
            <Plus className="w-4 h-4 mr-2" />
            Add Preference
          </Button>
        </div>

        {loadingPreferences ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : preferences.length === 0 ? (
          <Card className="text-center py-12 animate-fade-in-up">
            <CardContent>
              <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-bounce-slow" />
              <h3 className="text-lg font-semibold mb-2">No preferences yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first car preference to get personalized recommendations
              </p>
              <Button onClick={() => setShowForm(true)} className="hover-scale">
                <Plus className="w-4 h-4 mr-2" />
                Create Preference
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {preferences.map((preference, index) => (
              <Card key={preference.id} className={`hover-lift animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{preference.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingPreference(preference)
                          setShowForm(true)
                        }}
                        className="hover-scale"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePreference(preference.id)}
                        className="hover-scale text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-semibold">{formatBudget(preference.budget_min, preference.budget_max)}</p>
                  </div>

                  <div className="flex gap-2">
                    <Badge variant="outline" className="capitalize">
                      {preference.fuel_type}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {preference.car_type}
                    </Badge>
                  </div>

                  {preference.brand_preference && preference.brand_preference.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Preferred Brands</p>
                      <div className="flex flex-wrap gap-1">
                        {preference.brand_preference.slice(0, 3).map((brand) => (
                          <Badge key={brand} variant="secondary" className="text-xs">
                            {brand}
                          </Badge>
                        ))}
                        {preference.brand_preference.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{preference.brand_preference.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <Button asChild className="w-full mt-4 hover-scale" size="sm">
                    <Link href={`/recommendations?preference=${preference.id}`}>Get Recommendations</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Preference Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in-up">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <PreferenceForm
              preference={editingPreference}
              onSuccess={() => {
                setShowForm(false)
                setEditingPreference(null)
                fetchPreferences()
                fetchStats()
              }}
              onCancel={() => {
                setShowForm(false)
                setEditingPreference(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
