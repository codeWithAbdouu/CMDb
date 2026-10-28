import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "#src/context/AuthContext.jsx";
import { useUpdateMe } from "#src/hooks/user/useUpdateMe.js";

const profileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Username must be between 2 and 30 characters.")
        .max(30, "Username must be between 2 and 30 characters.")
        .regex(
            /^[a-zA-Z0-9_ ]+$/,
            "Letters, numbers, underscores, and spaces only."
        ),

    bio: z
        .string()
        .trim()
        .max(280, "Bio must be 280 characters or fewer."),
});

function FieldError({ message }) {
    if (!message) return null;

    return (
        <p className="mt-1 text-sm font-medium text-destructive">
            {message}
        </p>
    );
}

export default function ProfileForm() {
    const { user } = useAuth();
    const { mutateAsync: updateMe } = useUpdateMe();

    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            bio: "",
        },
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user.name ?? "",
                bio: user.bio ?? "",
            });
        }
    }, [user, reset]);

    const onSubmit = async (values) => {
        clearErrors("root");

        const name = values.name.trim();
        const bio = values.bio.trim();

        if (
            name === (user?.name ?? "") &&
            bio === (user?.bio ?? "")
        ) {
            toast.info("No changes to save.");
            return;
        }

        try {
            await updateMe({ name, bio });

            toast.success("Profile updated successfully.");
        } catch (err) {
            console.error("PROFILE UPDATE ERROR:", err);

            const message =
                err.response?.data?.message ||
                "Failed to update profile. Please try again.";

            setError("root.server", {
                type: "server",
                message,
            });

            toast.error(message);
        }
    };

    const onInvalid = (formErrors) => {
        console.log("Validation errors:", formErrors);
        toast.error("Please fix the validation errors.");
    };

    return (
        <form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit, onInvalid)}
        >
            {errors.root?.server && (
                <p className="text-sm font-medium text-destructive">
                    {errors.root.server.message}
                </p>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Username</Label>

                <Input
                    id="name"
                    autoComplete="username"
                    placeholder="Enter your username"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.name}
                    {...register("name")}
                />

                <FieldError message={errors.name?.message} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>

                <Input
                    id="email"
                    type="email"
                    value={user?.email ?? ""}
                    disabled
                    readOnly
                />

                <p className="text-sm text-muted-foreground">
                    Your email address cannot be changed here.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>

                <textarea
                    id="bio"
                    placeholder="Tell us a little about yourself"
                    rows={4}
                    disabled={isSubmitting}
                    aria-invalid={!!errors.bio}
                    className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive"
                    {...register("bio")}
                />

                <div className="flex items-center justify-between gap-3">
                    <FieldError message={errors.bio?.message} />

                    <p className="ml-auto shrink-0 text-xs text-muted-foreground">
                        Up to 280 characters
                    </p>
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving changes..." : "Save changes"}
                </Button>
            </div>
        </form>
    );
}