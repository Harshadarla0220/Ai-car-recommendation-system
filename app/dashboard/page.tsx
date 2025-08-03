"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Settings, Car, TrendingUp } from "lucide-react"
import { PreferenceForm } from "@/components/preferences/preference-form"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import type { Database } from "@/lib/supabase"

type CarPreference = Database["public"]["Tables"]["car_preferences"]["Row"]

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [preferences, setPreferences] = useState<CarPreference[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPreference, setEditingPreference] = useState<CarPreference | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin")
      return
    }

    if (user) {
      fetchPreferences()
    }
  }, [user, authLoading, router])

  const fetchPreferences = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("car_preferences")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setPreferences(data || [])
    } catch (error) {
      console.error("Error fetching preferences:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePreference = async (id: string) => {
    if (!confirm("Are you sure you want to delete this preference?")) return

    try {
      const { error } = await supabase.from("car_preferences").delete().eq("id", id)

      if (error) throw error
      await fetchPreferences()
    } catch (error) {
      console.error("Error deleting preference:", error)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingPreference(null)
    fetchPreferences()
  }

  const handleGetRecommendations = (preference: CarPreference) => {
    router.push(`/recommendations?preference=${preference.id}`)
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (showForm || editingPreference) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PreferenceForm
          preference={editingPreference || undefined}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false)
            setEditingPreference(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your car preferences and get personalized recommendations</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Preference
        </Button>
      </div>

      {preferences.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to CarAI!</CardTitle>
            <CardDescription>Get started by creating your first car preference profile</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Create a preference profile to tell us what kind of car you're looking for. Our AI will analyze your
              preferences and provide personalized recommendations.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Preference
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {preferences.map((preference) => (
            <Card key={preference.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  {preference.name}
                </CardTitle>
                <CardDescription>Created {new Date(preference.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Budget:</span>
                    <span>
                      ${preference.budget_min.toLocaleString()} - ${preference.budget_max.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fuel Type:</span>
                    <span className="capitalize">{preference.fuel_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Car Type:</span>
                    <span className="capitalize">{preference.car_type}</span>
                  </div>
                  {preference.mileage_min && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Min Mileage:</span>
                      <span>{preference.mileage_min} MPG</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={() => handleGetRecommendations(preference)} className="flex-1">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Get Recommendations
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingPreference(preference)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  size="sm"
                  variant="destructive"
                  className="w-full mt-2"
                  onClick={() => handleDeletePreference(preference.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
