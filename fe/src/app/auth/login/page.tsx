"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { login } from "@/lib/api";
import { saveAuthSession } from "@/lib/authStorage";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const user = await login({ email, password });
            saveAuthSession(user);
            if (user.role === "ADMIN") {
                router.replace("/admin");
                return;
            }

            const redirect = searchParams.get("redirect") || "/";
            router.replace(redirect);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Đăng nhập thất bại";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
                <h1 className="text-2xl font-bold text-primary mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    Đăng nhập
                </h1>
                <p className="text-sm text-muted mb-6">Truy cập tài khoản để đặt hàng và quản lý đơn.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block">
                        <span className="text-sm font-medium text-primary">Email</span>
                        <div className="mt-1.5 relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-primary">Mật khẩu</span>
                        <div className="mt-1.5 relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent"
                                placeholder="******"
                                required
                            />
                        </div>
                    </label>

                    {error && (
                        <p className="text-sm text-cta flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover disabled:opacity-70"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                        {submitting ? "Đang chuyển trang..." : "Đăng nhập"}
                    </button>
                </form>

                <p className="text-sm text-muted mt-5 text-center">
                    Chưa có tài khoản?{" "}
                    <Link href="/auth/register" className="text-accent font-semibold hover:underline">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}
