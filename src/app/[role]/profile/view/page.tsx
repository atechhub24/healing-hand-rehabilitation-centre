"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import useFetch from "@/lib/hooks/use-fetch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  User,
  Phone,
  Calendar,
  UserCircle2,
  AlertCircle,
  FileText,
  PenSquare,
  Ruler,
  Weight,
  PhoneCall,
  Pill,
  Activity,
  Stethoscope,
  HeartPulse,
  Users,
  Users2,
  Bike,
  Globe,
  Languages,
  Laptop,
  LayoutGrid,
  Clock,
  History,
  Monitor,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { cn } from "@/lib/utils";

interface UserData {
  uid: string;
  role: string;
  phoneNumber: string;
  name?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  height?: number;
  weight?: number;
  emergencyContact?: string;
  allergies?: string;
  medicalHistory?: string;
  currentMedications?: string;
  chronicConditions?: string;
  surgicalHistory?: string;
  familyHistory?: string;
  lifestyle?: string;
  createdAt: string;
  lastLogin: string;
  creatorInfo?: {
    actionBy: string;
    browser: string;
    language: string;
    platform: string;
    screenResolution: string;
    timestamp: string;
    userAgent: string;
  };
  updaterInfo?: {
    actionBy: string;
    browser: string;
    language: string;
    platform: string;
    screenResolution: string;
    timestamp: string;
    userAgent: string;
  };
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
  isAlert?: boolean;
  colorClass?: string;
}

function InfoItem({
  icon,
  label,
  value,
  isAlert,
  colorClass = "text-primary",
}: InfoItemProps) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      <div className={`mt-0.5 ${isAlert ? "text-yellow-500" : colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base whitespace-pre-wrap">{value}</p>
      </div>
    </div>
  );
}

interface SystemInfo {
  actionBy: string;
  browser: string;
  language: string;
  platform: string;
  screenResolution: string;
  timestamp: string;
  userAgent: string;
}

function SystemInfoCard({
  title,
  info,
  icon,
  colorClass,
}: {
  title: string;
  info: SystemInfo | undefined;
  icon: React.ReactNode;
  colorClass: string;
}) {
  if (!info) return null;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className={colorClass}>{icon}</div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">System information</p>
        </div>
      </div>

      <div className="space-y-4">
        <InfoItem
          icon={<Globe className="h-4 w-4" />}
          label="Browser"
          value={info.browser}
          colorClass={colorClass}
        />
        <InfoItem
          icon={<Languages className="h-4 w-4" />}
          label="Language"
          value={info.language}
          colorClass={colorClass}
        />
        <InfoItem
          icon={<Laptop className="h-4 w-4" />}
          label="Platform"
          value={info.platform}
          colorClass={colorClass}
        />
        <InfoItem
          icon={<LayoutGrid className="h-4 w-4" />}
          label="Screen Resolution"
          value={info.screenResolution}
          colorClass={colorClass}
        />
        <InfoItem
          icon={<Clock className="h-4 w-4" />}
          label="Timestamp"
          value={new Date(info.timestamp).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
          colorClass={colorClass}
        />
      </div>
    </Card>
  );
}

const genderOptions = [
  {
    value: "male",
    label: "Male",
    icon: <UserCircle2 className="h-5 w-5" />,
    description: "I identify as male",
    color: "text-blue-500 bg-blue-50",
  },
  {
    value: "female",
    label: "Female",
    icon: <Users2 className="h-5 w-5" />,
    description: "I identify as female",
    color: "text-pink-500 bg-pink-50",
  },
  {
    value: "other",
    label: "Other",
    icon: <Users className="h-5 w-5" />,
    description: "I identify as non-binary",
    color: "text-purple-500 bg-purple-50",
  },
];

const bloodGroupOptions = [
  { value: "A+", label: "A+", color: "text-red-500 bg-red-50" },
  { value: "A-", label: "A-", color: "text-red-500 bg-red-50" },
  { value: "B+", label: "B+", color: "text-blue-500 bg-blue-50" },
  { value: "B-", label: "B-", color: "text-blue-500 bg-blue-50" },
  { value: "AB+", label: "AB+", color: "text-purple-500 bg-purple-50" },
  { value: "AB-", label: "AB-", color: "text-purple-500 bg-purple-50" },
  { value: "O+", label: "O+", color: "text-green-500 bg-green-50" },
  { value: "O-", label: "O-", color: "text-green-500 bg-green-50" },
];

function GenderDisplay({ value }: { value?: string }) {
  if (!value) return null;
  const option = genderOptions.find((opt) => opt.value === value);
  if (!option) return null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-muted-foreground">Gender</p>
      <div
        className={cn(
          "flex flex-col items-center justify-between rounded-xl border-2 border-muted p-4",
          option.color
        )}
      >
        {option.icon}
        <div className="mt-3 space-y-1 text-center">
          <div className="text-base font-medium leading-none">
            {option.label}
          </div>
          <div className="text-sm text-muted-foreground">
            {option.description}
          </div>
        </div>
      </div>
    </div>
  );
}

function BloodGroupDisplay({ value }: { value?: string }) {
  if (!value) return null;
  const option = bloodGroupOptions.find((opt) => opt.value === value);
  if (!option) return null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-muted-foreground">Blood Group</p>
      <div
        className={cn(
          "flex h-16 items-center justify-center rounded-xl border-2 border-muted text-lg font-semibold",
          option.color
        )}
      >
        {option.label}
      </div>
    </div>
  );
}

export default function ProfileViewPage() {
  const { user } = useAuth();
  const { userData } = useAuthStore();
  const router = useRouter();
  const [profileData] = useFetch<UserData>(`/users/${user?.uid}`, {
    needRaw: true,
  });

  const handleEdit = () => {
    router.push(`/${userData?.role}/profile/edit`);
  };

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading profile information...</p>
      </div>
    );
  }

  return (
    <div className="container px-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">View your profile information</p>
        </div>
        <Button onClick={handleEdit} className="gap-2">
          <PenSquare className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-3 lg:grid-cols-2">
        {/* Personal Information - Takes full width on smaller screens, 1/3 on xl */}
        <Card className="p-4 xl:row-span-2">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <p className="text-sm text-muted-foreground">
                Your basic profile details
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <InfoItem
              icon={<User className="h-4 w-4" />}
              label="Full Name"
              value={profileData.name}
              colorClass="text-blue-500"
            />
            <InfoItem
              icon={<Phone className="h-4 w-4" />}
              label="Phone Number"
              value={profileData.phoneNumber}
              colorClass="text-blue-500"
            />
            <InfoItem
              icon={<Calendar className="h-4 w-4" />}
              label="Age"
              value={profileData.age}
              colorClass="text-blue-500"
            />
            <InfoItem
              icon={<PhoneCall className="h-4 w-4" />}
              label="Emergency Contact"
              value={profileData.emergencyContact}
              colorClass="text-blue-500"
            />
            <InfoItem
              icon={<Ruler className="h-4 w-4" />}
              label="Height"
              value={
                profileData.height ? `${profileData.height} cm` : undefined
              }
              colorClass="text-blue-500"
            />
            <InfoItem
              icon={<Weight className="h-4 w-4" />}
              label="Weight"
              value={
                profileData.weight ? `${profileData.weight} kg` : undefined
              }
              colorClass="text-blue-500"
            />
            <GenderDisplay value={profileData.gender} />
            <BloodGroupDisplay value={profileData.bloodGroup} />
          </div>
        </Card>

        {/* Current Medical Information - Takes 2/3 width on xl */}
        <Card className="p-4 xl:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold">Current Medical Status</h3>
              <p className="text-sm text-muted-foreground">
                Your current health conditions
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              icon={<AlertCircle className="h-4 w-4" />}
              label="Allergies"
              value={profileData.allergies || "No allergies reported"}
              isAlert
            />
            <InfoItem
              icon={<Pill className="h-4 w-4" />}
              label="Current Medications"
              value={profileData.currentMedications || "No current medications"}
              colorClass="text-yellow-500"
            />
            <InfoItem
              icon={<Activity className="h-4 w-4" />}
              label="Chronic Conditions"
              value={profileData.chronicConditions || "No chronic conditions"}
              colorClass="text-yellow-500"
            />
          </div>
        </Card>

        {/* Medical History - Takes 2/3 width on xl */}
        <Card className="p-4 xl:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope className="h-5 w-5 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">Medical History</h3>
              <p className="text-sm text-muted-foreground">
                Your past medical records
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoItem
              icon={<FileText className="h-4 w-4" />}
              label="Surgical History"
              value={profileData.surgicalHistory || "No surgical history"}
              colorClass="text-green-500"
            />
            <InfoItem
              icon={<HeartPulse className="h-4 w-4" />}
              label="Medical History"
              value={profileData.medicalHistory || "No medical history"}
              colorClass="text-green-500"
            />
            <InfoItem
              icon={<Users className="h-4 w-4" />}
              label="Family Medical History"
              value={profileData.familyHistory || "No family medical history"}
              colorClass="text-green-500"
            />
            <InfoItem
              icon={<Bike className="h-4 w-4" />}
              label="Lifestyle & Habits"
              value={profileData.lifestyle || "No lifestyle information"}
              colorClass="text-green-500"
            />
          </div>
        </Card>

        {/* Account Information - Takes 1/3 width on xl */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-purple-500" />
            <div>
              <h3 className="text-lg font-semibold">Account Information</h3>
              <p className="text-sm text-muted-foreground">
                Your account details and activity
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <InfoItem
              icon={<Calendar className="h-4 w-4" />}
              label="Account Created"
              value={new Date(profileData.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }
              )}
              colorClass="text-purple-500"
            />
            <InfoItem
              icon={<Calendar className="h-4 w-4" />}
              label="Last Login"
              value={new Date(profileData.lastLogin).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }
              )}
              colorClass="text-purple-500"
            />
          </div>
        </Card>

        {/* System Information Cards - Each takes 1/3 width on xl */}
        <SystemInfoCard
          title="Creation Information"
          info={profileData.creatorInfo}
          icon={<Monitor className="h-5 w-5" />}
          colorClass="text-purple-500"
        />
        <SystemInfoCard
          title="Last Update Information"
          info={profileData.updaterInfo}
          icon={<History className="h-5 w-5" />}
          colorClass="text-indigo-500"
        />
      </div>
    </div>
  );
}
