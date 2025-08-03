"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import type { Database } from "@/lib/supabase"

type CarPreference = Database["public"]["Tables"]["car_preferences"]["Row"]
type CarPreferenceInsert = Database["public"]["Tables"]["car_preferences"]["Insert"]

interface PreferenceFormProps {
  preference?: CarPreference
  onSuccess?: () => void
  onCancel?: () => void
}

const BRANDS = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Nissan",
  "Hyundai",
  "Mazda",
  "Subaru",
  "Tesla",
  "Jeep",
  "Lexus",
  "Acura",
]

export function PreferenceForm({ preference, onSuccess, onCancel }: PreferenceFormProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    budget_min: 15000,
    budget_max: 50000,
    fuel_type: "petrol" as const,
    car_type: "sedan" as const,
    brand_preference: [] as string[],
    mileage_min: 20,
    transmission: "automatic" as const,
  })

  useEffect(() => {
    if (preference) {
      setFormData({
        name: preference.name,
        budget_min: preference.budget_min,
        budget_max: preference.budget_max,
        fuel_type: preference.fuel_type,
        car_type: preference.car_type,
        brand_preference: preference.brand_preference || [],
        mileage_min: preference.mileage_min || 20,
        transmission: preference.transmission || "automatic",
      })
    }
  }, [preference])

  const handleBrandToggle = (brand: string) => {
    setFormData((prev) => ({
      ...prev,
      brand_preference: prev.brand_preference.includes(brand)
        ? prev.brand_preference.filter((b) => b !== brand)
        : [...prev.brand_preference, brand],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError("")

    try {
      const data: CarPreferenceInsert = {
        ...formData,
        user_id: user.id,
        brand_preference: formData.brand_preference.length > 0 ? formData.brand_preference : null,
        mileage_min: formData.mileage_min || null,
        transmission: formData.transmission || null,
      }

      if (preference) {
        const { error } = await supabase.from("car_preferences").update(data).eq("id", preference.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("car_preferences").insert(data)

        if (error) throw error
      }

      onSuccess?.()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{preference ? "Edit Preference" : "Create New Preference"}</CardTitle>
        <CardDescription>Set your car preferences to get personalized recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Preference Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Family Car, Daily Commuter"
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget_min">Minimum Budget ($)</Label>
              <Input
                id="budget_min"
                type="number"
                value={formData.budget_min}
                onChange={(e) => setFormData((prev) => ({ ...prev, budget_min: Number.parseInt(e.target.value) }))}
                min="0"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget_max">Maximum Budget ($)</Label>
              <Input
                id="budget_max"
                type="number"
                value={formData.budget_max}
                onChange={(e) => setFormData((prev) => ({ ...prev, budget_max: Number.parseInt(e.target.value) }))}
                min="0"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fuel Type</Label>
              <Select
                value={formData.fuel_type}
                onValueChange={(value: any) => setFormData((prev) => ({ ...prev, fuel_type: value }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petrol">Petrol</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Car Type</Label>
              <Select
                value={formData.car_type}
                onValueChange={(value: any) => setFormData((prev) => ({ ...prev, car_type: value }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="hatchback">Hatchback</SelectItem>
                  <SelectItem value="coupe">Coupe</SelectItem>
                  <SelectItem value="convertible">Convertible</SelectItem>
                  <SelectItem value="wagon">Wagon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mileage_min">Minimum Mileage (MPG)</Label>
              <Input
                id="mileage_min"
                type="number"
                value={formData.mileage_min}
                onChange={(e) => setFormData((prev) => ({ ...prev, mileage_min: Number.parseInt(e.target.value) }))}
                min="0"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label>Transmission</Label>
              <Select
                value={formData.transmission}
                onValueChange={(value: any) => setFormData((prev) => ({ ...prev, transmission: value }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Preferred Brands (optional)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {BRANDS.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={brand}
                    checked={formData.brand_preference.includes(brand)}
                    onCheckedChange={() => handleBrandToggle(brand)}
                    disabled={loading}
                  />
                  <Label htmlFor={brand} className="text-sm">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {preference ? "Update Preference" : "Create Preference"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
