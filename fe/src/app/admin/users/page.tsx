"use client";

import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminShell from "@/components/admin/AdminShell";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { deleteAdminUser, getAdminUserById, getAdminUsers, updateAdminUser } from "@/lib/api";
import { getStoredUser } from "@/lib/authStorage";
import type { AdminUser } from "@/lib/types";

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
    const { token, checking } = useAdminGuard();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchDraft, setSearchDraft] = useState("");
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [activeFilter, setActiveFilter] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [selected, setSelected] = useState<AdminUser | null>(null);
    const [editing, setEditing] = useState<AdminUser | null>(null);
    const [fullNameDraft, setFullNameDraft] = useState("");
    const [phoneDraft, setPhoneDraft] = useState("");
    const [roleDraft, setRoleDraft] = useState<"CUSTOMER" | "ADMIN">("CUSTOMER");
    const [activeDraft, setActiveDraft] = useState(true);

    const currentUser = getStoredUser();

    const loadUsers = async (authToken: string, params?: {
        search?: string;
        role?: "CUSTOMER" | "ADMIN";
        isActive?: boolean;
        page?: number;
    }) => {
        const result = await getAdminUsers(authToken, { size: PAGE_SIZE, ...params });
        setUsers(result.content || []);
        setPageIndex(result.number || 0);
        setTotalPages(Math.max(1, result.totalPages || 1));
        setTotalElements(result.totalElements || 0);
    };

    useEffect(() => {
        if (!token) return;
        loadUsers(token, { page: 0 })
            .catch((err) => setError(err instanceof Error ? err.message : "Không tải được danh sách người dùng"))
            .finally(() => setLoading(false));
    }, [token]);

    const applyFilter = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const keyword = searchDraft.trim();
            setSearch(keyword);
            await loadUsers(token, {
                search: keyword || undefined,
                role: (role || undefined) as "CUSTOMER" | "ADMIN" | undefined,
                isActive: activeFilter === "" ? undefined : activeFilter === "true",
                page: 0,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không lọc được người dùng");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = async (nextPage: number) => {
        if (!token) return;
        setLoading(true);
        try {
            await loadUsers(token, {
                search: search || undefined,
                role: (role || undefined) as "CUSTOMER" | "ADMIN" | undefined,
                isActive: activeFilter === "" ? undefined : activeFilter === "true",
                page: nextPage,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không chuyển trang được");
        } finally {
            setLoading(false);
        }
    };

    const openDetail = async (userId: number) => {
        if (!token) return;
        setDetailLoading(true);
        try {
            const detail = await getAdminUserById(userId, token);
            setSelected(detail);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không tải được chi tiết người dùng");
        } finally {
            setDetailLoading(false);
        }
    };

    const openEdit = (user: AdminUser) => {
        setEditing(user);
        setFullNameDraft(user.fullName);
        setPhoneDraft(user.phone || "");
        setRoleDraft(user.role);
        setActiveDraft(user.isActive);
    };

    const saveEdit = async () => {
        if (!token || !editing) return;
        setSaving(true);
        try {
            const updated = await updateAdminUser(
                editing.id,
                {
                    fullName: fullNameDraft.trim() || undefined,
                    phone: phoneDraft,
                    role: roleDraft,
                    isActive: activeDraft,
                },
                token
            );
            setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
            setEditing(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không cập nhật được thông tin người dùng");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (user: AdminUser) => {
        if (!token) return;
        if (currentUser?.id === user.id) {
            setError("Không thể tự xóa tài khoản admin đang đăng nhập");
            return;
        }
        const agreed = window.confirm(`Xóa người dùng \"${user.fullName}\"?`);
        if (!agreed) return;

        try {
            await deleteAdminUser(user.id, token);
            const nextPage = users.length === 1 && pageIndex > 0 ? pageIndex - 1 : pageIndex;
            await loadUsers(token, {
                search: search || undefined,
                role: (role || undefined) as "CUSTOMER" | "ADMIN" | undefined,
                isActive: activeFilter === "" ? undefined : activeFilter === "true",
                page: nextPage,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không xóa được người dùng");
        }
    };

    if (checking || loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12 flex items-center justify-center gap-2 text-muted">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tải người dùng...
            </div>
        );
    }

    return (
        <AdminShell title="Quản lý người dùng" subtitle="Xem chi tiết, cập nhật thông tin và xóa tài khoản">
            <div className="bg-white border border-border rounded-2xl p-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div className="relative sm:col-span-2">
                        <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            value={searchDraft}
                            onChange={(e) => setSearchDraft(e.target.value)}
                            placeholder="Tìm theo email, tên, số điện thoại"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent"
                        />
                    </div>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent">
                        <option value="">Tất cả vai trò</option>
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                    <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent">
                        <option value="">Tất cả trạng thái</option>
                        <option value="true">Đang hoạt động</option>
                        <option value="false">Đã khóa</option>
                    </select>
                </div>
                <button type="button" onClick={applyFilter} className="mt-3 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light">Áp dụng</button>
            </div>

            {error && <p className="mt-4 text-sm text-cta">{error}</p>}

            <div className="mt-4 bg-white border border-border rounded-2xl overflow-x-auto">
                <table className="w-full min-w-[1120px] text-sm">
                    <thead className="bg-slate-50 text-primary-light">
                        <tr>
                            <th className="px-4 py-3 text-left">Người dùng</th>
                            <th className="px-4 py-3 text-left">Liên hệ</th>
                            <th className="px-4 py-3 text-left">Vai trò</th>
                            <th className="px-4 py-3 text-left">Trạng thái</th>
                            <th className="px-4 py-3 text-left">Ngày tạo</th>
                            <th className="px-4 py-3 text-left">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            return (
                                <tr key={user.id} className="border-t border-border">
                                    <td className="px-4 py-3">
                                        <p className="font-semibold text-primary">{user.fullName}</p>
                                        <p className="text-xs text-muted">ID: #{user.id}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-primary-light">{user.email}</p>
                                        <p className="text-xs text-muted">{user.phone || "Chưa có SĐT"}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-primary-light">{user.role}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                                            user.isActive ? "bg-success/10 text-success" : "bg-slate-200 text-slate-700"
                                        }`}>
                                            {user.isActive ? "Đang hoạt động" : "Đã khóa"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted">{new Date(user.createdAt).toLocaleString("vi-VN")}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openDetail(user.id)}
                                                className="px-3 py-1.5 rounded-lg border border-border text-primary hover:border-accent"
                                            >
                                                Chi tiết
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openEdit(user)}
                                                className="px-3 py-1.5 rounded-lg bg-slate-100 text-primary hover:bg-slate-200"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(user)}
                                                className="px-3 py-1.5 rounded-lg bg-cta/10 text-cta hover:bg-cta/20"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <AdminPagination currentPage={pageIndex} totalPages={totalPages} onPageChange={handlePageChange} disabled={loading} />
            <p className="mt-2 text-xs text-muted">Tổng {totalElements} người dùng</p>

            {selected && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
                    <div className="relative w-full max-w-lg bg-white rounded-2xl border border-border p-5 sm:p-6">
                        <h2 className="text-lg font-bold text-primary" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            Chi tiết người dùng
                        </h2>
                        <div className="mt-4 space-y-2 text-sm text-primary-light">
                            <p><span className="font-semibold text-primary">Họ tên:</span> {selected.fullName}</p>
                            <p><span className="font-semibold text-primary">Email:</span> {selected.email}</p>
                            <p><span className="font-semibold text-primary">SĐT:</span> {selected.phone || "Chưa có"}</p>
                            <p><span className="font-semibold text-primary">Vai trò:</span> {selected.role}</p>
                            <p><span className="font-semibold text-primary">Trạng thái:</span> {selected.isActive ? "Đang hoạt động" : "Đã khóa"}</p>
                            <p><span className="font-semibold text-primary">Ngày tạo:</span> {new Date(selected.createdAt).toLocaleString("vi-VN")}</p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button type="button" onClick={() => setSelected(null)} className="px-4 py-2 rounded-xl bg-primary text-white">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editing && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
                    <div className="relative w-full max-w-lg bg-white rounded-2xl border border-border p-5 sm:p-6">
                        <h2 className="text-lg font-bold text-primary" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            Cập nhật người dùng #{editing.id}
                        </h2>
                        <div className="mt-4 space-y-3">
                            <label className="block text-sm text-primary-light">
                                Họ tên
                                <input
                                    value={fullNameDraft}
                                    onChange={(e) => setFullNameDraft(e.target.value)}
                                    className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent"
                                />
                            </label>
                            <label className="block text-sm text-primary-light">
                                Số điện thoại
                                <input
                                    value={phoneDraft}
                                    onChange={(e) => setPhoneDraft(e.target.value)}
                                    className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent"
                                />
                            </label>
                            <label className="block text-sm text-primary-light">
                                Vai trò
                                <select
                                    value={roleDraft}
                                    onChange={(e) => setRoleDraft(e.target.value as "CUSTOMER" | "ADMIN")}
                                    className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-accent"
                                >
                                    <option value="CUSTOMER">CUSTOMER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </label>
                            <label className="inline-flex items-center gap-2 text-sm text-primary-light">
                                <input
                                    type="checkbox"
                                    checked={activeDraft}
                                    onChange={(e) => setActiveDraft(e.target.checked)}
                                />
                                Tài khoản đang hoạt động
                            </label>
                        </div>
                        <div className="mt-4 flex items-center justify-end gap-2">
                            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl border border-border text-primary">
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={saveEdit}
                                disabled={saving}
                                className="px-4 py-2 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover disabled:opacity-70"
                            >
                                {saving ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {detailLoading && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30">
                    <div className="bg-white border border-border rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-primary">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang tải chi tiết người dùng...
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
