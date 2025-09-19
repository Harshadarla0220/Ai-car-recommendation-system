export interface Car {
  id: string
  make: string
  model: string
  year: number
  price: number
  fuel_type: string
  car_type: string
  mileage: number
  features: string[]
  image_url: string
  description: string
}

export interface UserPreferences {
  budget_min: number
  budget_max: number
  fuel_type?: string
  car_type?: string
  min_mileage?: number
  preferred_brands?: string[]
}

export interface CarRecommendation extends Car {
  match_score: number
  reasoning: string
}

// Sample car data for demonstration
const SAMPLE_CARS: Car[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2023,
    price: 25000,
    fuel_type: "Hybrid",
    car_type: "Sedan",
    mileage: 50,
    features: ["Backup Camera", "Bluetooth", "Lane Assist"],
    image_url: "/placeholder.svg?height=200&width=300&text=Toyota+Camry",
    description: "Reliable and fuel-efficient sedan perfect for daily commuting.",
  },
  {
    id: "2",
    make: "Honda",
    model: "CR-V",
    year: 2023,
    price: 28000,
    fuel_type: "Gasoline",
    car_type: "SUV",
    mileage: 32,
    features: ["AWD", "Sunroof", "Apple CarPlay"],
    image_url: "/placeholder.svg?height=200&width=300&text=Honda+CR-V",
    description: "Spacious SUV with excellent safety ratings and cargo space.",
  },
  {
    id: "3",
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    price: 35000,
    fuel_type: "Electric",
    car_type: "Sedan",
    mileage: 120, // MPGe for electric
    features: ["Autopilot", "Supercharging", "Premium Audio"],
    image_url: "/placeholder.svg?height=200&width=300&text=Tesla+Model+3",
    description: "Cutting-edge electric sedan with advanced technology features.",
  },
  {
    id: "4",
    make: "Ford",
    model: "F-150",
    year: 2023,
    price: 32000,
    fuel_type: "Gasoline",
    car_type: "Truck",
    mileage: 24,
    features: ["4WD", "Towing Package", "Bed Liner"],
    image_url: "/placeholder.svg?height=200&width=300&text=Ford+F-150",
    description: "America's best-selling truck with impressive towing capacity.",
  },
  {
    id: "5",
    make: "BMW",
    model: "X3",
    year: 2023,
    price: 45000,
    fuel_type: "Gasoline",
    car_type: "SUV",
    mileage: 28,
    features: ["Luxury Interior", "Navigation", "Premium Sound"],
    image_url: "/placeholder.svg?height=200&width=300&text=BMW+X3",
    description: "Luxury SUV combining performance with premium comfort.",
  },
]

export function calculateMatchScore(car: Car, preferences: UserPreferences): number {
  let score = 0
  let maxScore = 0

  // Budget matching (30% weight)
  const budgetWeight = 30
  maxScore += budgetWeight
  if (car.price >= preferences.budget_min && car.price <= preferences.budget_max) {
    score += budgetWeight
  } else {
    // Partial score based on how close the price is
    const budgetMid = (preferences.budget_min + preferences.budget_max) / 2
    const budgetRange = preferences.budget_max - preferences.budget_min
    const priceDiff = Math.abs(car.price - budgetMid)
    const proximityScore = Math.max(0, 1 - priceDiff / budgetRange)
    score += budgetWeight * proximityScore
  }

  // Fuel type matching (25% weight)
  const fuelWeight = 25
  maxScore += fuelWeight
  if (preferences.fuel_type && car.fuel_type.toLowerCase() === preferences.fuel_type.toLowerCase()) {
    score += fuelWeight
  }

  // Car type matching (20% weight)
  const typeWeight = 20
  maxScore += typeWeight
  if (preferences.car_type && car.car_type.toLowerCase() === preferences.car_type.toLowerCase()) {
    score += typeWeight
  }

  // Mileage consideration (15% weight)
  const mileageWeight = 15
  maxScore += mileageWeight
  if (preferences.min_mileage && car.mileage >= preferences.min_mileage) {
    score += mileageWeight
  } else if (preferences.min_mileage) {
    const mileageRatio = car.mileage / preferences.min_mileage
    score += mileageWeight * Math.min(1, mileageRatio)
  } else {
    score += mileageWeight * 0.5 // Default score if no preference
  }

  // Brand preference (10% weight)
  const brandWeight = 10
  maxScore += brandWeight
  if (preferences.preferred_brands && preferences.preferred_brands.length > 0) {
    if (preferences.preferred_brands.some((brand) => brand.toLowerCase() === car.make.toLowerCase())) {
      score += brandWeight
    }
  } else {
    score += brandWeight * 0.5 // Default score if no preference
  }

  return Math.round((score / maxScore) * 100)
}

export function generateReasoning(car: Car, preferences: UserPreferences, score: number): string {
  const reasons: string[] = []

  // Budget reasoning
  if (car.price >= preferences.budget_min && car.price <= preferences.budget_max) {
    reasons.push(
      `Fits perfectly within your budget of $${preferences.budget_min.toLocaleString()}-$${preferences.budget_max.toLocaleString()}`,
    )
  } else if (car.price < preferences.budget_min) {
    reasons.push(`Priced below your budget, offering great value`)
  } else {
    reasons.push(`Slightly above budget but offers premium features`)
  }

  // Fuel type reasoning
  if (preferences.fuel_type && car.fuel_type.toLowerCase() === preferences.fuel_type.toLowerCase()) {
    reasons.push(`Matches your preferred ${car.fuel_type.toLowerCase()} fuel type`)
  }

  // Car type reasoning
  if (preferences.car_type && car.car_type.toLowerCase() === preferences.car_type.toLowerCase()) {
    reasons.push(`Perfect ${car.car_type.toLowerCase()} match for your needs`)
  }

  // Mileage reasoning
  if (preferences.min_mileage && car.mileage >= preferences.min_mileage) {
    reasons.push(`Exceeds your minimum mileage requirement with ${car.mileage} MPG`)
  }

  // Brand reasoning
  if (
    preferences.preferred_brands &&
    preferences.preferred_brands.some((brand) => brand.toLowerCase() === car.make.toLowerCase())
  ) {
    reasons.push(`From your preferred brand ${car.make}`)
  }

  return reasons.join(". ") + "."
}

export async function getRecommendations(preferences: UserPreferences): Promise<CarRecommendation[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const recommendations: CarRecommendation[] = SAMPLE_CARS.map((car) => {
    const match_score = calculateMatchScore(car, preferences)
    const reasoning = generateReasoning(car, preferences, match_score)

    return {
      ...car,
      match_score,
      reasoning,
    }
  })

  // Sort by match score (highest first)
  return recommendations.sort((a, b) => b.match_score - a.match_score)
}

export async function getAllCars(): Promise<Car[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return SAMPLE_CARS
}
