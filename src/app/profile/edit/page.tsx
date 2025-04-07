"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Edit2, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface EditProfilePageProps {
  onCancel: () => void
}

export default function EditProfilePage({ onCancel }: EditProfilePageProps) {
  const router = useRouter()

  const [profile, setProfile] = useState({
    name: "Luke Sultzer",
    email: "",
    github: "",
    location: "",
    position: "",
    resume: "",
    school: "",
    joined: "",
  })

  const [editingField, setEditingField] = useState<string | null>(null)

  const handleChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveField = (field: string) => {
    setEditingField(null)
  }

  const handleSaveAll = () => {
    router.push("/profile")
  }

  const getFieldLabel = (key: string): string => {
    if (key === "joined") return "Joined On"
    return key.charAt(0).toUpperCase() + key.slice(1)
  }

  const validateField = (key: string, value: string): boolean => {
    if (key === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    }
    return true
  }

  return (
    <div className="min-h-screen bg-[#fff]">
    <Card className="w-[900px] bg-[#fff] mx-auto px-[24px] py-[20px] rounded-[12px] shadow-md border border-[#e5e7eb]">
      <CardHeader className="pb-[12px]">
        <CardTitle className="text-[20px] font-[700] text-[#1f2937]">Basic Info</CardTitle>
      </CardHeader>
  
      <CardContent className="space-y-[16px] pt-[0px]">
        {Object.entries(profile).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-[8px]">
            <div className="flex justify-between items-center">
              <Label htmlFor={key} className="text-[14px] font-[600] text-[#374151]">
                {getFieldLabel(key)}
              </Label>
              {editingField === key ? (
                <div className="flex gap-[8px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSaveField(key)}
                    disabled={!validateField(key, profile[key as keyof typeof profile])}
                    className="text-[13px] px-[10px] py-[4px]"
                  >
                    <Save className="w-[16px] h-[16px] mr-[4px]" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingField(null)}
                    className="text-[13px] px-[10px] py-[4px]"
                  >
                    <X className="w-[16px] h-[16px] mr-[4px]" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingField(key)}
                  className="text-[13px] px-[10px] py-[4px]"
                >
                  <Edit2 className="w-[16px] h-[16px] mr-[4px]" />
                  Edit
                </Button>
              )}
            </div>
  
            {editingField === key ? (
              <Input
                id={key}
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                onBlur={() => validateField(key, value) && handleSaveField(key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && validateField(key, value)) {
                    handleSaveField(key)
                  }
                }}
                className={`text-[14px] px-[12px] py-[8px] rounded-[6px] border ${
                  !validateField(key, value) && value ? "border-[#ef4444]" : "border-[#d1d5db]"
                }`}
                autoFocus
              />
            ) : (
              <div className="text-[14px] text-[#6b7280] px-[12px] py-[8px] bg-[#f3f4f6] rounded-[6px] min-h-[24px]">
                {value || "Not provided"}
              </div>
            )}
  
            {key === "email" &&
              editingField === "email" &&
              value &&
              !validateField("email", value) && (
                <p className="text-[12px] text-[#ef4444] mt-[2px]">Please enter a valid email address</p>
              )}
            {key !== "joined" && <Separator className="mt-[8px]" />}
          </div>
        ))}
      </CardContent>
  
      <CardFooter className="flex justify-end gap-[12px] mt-[20px]">
        <Button variant="outline" onClick={onCancel} className="px-[18px] py-[8px] text-[14px]">
          Cancel
        </Button>
        <Button onClick={handleSaveAll} className="px-[18px] py-[8px] text-[14px] bg-[#385773] hover:bg-[#2e475d] text-[#fff]">
          Save All Changes
        </Button>
      </CardFooter>
    </Card>
  </div>
  )
}
