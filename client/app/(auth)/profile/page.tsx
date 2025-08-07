"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, ShieldCheck, Edit3, Save, X } from "lucide-react";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.userName.firstName + " " + user?.userName.lastName || "",
    email: user?.userEmail || "",
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <p className="text-center text-gray-400">
              Please log in to view your profile.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      // Simulate API call to update user profile
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Your profile has been successfully updated.");

      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.userName.firstName + " " + user?.userName.lastName || "",
      email: user?.userEmail || "",
    });
    setIsEditing(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "author":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-green-500/20 text-green-400 border-green-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Summary Card */}
          <Card className="md:col-span-1 bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 bg-gradient-to-r from-green-400 to-green-600 mb-4">
                  <AvatarFallback className="bg-gradient-to-r from-green-400 to-green-600 text-white text-2xl">
                    {user.userName.firstName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <h2 className="text-xl font-semibold text-white mb-2">
                  {user?.userName.firstName + " " + user?.userName.lastName}
                </h2>
                <p className="text-gray-400 mb-3">{user.userEmail}</p>

                <Badge className={`${getRoleBadgeColor(user.userRole)} border`}>
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  {user.userRole.charAt(0).toUpperCase() +
                    user.userRole.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details Card */}
          <Card className="md:col-span-2 bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </div>

              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-gray-300 flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-800 px-3 py-2 rounded-md border border-gray-700">
                      {user?.userName.firstName + " " + user?.userName.lastName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-gray-300 flex items-center"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-800 px-3 py-2 rounded-md border border-gray-700">
                      {user?.userEmail}
                    </p>
                  )}
                </div>

                <Separator className="bg-gray-800" />

                <div className="space-y-2">
                  <Label className="text-gray-300">Account Type</Label>
                  <p className="text-gray-400 text-sm">
                    Your account type determines your permissions within the
                    application.
                  </p>
                  <Badge
                    className={`${getRoleBadgeColor(
                      user.userRole
                    )} border w-fit`}
                  >
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    {user.userRole.charAt(0).toUpperCase() +
                      user.userRole.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
