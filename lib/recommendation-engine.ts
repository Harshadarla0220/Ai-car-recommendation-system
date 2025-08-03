import type { Database } from "@/lib/supabase"

type Car = Database["public"]["Tables"]["cars"]["Row"]
type CarPreference = Database["public"]["Tables"]["car_preferences"]["Row"]

export interface CarRecommendation {
  car: Car
  matchScore: number
  reasons: string[]
}

export function calculateCarRecommendations(cars: Car[], preference: CarPreference): CarRecommendation[] {
  const recommendations: CarRecommendation[] = cars.map((car) => {
    let score = 0
    const reasons: string[] = []
    const maxScore = 100

    // Budget matching (30% weight)
    if (car.price >= preference.budget_min && car.price <= preference.budget_max) {
      score += 30
      reasons.push("Within budget range")
    } else if (car.price < preference.budget_min) {
      const budgetDiff = (preference.budget_min - car.price) / preference.budget_min
      score += Math.max(0, 30 - budgetDiff * 30)
      reasons.push("Below budget (great value)")
    } else {
      const budgetDiff = (car.price - preference.budget_max) / preference.budget_max
      score += Math.max(0, 30 - budgetDiff * 30)
    }

    // Fuel type matching (25% weight)
    if (car.fuel_type === preference.fuel_type) {
      score += 25
      reasons.push(`Matches ${preference.fuel_type} preference`)
    } else {
      // Partial credit for similar fuel types
      if (
        (preference.fuel_type === "hybrid" && car.fuel_type === "electric") ||
        (preference.fuel_type === "electric" && car.fuel_type === "hybrid")
      ) {
        score += 15
        reasons.push("Similar eco-friendly fuel type")
      }
    }

    // Car type matching (20% weight)
    if (car.car_type === preference.car_type) {
      score += 20
      reasons.push(`Matches ${preference.car_type} preference`)
    } else {
      // Partial credit for similar car types
      const similarTypes: Record<string, string[]> = {
        sedan: ["coupe"],
        suv: ["wagon"],
        hatchback: ["sedan"],
        coupe: ["sedan", "convertible"],
        convertible: ["coupe"],
        wagon: ["suv", "hatchback"],
      }

      if (similarTypes[preference.car_type]?.includes(car.car_type)) {
        score += 10
        reasons.push("Similar body style")
      }
    }

    // Mileage matching (15% weight)
    if (preference.mileage_min && car.mileage >= preference.mileage_min) {
      score += 15
      reasons.push(`Exceeds ${preference.mileage_min} MPG requirement`)
    } else if (preference.mileage_min) {
      const mileageDiff = (preference.mileage_min - car.mileage) / preference.mileage_min
      score += Math.max(0, 15 - mileageDiff * 15)
    } else {
      score += 10 // Default credit if no mileage preference
    }

    // Brand preference matching (10% weight)
    if (preference.brand_preference && preference.brand_preference.length > 0) {
      if (preference.brand_preference.includes(car.brand)) {
        score += 10
        reasons.push(`Preferred brand: ${car.brand}`)
      }
    } else {
      score += 5 // Default credit if no brand preference
    }

    // Transmission matching (bonus)
    if (preference.transmission && preference.transmission !== "both") {
      if (car.transmission === preference.transmission) {
        reasons.push(`Matches ${preference.transmission} transmission`)
      }
    }

    // Ensure score doesn't exceed 100
    score = Math.min(score, maxScore)

    return {
      car,
      matchScore: Math.round(score),
      reasons,
    }
  })

  // Sort by match score (highest first)
  return recommendations.sort((a, b) => b.matchScore - a.matchScore)
}

export function getRecommendationInsights(recommendations: CarRecommendation[]) {
  const totalCars = recommendations.length
  const highMatches = recommendations.filter((r) => r.matchScore >= 80).length
  const goodMatches = recommendations.filter((r) => r.matchScore >= 60 && r.matchScore < 80).length
  const averageScore = recommendations.reduce((sum, r) => sum + r.matchScore, 0) / totalCars

  return {
    totalCars,
    highMatches,
    goodMatches,
    averageScore: Math.round(averageScore),
    topRecommendation: recommendations[0],
  }
}
