"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { changePassword } from "@/lib/firebase/change-password";
import { useAuth } from "@/lib/hooks/use-auth";
import { Bell, Lock, User, LucideIcon, Eye, PenSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const settingsSections = [
  {
    title: "Profile Settings",
    icon: User,
    settings: [
      {
        name: "View Profile",
        description: "View your profile information",
        action: "View",
        onClick: "handleViewProfile",
        icon: Eye,
      },
      {
        name: "Edit Profile",
        description: "Update your personal details",
        action: "Edit",
        onClick: "handleEditProfile",
        icon: PenSquare,
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
        onClick: "handleChangePassword",
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
];

interface SettingProps {
  name: string;
  description: string;
  action: string;
  onClick?: string;
  icon?: LucideIcon;
}

interface SectionProps {
  title: string;
  icon: LucideIcon;
  settings: SettingProps[];
}

function ChangePasswordDialog() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No email found for the current user.",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords do not match.",
      });
      return;
    }

    try {
      setIsLoading(true);
      await changePassword(
        user.email,
        formData.currentPassword,
        formData.newPassword
      );
      toast({
        title: "Success",
        description: "Password changed successfully.",
      });
      setIsOpen(false);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Failed to change password. Please check your current password and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SettingsSection({ title, icon: Icon, settings }: SectionProps) {
  const router = useRouter();
  const { role } = useAuth();

  const handleViewProfile = () => {
    router.push(`/${role}/profile`);
  };

  const handleEditProfile = () => {
    router.push(`/${role}/profile/edit`);
  };

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
            <div className="flex items-center gap-3">
              {setting.icon && (
                <setting.icon className="h-4 w-4 text-gray-500" />
              )}
              <div>
                <p className="font-medium text-gray-900">{setting.name}</p>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
            </div>
            {setting.onClick === "handleChangePassword" ? (
              <ChangePasswordDialog />
            ) : setting.onClick === "handleEditProfile" ? (
              <Button variant="outline" onClick={handleEditProfile}>
                {setting.action}
              </Button>
            ) : setting.onClick === "handleViewProfile" ? (
              <Button variant="outline" onClick={handleViewProfile}>
                {setting.action}
              </Button>
            ) : (
              <Button variant="outline">{setting.action}</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, role } = useAuth();

  if (!user || !role) {
    return null;
  }

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
