"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Car, DollarSign, Fuel, Settings, Heart } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"

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

interface PreferenceFormProps {
  preference?: CarPreference
  onSuccess: () => void
  onCancel: () => void
}

const FUEL_TYPES = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "hybrid", label: "Hybrid" },
  { value: "electric", label: "Electric" },
  { value: "cng", label: "CNG" },
]

const CAR_TYPES = [
  { value: "hatchback", label: "Hatchback" },
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "coupe", label: "Coupe" },
  { value: "convertible", label: "Convertible" },
  { value: "wagon", label: "Wagon" },
  { value: "truck", label: "Truck" },
]

const POPULAR_BRANDS = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "Nissan",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Hyundai",
  "Kia",
  "Mazda",
  "Subaru",
  "Tesla",
  "Lexus",
]

export function PreferenceForm({ preference, onSuccess, onCancel }: PreferenceFormProps) {
  const { user, isConfigured } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: preference?.name || "",
    budget_min: preference?.budget_min?.toString() || "15000",
    budget_max: preference?.budget_max?.toString() || "30000",
    fuel_type: preference?.fuel_type || "",
    car_type: preference?.car_type || "",
    mileage_min: preference?.mileage_min?.toString() || "",
    brand_preference: preference?.brand_preference || [],
  })

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleBrandToggle = (brand: string) => {
    const currentBrands = formData.brand_preference || []
    const updatedBrands = currentBrands.includes(brand)
      ? currentBrands.filter((b) => b !== brand)
      : [...currentBrands, brand]

    handleInputChange("brand_preference", updatedBrands)
  }

  const validateForm = () => {
    const budgetMin = Number.parseFloat(formData.budget_min)
    const budgetMax = Number.parseFloat(formData.budget_max)

    if (!formData.name.trim()) {
      alert("Please enter a preference name")
      return false
    }

    if (isNaN(budgetMin) || isNaN(budgetMax) || budgetMin <= 0 || budgetMax <= 0) {
      alert("Please enter valid budget amounts")
      return false
    }

    if (budgetMin >= budgetMax) {
      alert("Maximum budget must be greater than minimum budget")
      return false
    }

    if (!formData.fuel_type) {
      alert("Please select a fuel type")
      return false
    }

    if (!formData.car_type) {
      alert("Please select a car type")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      if (!isConfigured) {
        // Mock success for demo mode
        setTimeout(() => {
          setLoading(false)
          onSuccess()
        }, 1000)
        return
      }

      if (!user) {
        alert("Please sign in to save preferences")
        setLoading(false)
        return
      }

      const preferenceData = {
        name: formData.name.trim(),
        budget_min: Number.parseFloat(formData.budget_min),
        budget_max: Number.parseFloat(formData.budget_max),
        fuel_type: formData.fuel_type,
        car_type: formData.car_type,
        mileage_min: formData.mileage_min ? Number.parseFloat(formData.mileage_min) : null,
        brand_preference: formData.brand_preference.length > 0 ? formData.brand_preference : null,
        user_id: user.id,
      }

      let result
      if (preference) {
        // Update existing preference
        result = await supabase.from("car_preferences").update(preferenceData).eq("id", preference.id)
      } else {
        // Create new preference
        result = await supabase.from("car_preferences").insert([preferenceData])
      }

      if (result.error) {
        throw result.error
      }

      onSuccess()
    } catch (error) {
      console.error("Error saving preference:", error)
      alert("Failed to save preference. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5 text-primary" />
              {preference ? "Edit Preference" : "Create New Preference"}
            </CardTitle>
            <CardDescription>
              Tell us what kind of car you're looking for and we'll find the perfect matches
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preference Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Preference Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Family SUV, City Commuter"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          {/* Budget Range */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Budget Range
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget_min" className="text-sm text-muted-foreground">
                  Minimum Budget
                </Label>
                <Input
                  id="budget_min"
                  type="number"
                  placeholder="15000"
                  value={formData.budget_min}
                  onChange={(e) => handleInputChange("budget_min", e.target.value)}
                  min="1000"
                  step="1000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="budget_max" className="text-sm text-muted-foreground">
                  Maximum Budget
                </Label>
                <Input
                  id="budget_max"
                  type="number"
                  placeholder="30000"
                  value={formData.budget_max}
                  onChange={(e) => handleInputChange("budget_max", e.target.value)}
                  min="1000"
                  step="1000"
                  required
                />
              </div>
            </div>
          </div>

          {/* Fuel Type */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Fuel className="w-4 h-4" />
              Fuel Type
            </Label>
            <Select value={formData.fuel_type} onValueChange={(value) => handleInputChange("fuel_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                {FUEL_TYPES.map((fuel) => (
                  <SelectItem key={fuel.value} value={fuel.value}>
                    {fuel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Car Type */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Car Type
            </Label>
            <Select value={formData.car_type} onValueChange={(value) => handleInputChange("car_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select car type" />
              </SelectTrigger>
              <SelectContent>
                {CAR_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Minimum Mileage */}
          <div className="space-y-2">
            <Label htmlFor="mileage_min">Minimum Mileage (MPG) - Optional</Label>
            <Input
              id="mileage_min"
              type="number"
              placeholder="25"
              value={formData.mileage_min}
              onChange={(e) => handleInputChange("mileage_min", e.target.value)}
              min="1"
              max="100"
            />
          </div>

          {/* Brand Preferences */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Preferred Brands (Optional)
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {POPULAR_BRANDS.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={brand}
                    checked={formData.brand_preference.includes(brand)}
                    onCheckedChange={() => handleBrandToggle(brand)}
                  />
                  <Label htmlFor={brand} className="text-sm font-normal cursor-pointer">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>

            {formData.brand_preference.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.brand_preference.map((brand) => (
                  <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                    {brand}
                    <button
                      type="button"
                      onClick={() => handleBrandToggle(brand)}
                      className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : preference ? "Update Preference" : "Create Preference"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
