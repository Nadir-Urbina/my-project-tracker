"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { updateProfile, updatePassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { LuUser, LuMail, LuLock, LuPalette, LuLogOut, LuCamera } from "react-icons/lu";
import { useToast } from "@/components/ui/Toast";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if user signed in with Google
  const isGoogleUser = user?.providerData.some(
    (provider) => provider.providerId === "google.com"
  );

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateProfile(user, {
        displayName: displayName || null,
        photoURL: photoURL || null,
      });
      toast("Profile updated successfully", "success");
    } catch (error) {
      toast("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user || !auth.currentUser) return;
    if (newPassword !== confirmPassword) {
      toast("Passwords do not match", "error");
      return;
    }
    if (newPassword.length < 6) {
      toast("Password must be at least 6 characters", "error");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      setNewPassword("");
      setConfirmPassword("");
      toast("Password updated successfully", "success");
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login") {
        toast("Please sign out and sign in again to change your password", "error");
      } else {
        toast("Failed to update password", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      toast("Failed to sign out", "error");
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Profile & Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="flex items-center gap-2">
              <LuUser className="h-4 w-4 text-blue-500" />
              Profile Information
            </span>
          </CardTitle>
        </CardHeader>
        <div className="space-y-4 px-4 pb-4">
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              {photoURL || user.photoURL ? (
                <img
                  src={photoURL || user.photoURL || ""}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-zinc-400">
                  {(displayName || user.displayName || user.email || "U")[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Photo URL
              </label>
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <span className="flex items-center gap-1.5">
                <LuMail className="h-3.5 w-3.5" />
                Email
              </span>
            </label>
            <input
              type="email"
              value={user.email || ""}
              disabled
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleUpdateProfile} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Password (Only for email/password users) */}
      {!isGoogleUser && (
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="flex items-center gap-2">
                <LuLock className="h-4 w-4 text-amber-500" />
                Change Password
              </span>
            </CardTitle>
          </CardHeader>
          <div className="space-y-4 px-4 pb-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleUpdatePassword}
                disabled={loading || !newPassword || !confirmPassword}
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="flex items-center gap-2">
              <LuPalette className="h-4 w-4 text-purple-500" />
              Appearance
            </span>
          </CardTitle>
        </CardHeader>
        <div className="px-4 pb-4">
          <label className="mb-3 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                theme === "light"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                ☀️
              </div>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Light
              </span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                theme === "dark"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 shadow-sm">
                🌙
              </div>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Dark
              </span>
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                theme === "system"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-800 shadow-sm">
                💻
              </div>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                System
              </span>
            </button>
          </div>
        </div>
      </Card>

      {/* Sign Out */}
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="flex items-center gap-2">
              <LuLogOut className="h-4 w-4 text-red-500" />
              Account Actions
            </span>
          </CardTitle>
        </CardHeader>
        <div className="px-4 pb-4">
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            Sign out of your account on this device
          </p>
          <Button variant="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}
