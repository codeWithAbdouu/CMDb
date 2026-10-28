import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";

import { useUpdatePassword } from "@/hooks/user/useUpdatePassword.js";

const passwordSchema = z
    .object({
        passwordCurrent: z
            .string()
            .min(1, "Current password is required."),

        newPassword: z
            .string()
            .min(1, "New password is required.")
            .min(6, "Password must be at least 6 characters."),

        confirmPassword: z
            .string()
            .min(1, "Please confirm your new password."),
    })
    .refine(
        (data) => data.newPassword === data.confirmPassword,
        {
            message: "Passwords do not match.",
            path: ["confirmPassword"],
        }
    )
    .refine(
        (data) => data.passwordCurrent !== data.newPassword,
        {
            message:
                "New password must be different from your current password.",
            path: ["newPassword"],
        }
    );

function PasswordForm() {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            passwordCurrent: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const { mutateAsync: updatePassword, isPending } =
        useUpdatePassword();

    const onSubmit = async (values) => {
        clearErrors("root");

        try {
            await updatePassword({
                passwordCurrent: values.passwordCurrent,
                password: values.newPassword,
                passwordConfirm: values.confirmPassword,
            });

            toast.success("Password updated successfully.");
            reset();
        } catch (err) {
            console.error("PASSWORD UPDATE ERROR:", err);

            const message =
                err.response?.data?.message ||
                "Failed to update password. Please try again.";

            setError("root.server", {
                type: "server",
                message,
            });

            toast.error(message);
        }
    };

    const onInvalid = (formErrors) => {
        console.log("Password validation errors:", formErrors);
        toast.error("Please fix the errors in the form.");
    };

    const isBusy = isSubmitting || isPending;

    return (
        <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="space-y-4"
            noValidate
        >
            {errors.root?.server && (
                <p
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
                >
                    {errors.root.server.message}
                </p>
            )}

            {/* Current password */}
            <div className="space-y-2">
                <Label htmlFor="old-password">Current password</Label>

                <Input
                    id="old-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register("passwordCurrent")}
                    disabled={isBusy}
                    aria-invalid={!!errors.passwordCurrent}
                />

                <FieldErr msg={errors.passwordCurrent?.message} />
            </div>

            {/* New password */}
            <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>

                <Input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    {...register("newPassword")}
                    disabled={isBusy}
                    aria-invalid={!!errors.newPassword}
                />

                <FieldErr msg={errors.newPassword?.message} />
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
                <Label htmlFor="confirm-password">
                    Confirm new password
                </Label>

                <Input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    disabled={isBusy}
                    aria-invalid={!!errors.confirmPassword}
                />

                <FieldErr msg={errors.confirmPassword?.message} />
            </div>

            <Button type="submit" disabled={isBusy}>
                {isBusy ? "Updating password..." : "Update password"}
            </Button>
        </form>
    );
}

function FieldErr({ msg }) {
    if (!msg) return null;

    return (
        <p role="alert" className="text-sm font-medium text-destructive">
            {msg}
        </p>
    );
}

export default PasswordForm;