"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, ArrowLeft } from "lucide-react"
import { CarCard } from "@/components/cars/car-card"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import type { Database } from "@/lib/supabase"

type Car = Database["public"]["Tables"]["cars"]["Row"]
type SavedRecommendation = Database["public"]["Tables"]["saved_recommendations"]["Row"] & {
  cars: Car
}

export default function SavedCarsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [savedCars, setSavedCars] = useState<SavedRecommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin")
      return
    }

    if (user) {
      fetchSavedCars()
    }
  }, [user, authLoading, router])

  const fetchSavedCars = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("saved_recommendations")
        .select(`
          *,
          cars (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setSavedCars(data || [])
    } catch (error) {
      console.error("Error fetching saved cars:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveToggle = () => {
    fetchSavedCars()
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            Saved Cars
          </h1>
          <p className="text-muted-foreground">Your favorite car recommendations</p>
        </div>
      </div>

      {savedCars.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Saved Cars</CardTitle>
            <CardDescription>
              You haven't saved any cars yet. Browse recommendations and save your favorites!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard")}>Browse Recommendations</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-muted-foreground">
              {savedCars.length} saved car{savedCars.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCars.map((savedCar) => (
              <CarCard
                key={savedCar.id}
                car={savedCar.cars}
                matchScore={savedCar.match_score || undefined}
                isSaved={true}
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
