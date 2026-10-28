import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, KeyRound, ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import PageHeader from "@/components/Layouts/PageHeader.jsx";
import Section from "@/components/Layouts/SectionSettings.jsx";
import ProfileForm from "@/features/ProfileForm.jsx";
import PasswordForm from "@/features/PasswordForm.jsx";

import { useAuth } from "@/context/AuthContext.jsx";

function SettingsPage() {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { user } = useAuth();

    useEffect(() => {
        document.title = "Settings · OMDb+";
    }, []);

    return (
        <div className="container-page mt-8 max-w-3xl pb-16">
            <PageHeader
                title="Settings"
                subtitle="Manage your account, appearance, and security."
            />

            {/* Appearance */}
            <Section title="Appearance">
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant={theme === "dark" ? "default" : "outline"}
                        onClick={() => setTheme("dark")}
                    >
                        <Moon className="mr-1.5 h-4 w-4" />
                        Dark
                    </Button>

                    <Button
                        type="button"
                        variant={theme === "light" ? "default" : "outline"}
                        onClick={() => setTheme("light")}
                    >
                        <Sun className="mr-1.5 h-4 w-4" />
                        Light
                    </Button>
                </div>
            </Section>

            {/* Account */}
            {user ? (
                <>
                    <Section title="Profile">
                        <ProfileForm />
                    </Section>

                    <Section title="Change password">
                        <PasswordForm />

                        <div className="mt-4 border-t border-border pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/forgot-password")}
                                className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                            >
                                <KeyRound className="h-4 w-4" />
                                Forgot password?
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </button>

                            <p className="mt-1.5 text-sm text-muted-foreground">
                                Reset your password using your email address.
                            </p>
                        </div>
                    </Section>
                </>
            ) : (
                <Section title="Account">
                    <p className="mb-4 text-sm text-muted-foreground">
                        Sign in to manage your profile and password.
                    </p>

                    <Button
                        type="button"
                        onClick={() => navigate("/auth")}
                    >
                        Sign in or create an account
                    </Button>
                </Section>
            )}
        </div>
    );
}

export default SettingsPage;