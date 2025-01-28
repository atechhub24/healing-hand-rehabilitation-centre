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
import {
  Bell,
  Eye,
  EyeOff,
  Lock,
  LucideIcon,
  PenSquare,
  User,
} from "lucide-react";
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
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
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

    // Password validation
    if (formData.newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Invalid Password",
        description: "New password must be at least 8 characters long.",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "New passwords do not match.",
      });
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast({
        variant: "destructive",
        title: "Invalid Password",
        description: "New password must be different from current password.",
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
    } catch (error) {
      toast({
        variant: "destructive",
        title: error instanceof Error ? error.message : "Error",
        description:
          "Failed to change password. Please check your current password and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="transition-all duration-200 hover:border-primary"
        >
          Change
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Change Password
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters long
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2">Changing...</span>
                </>
              ) : (
                "Change Password"
              )}
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
    <div className="bg-background rounded-xl border border-border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg bg-muted p-3 transition-colors duration-200">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <div className="space-y-4">
        {settings.map((setting, index) => (
          <div
            key={index}
            className="group flex items-center justify-between py-3 border-t border-border transition-colors duration-200 hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              {setting.icon && (
                <setting.icon className="h-4 w-4 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
              )}
              <div>
                <p className="font-medium text-foreground transition-colors duration-200 group-hover:text-primary">
                  {setting.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {setting.description}
                </p>
              </div>
            </div>
            {setting.onClick === "handleChangePassword" ? (
              <ChangePasswordDialog />
            ) : setting.onClick === "handleEditProfile" ? (
              <Button
                variant="outline"
                onClick={handleEditProfile}
                className="transition-all duration-200 hover:border-primary"
              >
                {setting.action}
              </Button>
            ) : setting.onClick === "handleViewProfile" ? (
              <Button
                variant="outline"
                onClick={handleViewProfile}
                className="transition-all duration-200 hover:border-primary"
              >
                {setting.action}
              </Button>
            ) : (
              <Button
                variant="outline"
                className="transition-all duration-200 hover:border-primary"
              >
                {setting.action}
              </Button>
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
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {settingsSections.map((section, index) => (
          <SettingsSection key={index} {...section} />
        ))}
      </div>
    </div>
  );
}
