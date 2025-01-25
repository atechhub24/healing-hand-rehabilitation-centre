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
  Droplets,
  AlertCircle,
  FileText,
  PenSquare,
  Globe,
  Monitor,
  Languages,
  Clock,
  Laptop,
  LayoutGrid,
  Shield,
  History,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { Badge } from "@/components/ui/badge";

interface UserData {
  uid: string;
  role: string;
  phoneNumber: string;
  name?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  allergies?: string;
  medicalHistory?: string;
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
        <p className="text-base">{value}</p>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">
              View your profile information
            </p>
            <Badge variant="outline" className="capitalize">
              {profileData.role}
            </Badge>
          </div>
        </div>
        <Button onClick={handleEdit} className="gap-2">
          <PenSquare className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <p className="text-sm text-muted-foreground">
                Your basic profile details
              </p>
            </div>
          </div>

          <div className="space-y-4">
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
              icon={<UserCircle2 className="h-4 w-4" />}
              label="Gender"
              value={profileData.gender}
              colorClass="text-blue-500"
            />
            <InfoItem
              icon={<Droplets className="h-4 w-4" />}
              label="Blood Group"
              value={profileData.bloodGroup}
              colorClass="text-blue-500"
            />
          </div>
        </Card>

        {/* Medical Information */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold">Medical Information</h3>
              <p className="text-sm text-muted-foreground">
                Your health-related details
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <InfoItem
              icon={<AlertCircle className="h-4 w-4" />}
              label="Allergies"
              value={profileData.allergies || "No allergies reported"}
              isAlert
            />
            <InfoItem
              icon={<FileText className="h-4 w-4" />}
              label="Medical History"
              value={
                profileData.medicalHistory || "No medical history reported"
              }
              colorClass="text-yellow-500"
            />
          </div>
        </Card>

        {/* Account Information */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">Account Information</h3>
              <p className="text-sm text-muted-foreground">
                Your account details and activity
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <InfoItem
              icon={<Shield className="h-4 w-4" />}
              label="User ID"
              value={profileData.uid}
              colorClass="text-green-500"
            />
            <InfoItem
              icon={<Clock className="h-4 w-4" />}
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
              colorClass="text-green-500"
            />
            <InfoItem
              icon={<History className="h-4 w-4" />}
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
              colorClass="text-green-500"
            />
          </div>
        </Card>

        {/* Creation Info */}
        <SystemInfoCard
          title="Creation Information"
          info={profileData.creatorInfo}
          icon={<Monitor className="h-5 w-5" />}
          colorClass="text-purple-500"
        />

        {/* Update Info */}
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
