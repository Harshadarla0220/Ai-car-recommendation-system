"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Fuel, Calendar, Gauge, Star } from "lucide-react"
import Image from "next/image"
import type { Car, CarRecommendation } from "@/lib/recommendation-engine"

interface CarCardProps {
  car: Car | CarRecommendation
  showMatchScore?: boolean
  onSave?: (carId: string) => void
  onUnsave?: (carId: string) => void
  isSaved?: boolean
}

export function CarCard({ car, showMatchScore = false, onSave, onUnsave, isSaved = false }: CarCardProps) {
  const [isLiked, setIsLiked] = useState(isSaved)
  const [imageLoading, setImageLoading] = useState(true)

  const handleLikeToggle = () => {
    setIsLiked(!isLiked)
    if (!isLiked) {
      onSave?.(car.id)
    } else {
      onUnsave?.(car.id)
    }
  }

  const matchScore = "match_score" in car ? car.match_score : undefined
  const reasoning = "reasoning" in car ? car.reasoning : undefined

  return (
    <Card className="group hover-lift transition-all duration-300 overflow-hidden">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <div className="aspect-video relative bg-gray-100">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
            </div>
          )}
          <Image
            src={car.image_url || "/placeholder.svg"}
            alt={`${car.make} ${car.model}`}
            fill
            className={`object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setImageLoading(false)}
          />
        </div>

        {/* Match Score Badge */}
        {showMatchScore && matchScore && (
          <Badge
            className="absolute top-3 left-3 bg-primary/90 text-primary-foreground animate-scale-in"
            variant="default"
          >
            <Star className="w-3 h-3 mr-1" />
            {matchScore}% Match
          </Badge>
        )}

        {/* Heart Button */}
        <Button
          size="sm"
          variant="ghost"
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isLiked
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
          }`}
          onClick={handleLikeToggle}
        >
          <Heart
            className={`w-4 h-4 transition-all duration-200 ${isLiked ? "fill-current scale-110" : "hover:scale-110"}`}
          />
        </Button>
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">
              {car.make} {car.model}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {car.year} • {car.car_type}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-primary">${car.price.toLocaleString()}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Car Specs */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Fuel className="w-3 h-3" />
            <span className="truncate">{car.fuel_type}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Gauge className="w-3 h-3" />
            <span>{car.mileage} MPG</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{car.year}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1">
          {car.features.slice(0, 3).map((feature) => (
            <Badge key={feature} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
          {car.features.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{car.features.length - 3} more
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">{car.description}</p>

        {/* AI Reasoning (if available) */}
        {reasoning && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">Why this matches you:</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">{reasoning}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 hover-scale" size="sm">
            View Details
          </Button>
          <Button variant="outline" size="sm" className="hover-scale bg-transparent">
            Compare
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
