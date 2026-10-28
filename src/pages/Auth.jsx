import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {toast} from "sonner";
import {useSignup} from "@/hooks/user/useSignup.js";
import {useLogin} from "@/hooks/user/useLogin.js";

// Independent UI pieces
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";

/* ==========================================
   VALIDATION SCHEMAS
   ========================================== */
const emailSchema = z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address.");

const loginSchema = z.object({
    email: emailSchema,
    password: z
        .string()
        .min(1, "Password is required.")
        .min(6, "Password must be at least 6 characters."),
});

const registerSchema = z
    .object({
        username: z
            .string()
            .trim()
            .min(2, "Username must be between 2 and 30 characters.")
            .max(30, "Username must be between 2 and 30 characters.")
            .regex(/^[a-zA-Z0-9_ ]+$/, "Letters, numbers, underscores only."),
        email: emailSchema,
        password: z
            .string()
            .min(6, "Password must be at least 6 characters."),
        passwordConfirm: z
            .string()
            .min(6, "Password must be at least 6 characters."),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match.",
        path: ["passwordConfirm"],
    });

/* ==========================================
   MAIN COMPONENT (AUTH PAGE)
   ========================================== */
function AuthPage() {
    const navigate = useNavigate();
    const [tab, setTab] = useState("login");

    return (
        <div className="container-page flex min-h-[80vh] items-center justify-center py-12">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 md:p-8">
                <h1 className="font-display text-2xl font-bold">Welcome to OMDb+</h1>
                <p className="text-sm text-muted-foreground">Track films you love.</p>

                <Tabs value={tab} onValueChange={setTab} className="mt-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Sign in</TabsTrigger>
                        <TabsTrigger value="register">Create account</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="mt-6 focus-visible:ring-0">
                        <LoginForm onDone={() => navigate("/")}/>
                    </TabsContent>

                    <TabsContent value="register" className="mt-6 focus-visible:ring-0">
                        <RegisterForm onDone={() => navigate("/")}/>
                    </TabsContent>
                </Tabs>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                    Demo only — accounts are stored locally in your browser.
                </p>
            </div>
        </div>
    );
}

/* ==========================================
   SIGN IN INTERNAL FORM COMPONENT
   ========================================== */
function LoginForm({onDone}) {
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: {errors, isSubmitting},
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const {
        mutateAsync: login,
        isPending,
    } = useLogin();

    const isBusy = isPending || isSubmitting;

    useEffect(() => {
        document.title = "Sign in · OMDb+";
    }, []);

    const navigate = useNavigate();

    const onSubmit = async ({email, password}) => {
        try {
            const data = await login({
                email,
                password,
            });

            console.log("LOGIN RESPONSE:", data);

            // JWT is stored in an HttpOnly Cookie by the backend.
            // We do NOT access data.token here.

            toast.success("Signed in successfully.");

            onDone();

        } catch (err) {
            console.error("LOGIN ERROR:", err);

            const message =
                err.response?.data?.message ||
                "Invalid email or password.";

            setError("root.server", {
                type: "server",
                message,
            });

            toast.error(message);
        }
    };

    const onInvalid = () => {
        toast.error("Please fix the errors in the form.");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4" noValidate>

            {/* General Error */}
            {errors.root?.server && (
                <div
                    className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {errors.root.server.message}
                </div>
            )}

            {/* Email */}
            <div>
                <Label htmlFor="login-email">
                    Email
                </Label>

                <Input
                    id="login-email"
                    type="email"
                    {...register("email", {
                        onChange: () => clearErrors("root.server"),
                    })}
                    autoFocus
                    disabled={isBusy}
                />

                <FieldErr msg={errors.email?.message}/>
            </div>

            {/* Password */}
            <div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">
                        Password
                    </Label>

                    <Link
                        to="/forgot-password"
                        className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                <Input
                    id="login-password"
                    type="password"
                    {...register("password", {
                        onChange: () => clearErrors("root.server"),
                    })}
                    disabled={isBusy}
                />

                <FieldErr msg={errors.password?.message}/>
            </div>

            {/* Submit */}
            <Button
                type="submit"
                className="w-full"
                disabled={isBusy}
            >
                {isBusy ? "Signing in..." : "Sign in"}
            </Button>
        </form>
    );
}

/* ==========================================
   REGISTRATION INTERNAL FORM COMPONENT
   ========================================== */
function RegisterForm({onDone}) {
    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            passwordConfirm: "",
        },
    });

    const {
        mutateAsync: signup,
        isPending,
    } = useSignup();

    const isBusy = isPending || isSubmitting;

    useEffect(() => {
        document.title = "Sign up · OMDb+";
    }, []);

    const onSubmit = async ({username, email, password, passwordConfirm}) => {
        try {
            const data = await signup({
                name: username,
                email,
                password,
                passwordConfirm,
            });

            console.log("SIGNUP RESPONSE:", data);

            // JWT is stored in HttpOnly Cookie.
            // We do NOT access data.token from React.

            toast.success("Account created successfully.");

            onDone();

        } catch (err) {
            console.error("SIGNUP ERROR:", err);

            const message =
                err.response?.data?.message ||
                "Something went wrong. Please try again.";

            setError("root.server", {
                type: "server",
                message,
            });

            toast.error(message);
        }
    };

    const onInvalid = () => {
        toast.error("Please fix the errors in the form.");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4" noValidate>

            {/* General Error */}
            {errors.root?.server && (
                <div
                    className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {errors.root.server.message}
                </div>
            )}

            {/* Username */}
            <div>
                <Label htmlFor="register-username">
                    Username
                </Label>

                <Input
                    id="register-username"
                    {...register("username")}
                    autoFocus
                    disabled={isBusy}
                />

                <FieldErr msg={errors.username?.message}/>
            </div>

            {/* Email */}
            <div>
                <Label htmlFor="register-email">
                    Email
                </Label>

                <Input
                    id="register-email"
                    type="email"
                    {...register("email")}
                    disabled={isBusy}
                />

                <FieldErr msg={errors.email?.message}/>
            </div>

            {/* Password */}
            <div>
                <Label htmlFor="register-password">
                    Password
                </Label>

                <Input
                    id="register-password"
                    type="password"
                    {...register("password")}
                    disabled={isBusy}
                />

                <FieldErr msg={errors.password?.message}/>
            </div>

            {/* Password Confirm */}
            <div>
                <Label htmlFor="register-password-confirm">
                    Password Confirm
                </Label>

                <Input
                    id="register-password-confirm"
                    type="password"
                    {...register("passwordConfirm")}
                    disabled={isBusy}
                />

                <FieldErr msg={errors.passwordConfirm?.message}/>
            </div>

            {/* Submit */}
            <Button
                type="submit"
                className="w-full"
                disabled={isBusy}
            >
                {isBusy
                    ? "Creating account..."
                    : "Create account"}
            </Button>
        </form>
    );
}

/* ==========================================
   FORM ERROR WRAPPER COMPONENT
   ========================================== */
function FieldErr({msg}) {
    if (!msg) return null;
    return <p className="mt-1 text-xs text-destructive font-medium">{msg}</p>;
}

export default AuthPage;