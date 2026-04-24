"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserProfile } from "@/lib/db";
import { useState } from "react";
import { Edit2, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileEditorProps {
    profile: UserProfile;
    onUpdate: (updates: Partial<UserProfile>) => Promise<void>;
}

export function ProfileEditor({ profile, onUpdate }: ProfileEditorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        display_name: profile.display_name,
        avatar_url: profile.avatar_url,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await onUpdate({
                display_name: formData.display_name,
                avatar_url: formData.avatar_url,
            });
            setIsOpen(false);
            // Toast would be nice here
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-4 right-4 z-20"
                >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your display name and avatar URL
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="display_name">Display Name</Label>
                        <Input
                            id="display_name"
                            name="display_name"
                            value={formData.display_name}
                            onChange={handleInputChange}
                            placeholder="Your trading name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="avatar_url">Avatar URL</Label>
                        <Input
                            id="avatar_url"
                            name="avatar_url"
                            value={formData.avatar_url}
                            onChange={handleInputChange}
                            placeholder="https://i.pravatar.cc/150?u=..."
                            type="url"
                        />
                    </div>

                    {formData.avatar_url && (
                        <div className="space-y-2">
                            <Label>Preview</Label>
                            <div className="flex items-center gap-4">
                                <img
                                    src={formData.avatar_url}
                                    alt="Avatar preview"
                                    className="w-16 h-16 rounded-full border-2 border-border"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3C/svg%3E";
                                    }}
                                />
                                <div className="text-sm text-muted-foreground">
                                    Avatar preview
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isLoading}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
