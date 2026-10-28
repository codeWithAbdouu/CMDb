import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useResetPassword } from "@/hooks/user/useResetPassword.js";

const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(1, "Password is required.")
            .min(6, "Password must be at least 6 characters."),

        passwordConfirm: z
            .string()
            .min(1, "Please confirm your password.")
            .min(6, "Password must be at least 6 characters."),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match.",
        path: ["passwordConfirm"],
    });

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const { token } = useParams();

    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            passwordConfirm: "",
        },
    });

    const { mutateAsync } = useResetPassword();

    const onSubmit = async (values) => {
        form.clearErrors("root");

        try {
            const resetData = {
                token,
                passwordData: values,
            };

            await mutateAsync(resetData);

            toast.success("Password reset successfully.");

            form.reset();
            navigate("/");
        } catch (err) {
            console.error("RESET PASSWORD ERROR:", err);

            const message =
                err.response?.data?.message ||
                "Something went wrong. Please try again.";

            form.setError("root.server", {
                type: "server",
                message,
            });

            toast.error(message);
        }
    };

    const onInvalid = (errors) => {
        console.log("Validation errors:", errors);
        toast.error("Please fix the validation errors.");
    };

    useEffect(() => {
        document.title = "Reset Password";
    }, []);

    const isSubmitting = form.formState.isSubmitting;

    return (
        <div className="container-page flex min-h-[80vh] items-center justify-center py-12">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 md:p-8">
                {/* Icon */}
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                </div>

                {/* Heading */}
                <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">
                    Set a new password
                </h1>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Choose a strong password to secure your account.
                </p>

                <form
                    onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                    className="mt-6 space-y-5"
                    noValidate
                >
                    {/* Server error */}
                    {form.formState.errors.root?.server && (
                        <p
                            role="alert"
                            className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
                        >
                            {form.formState.errors.root.server.message}
                        </p>
                    )}

                    {/* New password */}
                    <div className="space-y-2">
                        <Label htmlFor="password">New password</Label>

                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    autoFocus
                                    disabled={isSubmitting}
                                    aria-invalid={
                                        !!form.formState.errors.password
                                    }
                                    aria-describedby={
                                        form.formState.errors.password
                                            ? "password-error"
                                            : undefined
                                    }
                                />
                            )}
                        />

                        {form.formState.errors.password && (
                            <p
                                id="password-error"
                                role="alert"
                                className="text-sm text-destructive"
                            >
                                {form.formState.errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm password */}
                    <div className="space-y-2">
                        <Label htmlFor="passwordConfirm">
                            Confirm new password
                        </Label>

                        <Controller
                            name="passwordConfirm"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="passwordConfirm"
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    disabled={isSubmitting}
                                    aria-invalid={
                                        !!form.formState.errors.passwordConfirm
                                    }
                                    aria-describedby={
                                        form.formState.errors.passwordConfirm
                                            ? "password-confirm-error"
                                            : undefined
                                    }
                                />
                            )}
                        />

                        {form.formState.errors.passwordConfirm && (
                            <p
                                id="password-confirm-error"
                                role="alert"
                                className="text-sm text-destructive"
                            >
                                {
                                    form.formState.errors.passwordConfirm
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="group w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Resetting password..."
                            : "Reset password"}

                        {!isSubmitting && (
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        )}
                    </Button>
                </form>

                {/* Back to sign in */}
                <div className="mt-6">
                    <Link
                        to="/auth"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}