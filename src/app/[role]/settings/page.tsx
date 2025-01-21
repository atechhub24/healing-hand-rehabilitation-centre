"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { Bell, Lock, User, Globe, Moon } from "lucide-react";

const settingsSections = [
  {
    title: "Profile Settings",
    icon: User,
    settings: [
      {
        name: "Update Profile Picture",
        description: "Change your profile photo",
        action: "Upload",
      },
      {
        name: "Personal Information",
        description: "Update your personal details",
        action: "Edit",
      },
    ],
  },
  {
    title: "Security",
    icon: Lock,
    settings: [
      {
        name: "Change Password",
        description: "Update your password",
        action: "Change",
      },
      {
        name: "Two-Factor Authentication",
        description: "Add extra security to your account",
        action: "Enable",
      },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    settings: [
      {
        name: "Email Notifications",
        description: "Manage email notification preferences",
        action: "Configure",
      },
      {
        name: "Push Notifications",
        description: "Manage push notification settings",
        action: "Configure",
      },
    ],
  },
  {
    title: "Preferences",
    icon: Globe,
    settings: [
      {
        name: "Language",
        description: "Choose your preferred language",
        action: "Select",
      },
      {
        name: "Theme",
        description: "Choose light or dark theme",
        action: "Select",
      },
    ],
  },
];

function SettingsSection({ title, icon: Icon, settings }) {
  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg bg-gray-100 p-3">
          <Icon className="h-6 w-6 text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">
        {settings.map((setting, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 border-t"
          >
            <div>
              <p className="font-medium text-gray-900">{setting.name}</p>
              <p className="text-sm text-gray-500">{setting.description}</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700">
              {setting.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const params = useParams();
  const { role } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {settingsSections.map((section, index) => (
          <SettingsSection key={index} {...section} />
        ))}
      </div>
    </div>
  );
}
