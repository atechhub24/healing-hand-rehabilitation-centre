"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/lib/hooks/use-fetch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Star, Clock, ArrowLeft, Briefcase } from "lucide-react";

interface Paramedic {
  uid: string;
  name: string;
  experience: number;
  rating?: number;
  specialization: string;
  role: string;
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  serviceArea: {
    city: string;
    state: string;
    pincode: string;
  };
}

interface BookingFormData {
  serviceType: string;
  date: Date;
  startTime: string;
  duration: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  condition: string;
  symptoms: string;
  specialRequirements?: string;
  medicalHistory?: string;
}

interface ParamedicCardProps {
  paramedic: Paramedic;
  onSelect: (paramedic: Paramedic) => void;
  formData: BookingFormData;
}

function ParamedicCard({ paramedic, onSelect, formData }: ParamedicCardProps) {
  // Check if paramedic is available at the requested time
  const isAvailable = () => {
    const requestedTime = parseInt(formData.startTime.split(":")[0]);
    const startTime = parseInt(paramedic.availability.startTime.split(":")[0]);
    const endTime = parseInt(paramedic.availability.endTime.split(":")[0]);

    return (
      requestedTime >= startTime && requestedTime + formData.duration <= endTime
    );
  };

  return (
    <Card
      className="p-6 hover:border-primary transition-colors cursor-pointer"
      onClick={() => onSelect(paramedic)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{paramedic.name}</h3>
            <p className="text-sm text-muted-foreground">
              {paramedic.specialization}
            </p>
          </div>
        </div>
        <Badge variant={isAvailable() ? "default" : "secondary"}>
          {isAvailable() ? "Available" : "Busy"}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="h-4 w-4 text-primary" />
          <span>{paramedic.experience} years experience</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          <span>
            {paramedic.availability.startTime} -{" "}
            {paramedic.availability.endTime}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>
            {paramedic.serviceArea.city}, {paramedic.serviceArea.state} -{" "}
            {paramedic.serviceArea.pincode}
          </span>
        </div>
        {paramedic.rating && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{paramedic.rating.toFixed(1)} / 5.0</span>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function SelectParamedicPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<BookingFormData | null>(null);

  // Get form data from URL params
  useEffect(() => {
    const data: BookingFormData = {
      serviceType: searchParams.get("serviceType") || "",
      date: new Date(searchParams.get("date") || ""),
      startTime: searchParams.get("startTime") || "",
      duration: parseInt(searchParams.get("duration") || "0"),
      address: searchParams.get("address") || "",
      city: searchParams.get("city") || "",
      state: searchParams.get("state") || "",
      pincode: searchParams.get("pincode") || "",
      landmark: searchParams.get("landmark") || undefined,
      condition: searchParams.get("condition") || "",
      symptoms: searchParams.get("symptoms") || "",
      specialRequirements: searchParams.get("specialRequirements") || undefined,
      medicalHistory: searchParams.get("medicalHistory") || undefined,
    };
    setFormData(data);
  }, [searchParams]);

  // Fetch paramedics
  const [paramedicsData] = useFetch<Record<string, Paramedic>>("users", {
    needRaw: true,
  });

  // Filter paramedics by role only and sort by rating
  const availableParamedics = paramedicsData
    ? Object.values(paramedicsData)
        .filter((paramedic) => paramedic.role === "paramedic")
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    : [];

  const handleParamedicSelect = (paramedic: Paramedic) => {
    if (!formData) return;

    // Convert form data to string values for URL params
    const updatedFormData = {
      serviceType: formData.serviceType,
      date: formData.date.toISOString(),
      startTime: formData.startTime,
      duration: formData.duration.toString(),
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      landmark: formData.landmark || "",
      condition: formData.condition,
      symptoms: formData.symptoms,
      specialRequirements: formData.specialRequirements || "",
      medicalHistory: formData.medicalHistory || "",
      paramedicId: paramedic.uid,
    };

    const queryString = new URLSearchParams(updatedFormData).toString();
    router.push(`/${params.role}/paramedic-booking/confirm?${queryString}`);
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Select Paramedic
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose a paramedic available in your area
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {availableParamedics.length > 0 ? (
          availableParamedics.map((paramedic) => (
            <ParamedicCard
              key={paramedic.uid}
              paramedic={paramedic}
              onSelect={handleParamedicSelect}
              formData={formData}
            />
          ))
        ) : (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">
              No paramedics available in your area
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
