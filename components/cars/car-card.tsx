"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Fuel, Gauge, Settings, Star } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import type { Database } from "@/lib/supabase"

type Car = Database["public"]["Tables"]["cars"]["Row"]

interface CarCardProps {
  car: Car
  matchScore?: number
  isSaved?: boolean
  onSaveToggle?: () => void
}

export function CarCard({ car, matchScore, isSaved = false, onSaveToggle }: CarCardProps) {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)

  const handleSaveToggle = async () => {
    if (!user) return

    setSaving(true)
    try {
      if (isSaved) {
        await supabase.from("saved_recommendations").delete().eq("user_id", user.id).eq("car_id", car.id)
      } else {
        await supabase.from("saved_recommendations").insert({
          user_id: user.id,
          car_id: car.id,
          match_score: matchScore || 0,
        })
      }
      onSaveToggle?.()
    } catch (error) {
      console.error("Error toggling save:", error)
    } finally {
      setSaving(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={car.image_url || "/placeholder.svg?height=200&width=300&query=car"}
          alt={car.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        {matchScore && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {matchScore}% Match
            </Badge>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={handleSaveToggle}
          disabled={saving}
        >
          <Heart className={`h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
      </div>

      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{car.name}</CardTitle>
            <CardDescription>
              {car.year} • {car.brand}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{formatPrice(car.price)}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Fuel className="h-4 w-4" />
            <span className="capitalize">{car.fuel_type}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Gauge className="h-4 w-4" />
            <span>{car.mileage} MPG</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Settings className="h-4 w-4" />
            <span className="capitalize">{car.transmission}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className="capitalize">
            {car.car_type}
          </Badge>
          {car.features?.slice(0, 2).map((feature) => (
            <Badge key={feature} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
          {car.features && car.features.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{car.features.length - 2} more
            </Badge>
          )}
        </div>

        {car.description && <p className="text-sm text-muted-foreground line-clamp-2">{car.description}</p>}
      </CardContent>
    </Card>
  )
}
