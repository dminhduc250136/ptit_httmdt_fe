"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserPlus, User, Mail, Phone, Lock, AlertCircle, Loader2 } from "lucide-react";
import { register } from "@/lib/api";
import { saveAuthSession } from "@/lib/authStorage";

export default function RegisterPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const user = await register({
                fullName,
                email,
                phone,
                password,
            });
            saveAuthSession(user);
            router.replace("/");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Đăng ký thất bại";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
                <h1 className="text-2xl font-bold text-primary mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    Tạo tài khoản
                </h1>
                <p className="text-sm text-muted mb-6">Đăng ký để mua hàng và theo dõi đơn dễ dàng.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block">
                        <span className="text-sm font-medium text-primary">Họ và tên</span>
                        <div className="mt-1.5 relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent"
                                placeholder="Nguyen Van A"
                                required
                                minLength={3}
                            />
                        </div>
                    </label>

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
                        <span className="text-sm font-medium text-primary">Số điện thoại</span>
                        <div className="mt-1.5 relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent"
                                placeholder="0912345678"
                                required
                                pattern="^0[3-9]\d{8}$"
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
                                placeholder="Tối thiểu 6 ký tự"
                                required
                                minLength={6}
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
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                        {submitting ? "Đang chuyển trang..." : "Đăng ký"}
                    </button>
                </form>

                <p className="text-sm text-muted mt-5 text-center">
                    Đã có tài khoản?{" "}
                    <Link href="/auth/login" className="text-accent font-semibold hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
}
