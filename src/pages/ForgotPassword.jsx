import { useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";
import { KeyRound, ArrowLeft, ArrowRight } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForgotPassword } from "@/hooks/user/useForgotPassword.js";
import {useAuth} from "@/context/AuthContext.jsx";

const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required.")
        .email("Please enter a valid email address."),
});

export default function ForgotPasswordPage() {
    const form = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const {user} = useAuth();

    const navigate = useNavigate();

    const { mutateAsync } = useForgotPassword();

    const onSubmit = async (values) => {
        form.clearErrors("root");

        try {
            await mutateAsync(values.email);

            toast.success("Please check your email for further instructions.");

            form.reset();
        } catch (err) {
            console.error("FORGOT PASSWORD ERROR:", err);

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
        document.title = "Forgot Password";
    }, []);

    const isSubmitting = form.formState.isSubmitting;

    return (
        <div className="container-page flex min-h-[80vh] items-center justify-center py-12">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 md:p-8">
                {/* Icon */}
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <KeyRound className="h-5 w-5" />
                </div>

                {/* Heading */}
                <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">
                    Forgot your password?
                </h1>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Enter your email address and we'll send you instructions
                    to reset your password.
                </p>

                <form
                    className="mt-6 space-y-5"
                    onSubmit={form.handleSubmit(onSubmit, onInvalid)}
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

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>

                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="email"
                                    type="email"
                                    placeholder="alex@gmail.com"
                                    autoComplete="email"
                                    autoFocus
                                    disabled={isSubmitting}
                                    aria-invalid={!!form.formState.errors.email}
                                    aria-describedby={
                                        form.formState.errors.email
                                            ? "email-error"
                                            : undefined
                                    }
                                />
                            )}
                        />

                        {form.formState.errors.email && (
                            <p
                                id="email-error"
                                role="alert"
                                className="text-sm text-destructive"
                            >
                                {form.formState.errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="group w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Sending..." : "Send reset link"}

                        {!isSubmitting && (
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        )}
                    </Button>
                </form>

                {
                    user ? (
                        <>
                            {/* Back to settings */}
                            <Link
                                to="/settings"
                                className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to settings
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* Back to sign in */}
                            <Link
                                to="/auth"
                                className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to sign in
                            </Link>
                        </>
                    )
                }
            </div>
        </div>
    );
}