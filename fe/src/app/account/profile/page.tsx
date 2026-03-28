"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Shield, Loader2, Pencil, X } from "lucide-react";
import Image from "next/image";
import { getMyProfile, updateMyProfile } from "@/lib/api";
import { getAuthToken, getStoredUser, saveAuthSession } from "@/lib/authStorage";
import type { UserProfile } from "@/lib/types";

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [editFullName, setEditFullName] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editAvatarUrl, setEditAvatarUrl] = useState("");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            router.replace("/auth/login");
            return;
        }

        getMyProfile(token)
            .then((data) => {
                setProfile(data);
                setEditFullName(data.fullName || "");
                setEditPhone(data.phone || "");
                setEditAvatarUrl(data.avatarUrl || "");
            })
            .catch((err) => {
                const message = err instanceof Error ? err.message : "Không tải được thông tin tài khoản";
                setError(message);
            })
            .finally(() => setLoading(false));
    }, [router]);

    const handleSaveProfile = async () => {
        const token = getAuthToken();
        if (!token || !profile) return;

        setSaving(true);
        setError("");
        try {
            const updated = await updateMyProfile(
                {
                    fullName: editFullName.trim(),
                    phone: editPhone.trim() || undefined,
                    avatarUrl: editAvatarUrl.trim() || undefined,
                },
                token
            );

            setProfile(updated);
            setEditOpen(false);

            const stored = getStoredUser();
            if (stored) {
                saveAuthSession({
                    ...stored,
                    fullName: updated.fullName,
                    phone: updated.phone,
                    avatarUrl: updated.avatarUrl,
                });
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Không thể cập nhật thông tin";
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 flex items-center justify-center gap-2 text-muted">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tải thông tin cá nhân...
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <p className="text-sm text-cta">{error || "Không có dữ liệu tài khoản"}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
            <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Thông tin cá nhân
            </h1>
            <p className="text-sm text-muted mt-1">Quản lý thông tin tài khoản của bạn.</p>

            <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover"
            >
                <Pencil className="w-4 h-4" /> Chỉnh sửa thông tin
            </button>

            <div className="mt-6 bg-white border border-border rounded-2xl p-5 sm:p-6 space-y-4">
                {profile.avatarUrl ? (
                    <Image src={profile.avatarUrl} alt={profile.fullName} width={80} height={80} className="w-20 h-20 rounded-2xl object-cover border border-border" />
                ) : null}
                <div className="flex items-center gap-2 text-primary">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{profile.fullName}</span>
                </div>
                <div className="flex items-center gap-2 text-primary-light">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-primary-light">
                    <Phone className="w-4 h-4" />
                    <span>{profile.phone || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center gap-2 text-primary-light">
                    <Shield className="w-4 h-4" />
                    <span>Vai trò: {profile.role || "USER"}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border">
                    <div className="text-sm text-primary-light">ID tài khoản: <span className="font-semibold text-primary">#{profile.id}</span></div>
                    <div className="text-sm text-primary-light">Trạng thái: <span className="font-semibold text-success">Đang hoạt động</span></div>
                </div>
            </div>

            {editOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setEditOpen(false)} />
                    <div className="relative w-full max-w-md bg-white rounded-2xl border border-border p-5 sm:p-6">
                        <button
                            type="button"
                            onClick={() => setEditOpen(false)}
                            className="absolute top-3 right-3 p-2 rounded-lg hover:bg-slate-100"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <h2 className="text-lg font-bold text-primary" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            Chỉnh sửa thông tin
                        </h2>

                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-primary">Họ và tên</label>
                                <input
                                    value={editFullName}
                                    onChange={(e) => setEditFullName(e.target.value)}
                                    className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-primary">Số điện thoại</label>
                                <input
                                    value={editPhone}
                                    onChange={(e) => setEditPhone(e.target.value)}
                                    className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-primary">URL ảnh đại diện</label>
                                <input
                                    value={editAvatarUrl}
                                    onChange={(e) => setEditAvatarUrl(e.target.value)}
                                    className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleSaveProfile}
                                disabled={saving || !editFullName.trim()}
                                className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover disabled:opacity-70"
                            >
                                {saving ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
