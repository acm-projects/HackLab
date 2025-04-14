"use client";

import { useEffect, useState } from "react";
import { Edit2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface EditProfilePageProps {
  onCancel: () => void;
}

export default function EditProfilePage({ onCancel }: EditProfilePageProps) {
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: "Luke Sultzer",
    email: "",
    github: "",
    location: "",
    position: "",
    resume: "",
    school: "",
    joined: "",
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [allSkills, setAllSkills] = useState<{ id: number; skill: string; icon_url?: string }[]>([]);
  const [allTopics, setAllTopics] = useState<{ id: number; topic: string }[]>([]);
  const [allRoles, setAllRoles] = useState<{ id: number; role: string }[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<any[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const handleChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveField = (field: string) => {
    setEditingField(null);
  };

  const getFieldLabel = (key: string): string => {
    if (key === "joined") return "Joined On";
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const validateField = (key: string, value: string): boolean => {
    if (key === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }
    return true;
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [skillsRes, topicsRes, rolesRes] = await Promise.all([
          fetch("http://52.15.58.198:3000/skills"),
          fetch("http://52.15.58.198:3000/topics"),
          fetch("http://52.15.58.198:3000/roles"),
        ]);

        const skillsData = await skillsRes.json();
        const topicsData = await topicsRes.json();
        const rolesData = await rolesRes.json();

        setAllSkills(skillsData);
        setAllTopics(topicsData);
        setAllRoles(rolesData);
      } catch (err) {
        console.error("Error fetching dropdown options:", err);
      }
    };

    fetchDropdownData();
  }, []);

  const handleSaveAll = async () => {
    try {
      for (const s of selectedSkills) {
        await fetch(`http://52.15.58.198:3000/users/1/skills/${s.id}`, { method: "POST" });
      }

      for (const t of selectedTopics) {
        await fetch(`http://52.15.58.198:3000/users/1/topics/${t.id}`, { method: "POST" });
      }

      if (selectedRole) {
        const matchedRole = allRoles.find((r) => r.role === selectedRole);
        if (matchedRole) {
          await fetch(`http://52.15.58.198:3000/users/1`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role_preference_id: matchedRole.id }),
          });
        }
      }

      // ✅ Close the side panel
      onCancel();
    } catch (err) {
      console.error("Error saving profile changes:", err);
    }
  };

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
                      handleSaveField(key);
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

              {key === "email" && editingField === "email" && value && !validateField("email", value) && (
                <p className="text-[12px] text-[#ef4444] mt-[2px]">Please enter a valid email address</p>
              )}

              {key !== "joined" && <Separator className="mt-[8px]" />}
            </div>
          ))}

          {/* Skills */}
          <Label className="text-[14px] font-[600] text-[#374151]">Skills</Label>
          <select
            onChange={(e) => {
              const match = allSkills.find((s) => s.id === parseInt(e.target.value));
              if (match && !selectedSkills.find((s) => s.id === match.id)) {
                setSelectedSkills([...selectedSkills, match]);
              }
            }}
            className="w-full p-[12px] border border-[#d1d5db] rounded-[6px] mb-[12px]"
          >
            <option value="">Select a skill</option>
            {allSkills.map((s) => (
              <option key={s.id} value={s.id}>{s.skill}</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-[8px] mb-[24px]">
            {selectedSkills.map((s, i) => (
              <div key={i} className="flex items-center bg-[#f0f9ff] text-[#0284c7] px-[10px] py-[4px] rounded-full text-sm">
                {s.skill}
                <button
                  onClick={() => setSelectedSkills(selectedSkills.filter((_, idx) => idx !== i))}
                  className="ml-[8px] bg-transparent outline-none border-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Interests */}
          <Label className="text-[14px] font-[600] text-[#374151]">Interests</Label>
          <select
            onChange={(e) => {
              const match = allTopics.find((t) => t.id === parseInt(e.target.value));
              if (match && !selectedTopics.find((t) => t.id === match.id)) {
                setSelectedTopics([...selectedTopics, match]);
              }
            }}
            className="w-full p-[12px] border border-[#d1d5db] rounded-[6px] mb-[12px]"
          >
            <option value="">Select a topic</option>
            {allTopics.map((t) => (
              <option key={t.id} value={t.id}>{t.topic}</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-[8px] mb-[24px]">
            {selectedTopics.map((t, i) => (
              <div key={i} className="flex items-center bg-[#fdf2f8] text-[#be185d] px-[10px] py-[4px] rounded-full text-sm">
                {t.topic}
                <button
                  onClick={() => setSelectedTopics(selectedTopics.filter((_, idx) => idx !== i))}
                  className="ml-[8px] bg-transparent outline-none border-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Role */}
          <Label className="text-[14px] font-[600] text-[#374151]">Preferred Role</Label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full p-[12px] border border-[#d1d5db] rounded-[6px] mb-[24px]"
          >
            <option value="">Select a role</option>
            {allRoles.map((r) => (
              <option key={r.id} value={r.role}>{r.role}</option>
            ))}
          </select>
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
  );
}
